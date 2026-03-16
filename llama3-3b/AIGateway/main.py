from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
import ollama
from MiddleWare import MiddleWare # File middleware của bạn

app = FastAPI()
middleware = MiddleWare("AppConfig.json")

# Định nghĩa cấu trúc Request từ Frontend gửi lên
class ChatRequest(BaseModel):
    message: str
    role_id: int # Lấy từ Token ở Frontend truyền lên
    history: List[dict] = [] # Lịch sử chat để AI nhớ ngữ cảnh

# 1. Định nghĩa 2 Tools quyền lực nhất
tools = [
    {
        'type': 'function',
        'function': {
            'name': 'redirect_page',
            'description': 'Điều hướng người dùng đến giao diện Web. Chỉ dùng khi người dùng chọn xem trên giao diện.',
            'parameters': {
                'type': 'object',
                'properties': {'url': {'type': 'string', 'description': 'Đường dẫn URL Frontend'}},
                'required': ['url']
            }
        }
    },
    {
        'type': 'function',
        'function': {
            'name': 'call_backend_api',
            'description': 'Gọi API Backend để lấy, tạo, sửa, xóa dữ liệu thô. KHÔNG ĐƯỢC gọi API Attachment.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'endpoint': {'type': 'string', 'description': 'Đường dẫn API (vd: /api/Product)'},
                    'method': {'type': 'string', 'description': 'GET, POST, PUT, PATCH, DELETE'},
                    'params': {'type': 'object', 'description': 'JSON body hoặc query params cần gửi'}
                },
                'required': ['endpoint', 'method']
            }
        }
    }
]

# 2. Hàm gọi API nội bộ có áp dụng quy tắc của bạn
def execute_api(endpoint, method, params, access_token):
    # Rule 1: Chặn Attachment API từ trong trứng nước
    if "Attachment" in endpoint:
        return json.dumps({"error": "Hệ thống chặn: Không được phép truy cập dữ liệu Attachment qua AI."})
        
    base_url = middleware.config["DomainSettings"]["BackEnd"]
    full_url = f"{base_url}{endpoint}"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    
    try:
        if method == "GET":
            res = requests.get(full_url, headers=headers, params=params)
            # Rule 2: GET > 500 ký tự
            if len(res.text) > 500:
                return "Dữ liệu bạn muốn lấy về quá lớn tôi không thể phản hồi hết. Bạn có muốn tôi chuyển hướng bạn đến trang quản lý để xem không?"
        elif method == "POST":
            res = requests.post(full_url, headers=headers, json=params)
            # Rule 3: POST thành công
            if res.status_code in [200, 201]:
                return f"Tôi đã tạo thành công. Dữ liệu: {res.text}"
        elif method in ["PUT", "PATCH"]:
            res = requests.request(method, full_url, headers=headers, json=params)
        elif method == "DELETE":
            res = requests.delete(full_url, headers=headers, json=params)
            
        return res.text
    except Exception as e:
        return str(e)

# 3. Cổng API Duy Nhất cho Frontend
@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest, authorization: Optional[str] = Header(None)):
    token = authorization.split(" ")[1] if authorization else ""
    
    # SYSTEM PROMPT cực kỳ quan trọng để "Nắn gân" Llama-3.2
    system_prompt = """
    Bạn là AI điều phối hệ thống. Quy tắc bắt buộc:
    1. Nếu yêu cầu có cả giao diện (Frontend Route) và API (Backend Route), hãy hỏi người dùng: "Bạn muốn xem trên giao diện web hay muốn tôi lấy dữ liệu trực tiếp tại đây?".
    2. Với yêu cầu UPDATE (PUT/PATCH) hoặc DELETE: BẠN PHẢI HỎI XÁC NHẬN "Bạn có chắc chắn muốn thực hiện không?" trước khi gọi tool call_backend_api.
    3. Trước khi thực hiện POST/PUT/PATCH, nếu thiếu tham số, hãy gọi GET để lấy dữ liệu cũ hoặc hỏi người dùng cung cấp đủ tham số DTOs.
    4. TUYỆT ĐỐI KHÔNG gọi các API liên quan đến Attachment.
    """
    
    messages = [{'role': 'system', 'content': system_prompt}] + request.history
    messages.append({'role': 'user', 'content': request.message})
    
    # Yêu cầu Llama trả lời (Sử dụng model host trong Docker)
    # Lưu ý: host là http://ollama:11434 vì chúng chạy chung mạng Docker
    client = ollama.Client(host='http://ollama:11434')
    response = client.chat(model='llama3.2:3b', messages=messages, tools=tools)
    
    msg = response['message']
    
    # Nếu AI dùng Tool
    if msg.get('tool_calls'):
        for tool in msg['tool_calls']:
            f_name = tool['function']['name']
            args = tool['function']['arguments']
            
            if f_name == 'redirect_page':
                if middleware.check_frontend_access(request.role_id, args.get('url')):
                    return {"action": "REDIRECT", "url": args.get('url'), "message": "Đang chuyển hướng..."}
                return {"action": "TEXT", "message": "Bạn không có quyền truy cập trang này."}
                
            elif f_name == 'call_backend_api':
                endpoint = args.get('endpoint')
                method = args.get('method').upper()
                
                if middleware.check_backend_access(request.role_id, endpoint, method):
                    api_result = execute_api(endpoint, method, args.get('params'), token)
                    # Gửi kết quả lại cho AI tổng hợp
                    messages.append(msg)
                    messages.append({'role': 'tool', 'content': api_result, 'name': f_name})
                    final_res = client.chat(model='llama3.2:3b', messages=messages)
                    return {"action": "TEXT", "message": final_res['message']['content']}
                else:
                    return {"action": "TEXT", "message": "Quyền bị từ chối: Role của bạn không thể gọi API này."}
                    
    # Nếu AI chỉ trả lời Text giao tiếp
    return {"action": "TEXT", "message": msg['content']}