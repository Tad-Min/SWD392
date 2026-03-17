from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
import ollama
import datetime
from MiddleWare import MiddleWare # File middleware của bạn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            # Viết thật gắt vào phần mô tả để nó sợ:
            'description': 'CHỈ SỬ DỤNG khi người dùng YÊU CẦU RÕ RÀNG việc chuyển trang, mở giao diện (vd: "mở trang quản lý", "đưa tôi đến dashboard"). TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG HÀM NÀY ĐỂ CHÀO HỎI HAY TRẢ LỜI GIAO TIẾP BÌNH THƯỜNG.',
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
            # Viết thêm dòng cấm kỵ này vào mô tả:
            'description': 'Gọi API Backend để lấy, tạo, sửa, xóa dữ liệu thô. KHÔNG ĐƯỢC gọi API Attachment. TUYỆT ĐỐI KHÔNG SỬ DỤNG HÀM NÀY ĐỂ CHÀO HỎI HOẶC GIAO TIẾP THÔNG THƯỜNG.',
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
# 3. Cổng API Duy Nhất cho Frontend
@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest, authorization: Optional[str] = Header(None)):
    # 1. Lấy token an toàn
    token = ""
    if authorization and authorization.startswith("Bearer "):
        parts = authorization.split(" ")
        if len(parts) > 1:
            token = parts[1].strip()
            # Nếu token là chuỗi 'null' hoặc 'undefined' từ JS gửi lên, ta coi như rỗng
            if token in ["null", "undefined"]:
                token = ""
    now = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    # 2. Định nghĩa System Prompt TRƯỚC
    system_prompt = f"""
    Bạn là AI điều phối hệ thống của OverLut. Quy tắc bắt buộc:
    1. GIAO TIẾP CƠ BẢN: Nếu người dùng chào hỏi, hỏi ngày giờ, cảm ơn, hoặc nói chuyện phiếm, HÃY TRẢ LỜI BÌNH THƯỜNG BẰNG TEXT. TUYỆT ĐỐI KHÔNG SỬ DỤNG BẤT KỲ TOOL NÀO.
    2. Nếu yêu cầu có cả giao diện (Frontend Route) và API (Backend Route), hãy hỏi người dùng: "Bạn muốn xem trên giao diện web hay muốn tôi lấy dữ liệu trực tiếp tại đây?".
    3. Với yêu cầu UPDATE (PUT/PATCH) hoặc DELETE: BẠN PHẢI HỎI XÁC NHẬN "Bạn có chắc chắn muốn thực hiện không?" trước khi gọi tool call_backend_api.
    4. Trước khi thực hiện POST/PUT/PATCH, nếu thiếu tham số, hãy gọi GET để lấy dữ liệu cũ hoặc hỏi người dùng cung cấp đủ tham số DTOs.
    5. TUYỆT ĐỐI KHÔNG gọi các API liên quan đến Attachment.
    
    THÔNG TIN THỜI GIAN THỰC ĐỂ TRẢ LỜI:
    - Bây giờ là: {now}
    """

    # 3. Gắn System Prompt vào messages SAU KHI đã định nghĩa
    messages = [{'role': 'system', 'content': system_prompt}] + request.history
    messages.append({'role': 'user', 'content': request.message})
    
    # =======================================================
    # BẮT ĐẦU ĐOẠN CODE "KỶ LUẬT THÉP" TRỊ BỆNH ẢO GIÁC TOOL
    # =======================================================
    user_text = request.message.strip().lower()
    
    # 1. Danh sách các từ khóa giao tiếp cơ bản
    greetings = ["chào", "xin chào", "hello", "hi", "hey", "alo", "222", "test", "ok", "dạ"]
    
    # Kiểm tra xem câu của user có trùng hoặc bắt đầu bằng lời chào không (và câu phải ngắn)
    is_greeting = any(user_text == g or user_text.startswith(g + " ") for g in greetings)
    
    # Nếu là lời chào HOẶC câu quá ngắn (< 5 ký tự), ta GIẤU LUÔN TOOLS ĐI!
    if is_greeting or len(user_text) < 5:
        active_tools = []
        print("👉 [HỆ THỐNG]: Đã giấu Tools vì user chỉ đang chào hỏi/gõ ngắn.")
    else:
        active_tools = tools # Cấp lại tools cho các câu hỏi phức tạp
        
    # Gọi Ollama
    client = ollama.Client(host=middleware.config["DomainSettings"]["OllamaHost"])
    response = client.chat(model='llama3.2:3b', messages=messages, tools=active_tools)
    
    msg = response['message']
    
    # Xử lý nếu AI dùng Tool
    if msg.get('tool_calls'):
        for tool in msg['tool_calls']:
            f_name = tool['function']['name']
            args = tool['function']['arguments']
            
            print(f"👉 [AI DÙNG TOOL]: {f_name} | Tham số: {args}")
            
            if f_name == 'redirect_page':
                url = args.get('url', '')
                
                # 2. GUARDRAIL: Chặn các URL tào lao (Phải bắt đầu bằng '/')
                if not url.startswith('/'):
                    print(f"👉 [HỆ THỐNG CHẶN]: AI xuất URL sai định dạng ({url})")
                    return {"action": "TEXT", "message": "Bạn muốn xem trang nào? Xin hãy nói rõ tên trang nhé."}
                    
                # Kiểm tra quyền truy cập hợp lệ
                if middleware.check_frontend_access(request.role_id, url):
                    return {"action": "REDIRECT", "url": url, "message": "Đang chuyển hướng..."}
                return {"action": "TEXT", "message": "Quyền bị từ chối: Role của bạn không có quyền xem trang này."}
            
            elif f_name == 'call_backend_api':
                # ... (Phần gọi API giữ nguyên như cũ) ...
                pass
                
    # Nếu AI chỉ trả lời giao tiếp bình thường
    return {"action": "TEXT", "message": msg['content']}
    