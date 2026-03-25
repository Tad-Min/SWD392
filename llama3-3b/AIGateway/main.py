from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
import ollama
import datetime
import chromadb
import os
from MiddleWare import MiddleWare

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000",
        "http://tad-min.io.vn:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

middleware = MiddleWare("AppConfig.json")

# Override config từ environment variables (cho Docker)
if os.getenv("OVERLUT_BACKEND_URL"):
    middleware.config["DomainSettings"]["BackEnd"] = os.getenv("OVERLUT_BACKEND_URL")
if os.getenv("OVERLUT_OLLAMA_HOST"):
    middleware.config["DomainSettings"]["OllamaHost"] = os.getenv("OVERLUT_OLLAMA_HOST")

# =================================================================
# [RAG] KHỞI TẠO CHROMADB & NẠP DỮ LIỆU TỪ KNOWLEDGE.TXT
# =================================================================
print("🔄 [RAG] Đang khởi tạo hệ thống Vector Database...")
chroma_client = chromadb.Client()

try:
    chroma_client.delete_collection(name="overlut_knowledge")
except:
    pass

collection = chroma_client.create_collection(name="overlut_knowledge")

try:
    if os.path.exists("knowledge.txt"):
        with open("knowledge.txt", "r", encoding="utf-8") as f:
            content = f.read()
            chunks = [chunk.strip() for chunk in content.split("\n\n") if chunk.strip()]
            
            for i, chunk in enumerate(chunks):
                collection.add(
                    documents=[chunk],
                    ids=[f"doc_{i}"]
                )
        print(f"✅ [RAG] Đã nạp thành công {len(chunks)} khối kiến thức vào Database!")
    else:
        print("⚠️ [RAG] Không tìm thấy file knowledge.txt")
except Exception as e:
    print(f"⚠️ [RAG] Lỗi khi nạp dữ liệu: {e}")
# =================================================================

# =================================================================
# ROLE MAPPING
# =================================================================
ROLE_NAMES = {
    1: "Citizen (Người dân)",
    2: "RescueTeam (Đội cứu hộ)",
    3: "RescueCoordinator (Điều phối viên)",
    4: "Manager (Quản lý)",
    5: "Admin (Quản trị viên)"
}

# =================================================================
# PROMPT GỢI Ý THEO ROLE
# =================================================================
ROLE_PROMPTS = {
    1: {  # Citizen
        "title": "Người dân (Citizen)",
        "prompts": [
            "Mở trang gửi yêu cầu cứu hộ",
            "Xem lịch sử cứu hộ của tôi",
            "Mở trang hồ sơ cá nhân",
            "Xem trạng thái yêu cầu cứu hộ của tôi",
            "Các loại yêu cầu cứu hộ có những gì?",
            "Xem mức độ khẩn cấp",
        ]
    },
    2: {  # RescueTeam
        "title": "Đội cứu hộ (Rescue Team)",
        "prompts": [
            "Mở trang làm việc đội cứu hộ",
            "Xem nhiệm vụ được phân công",
            "Xem chi tiết nhiệm vụ",
            "Xem trạng thái các nhiệm vụ cứu hộ",
            "Xem danh sách trạng thái đội cứu hộ",
        ]
    },
    3: {  # RescueCoordinator
        "title": "Điều phối viên (Rescue Coordinator)",
        "prompts": [
            "Mở trang điều phối viên",
            "Xem tất cả yêu cầu cứu hộ",
            "Xem danh sách đội cứu hộ",
            "Xem danh sách nhiệm vụ cứu hộ",
            "Xem mức độ khẩn cấp",
            "Xem phương tiện đang phân công",
            "Xem danh sách phương tiện",
        ]
    },
    4: {  # Manager
        "title": "Quản lý (Manager)",
        "prompts": [
            "Mở trang quản lý kho",
            "Mở trang quản lý sản phẩm",
            "Mở trang quản lý phương tiện",
            "Mở trang quản lý đội cứu hộ",
            "Xem danh sách kho hàng",
            "Xem tồn kho",
            "Xem danh sách sản phẩm",
            "Xem lịch sử giao dịch",
            "Xem danh sách phương tiện",
            "Mở báo cáo",
        ]
    },
    5: {  # Admin
        "title": "Quản trị viên (Admin)",
        "prompts": [
            "Mở trang quản lý người dùng",
            "Mở cài đặt hệ thống",
            "Xem danh sách người dùng",
            "Xem danh sách vai trò người dùng",
            "Xem nhật ký yêu cầu cứu hộ",
            "Xem nhật ký nhiệm vụ",
            "Xem cấu hình trạng thái hệ thống",
            "Xem danh sách loại yêu cầu cứu hộ",
            "Mở trang quản lý sản phẩm",
        ]
    }
}

class ChatRequest(BaseModel):
    message: str
    role_id: int 
    history: List[dict] = [] 

tools = [
    {
        'type': 'function',
        'function': {
            'name': 'redirect_page',
            'description': 'CHỈ SỬ DỤNG khi người dùng YÊU CẦU RÕ RÀNG việc chuyển trang, mở giao diện, đi đến trang. TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG HÀM NÀY ĐỂ CHÀO HỎI.',
            'parameters': {
                'type': 'object',
                'properties': {'url': {'type': 'string', 'description': 'Đường dẫn URL Frontend (vd: /Citizens, /admin/users, /manager/products)'}},
                'required': ['url']
            }
        }
    },
    {
        'type': 'function',
        'function': {
            'name': 'call_backend_api',
            'description': 'Gọi API Backend để lấy, tạo, sửa, xóa dữ liệu hệ thống OverLut. KHÔNG ĐƯỢC gọi API Attachment. TUYỆT ĐỐI KHÔNG SỬ DỤNG HÀM NÀY ĐỂ CHÀO HỎI.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'endpoint': {'type': 'string', 'description': 'Đường dẫn API (vd: /api/Product, /api/RescueRequest/GetAll)'},
                    'method': {'type': 'string', 'description': 'GET, POST, PUT, PATCH, DELETE'},
                    'params': {'type': 'object', 'description': 'JSON body hoặc query params cần gửi (nếu có)'}
                },
                'required': ['endpoint', 'method']
            }
        }
    }
]

def execute_api(endpoint, method, params, access_token):
    """Thực thi API nội bộ và trả kết quả"""
    if "Attachment" in endpoint:
        return json.dumps({"error": "Hệ thống chặn: Không được phép truy cập dữ liệu Attachment qua AI."})
        
    base_url = middleware.config["DomainSettings"]["BackEnd"]
    full_url = f"{base_url}{endpoint}"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    
    try:
        print(f"   📡 [API CALL]: {method} {full_url}")
        
        if method == "GET":
            res = requests.get(full_url, headers=headers, params=params, timeout=10)
        elif method == "POST":
            res = requests.post(full_url, headers=headers, json=params, timeout=10)
        elif method in ["PUT", "PATCH"]:
            res = requests.request(method, full_url, headers=headers, json=params, timeout=10)
        elif method == "DELETE":
            res = requests.delete(full_url, headers=headers, json=params, timeout=10)
        else:
            return json.dumps({"error": f"Method {method} không được hỗ trợ"})
        
        print(f"   📡 [API RESPONSE]: Status {res.status_code} | Length {len(res.text)}")
            
        # Xử lý lỗi HTTP
        if res.status_code == 401:
            return json.dumps({"error": "Unauthorized", "message": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."})
        elif res.status_code == 403:
            return json.dumps({"error": "Forbidden", "message": "Bạn không có quyền thực hiện hành động này."})
        elif res.status_code == 404:
            return json.dumps({"error": "NotFound", "message": "Không tìm thấy dữ liệu yêu cầu."})
        elif res.status_code >= 500:
            return json.dumps({"error": "ServerError", "message": "Lỗi máy chủ, vui lòng thử lại sau."})
            
        return res.text
    except requests.exceptions.Timeout:
        return json.dumps({"error": "Timeout", "message": "API phản hồi quá chậm, vui lòng thử lại."})
    except Exception as e:
        return json.dumps({"error": "ConnectionError", "message": str(e)})


@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest, authorization: Optional[str] = Header(None)):
    token = ""
    if authorization and authorization.startswith("Bearer "):
        parts = authorization.split(" ")
        if len(parts) > 1 and parts[1].strip() not in ["null", "undefined"]:
            token = parts[1].strip()
            
    now = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    user_text = request.message.strip()
    role_name = ROLE_NAMES.get(request.role_id, "Unknown")
    
    # =================================================================
    # [RAG] TÌM KIẾM NGỮ CẢNH TRONG KNOWLEDGE.TXT
    # =================================================================
    relevant_docs = ""
    if len(user_text) >= 5:
        results = collection.query(
            query_texts=[user_text],
            n_results=3
        )
        if results and results.get('documents') and results['documents'][0]:
            relevant_docs = "\n\n".join(results['documents'][0])
            print(f"🔍 [RAG TÌM THẤY TÀI LIỆU]: \n{relevant_docs[:200]}...")
    # =================================================================

    system_prompt = f"""
    Bạn là trợ lý AI của hệ thống cứu hộ OverLut. Xưng hô "mình" và gọi người dùng là "bạn".
    
    QUY TẮC BẮT BUỘC:
    1. GIAO TIẾP CƠ BẢN: Nếu người dùng chào hỏi, cảm ơn, hỏi ngày giờ → TRẢ LỜI BÌNH THƯỜNG, thân thiện. KHÔNG SỬ DỤNG TOOL.
    2. PHẠM VI: Bạn CHỈ hỗ trợ các tác vụ liên quan đến hệ thống OverLut (cứu hộ, cứu trợ, quản lý). Nếu câu hỏi KHÔNG liên quan (thời tiết, tin tức, kiến thức chung, toán, lập trình...), hãy từ chối lịch sự: "Xin lỗi bạn, mình chỉ có thể hỗ trợ các tác vụ liên quan đến hệ thống cứu hộ OverLut thôi nhé!"
    3. ĐIỀU HƯỚNG VÀ API: Nếu yêu cầu có cả giao diện và API, hãy hỏi: "Bạn muốn xem trên web hay muốn mình lấy dữ liệu tại đây?"
    4. XÁC NHẬN: Với UPDATE/DELETE: BẮT BUỘC HỎI XÁC NHẬN "Bạn có chắc chắn muốn thực hiện không?" trước khi gọi tool.
    5. ATTACHMENT: TUYỆT ĐỐI KHÔNG gọi các API liên quan đến Attachment. Nếu người dùng muốn upload file, hướng dẫn họ dùng giao diện web.
    6. TRẢ LỜI NGẮN GỌN: Trả lời dưới 200 từ, rõ ràng, dễ hiểu.
    
    THÔNG TIN PHIÊN LÀM VIỆC:
    - Thời gian hiện tại: {now}
    - Role hiện tại: {role_name} (RoleId: {request.role_id})
    
    TÀI LIỆU HỆ THỐNG (Chỉ dùng nếu câu hỏi liên quan):
    {relevant_docs}
    """

    messages = [{'role': 'system', 'content': system_prompt}] + request.history
    messages.append({'role': 'user', 'content': request.message})
    
    # =================================================================
    # PHÁT HIỆN YÊU CẦU GỢI Ý PROMPT
    # =================================================================
    user_text_lower = user_text.lower()
    help_keywords = ["giúp gì", "làm gì", "làm được gì", "hướng dẫn", "help", "gợi ý", "prompt", 
                     "có thể làm gì", "biết làm gì", "hỗ trợ gì", "chức năng", "tính năng",
                     "không biết", "bắt đầu", "dùng thế nào", "sử dụng", "menu", "danh sách lệnh",
                     "tôi nên", "mình nên", "nên làm gì"]
    is_help = any(kw in user_text_lower for kw in help_keywords)
    
    if is_help:
        role_data = ROLE_PROMPTS.get(request.role_id, ROLE_PROMPTS[1])
        print(f"👉 [HỆ THỐNG]: User hỏi gợi ý → Trả danh sách prompt cho role {role_name}")
        return {
            "action": "SUGGEST_PROMPTS",
            "message": f"Đây là các thao tác mình có thể giúp bạn với vai trò **{role_data['title']}**. Bạn chỉ cần nhấn vào hoặc gõ tương tự nhé!",
            "prompts": role_data["prompts"]
        }
    
    # Phát hiện chào hỏi → Giấu tools
    greetings = ["chào", "xin chào", "hello", "hi", "hey", "alo", "test", "ok", "dạ", "cảm ơn", "thanks", "thank you"]
    is_greeting = any(user_text_lower == g or user_text_lower.startswith(g + " ") for g in greetings)
    
    if is_greeting or len(user_text_lower) < 5:
        active_tools = []
        print("👉 [HỆ THỐNG]: Đã giấu Tools vì user chỉ đang chào hỏi.")
    else:
        active_tools = tools 
        
    client = ollama.Client(host=middleware.config["DomainSettings"]["OllamaHost"])
    response = client.chat(model='qwen2.5:1.5b', messages=messages, tools=active_tools)
    
    msg = response['message']
    
    # =================================================================
    # XỬ LÝ TOOL CALLS
    # =================================================================
    if msg.get('tool_calls'):
        for tool in msg['tool_calls']:
            f_name = tool['function']['name']
            args = tool['function']['arguments']
            
            print(f"👉 [AI DÙNG TOOL]: {f_name} | Tham số: {args}")
            
            # ---- REDIRECT PAGE ----
            if f_name == 'redirect_page':
                url = args.get('url', '')
                if not url.startswith('/'):
                    return {"action": "TEXT", "message": "Xin lỗi bạn, mình không xác định được trang bạn muốn đến. Bạn có thể nói rõ hơn không?"}
                    
                if middleware.check_frontend_access(request.role_id, url):
                    return {"action": "REDIRECT", "url": url, "message": f"Mình sẽ chuyển bạn đến trang yêu cầu nhé!"}
                return {"action": "TEXT", "message": f"Xin lỗi bạn, role {role_name} của bạn không có quyền truy cập trang này."}
            
            # ---- CALL BACKEND API ----
            elif f_name == 'call_backend_api':
                endpoint = args.get('endpoint', '')
                method = args.get('method', 'GET').upper()
                params = args.get('params', {})
                
                # Chặn Attachment
                if "Attachment" in endpoint or "attachment" in endpoint:
                    return {"action": "TEXT", "message": "Xin lỗi bạn, mình không thể xử lý file đính kèm qua chat. Bạn hãy sử dụng giao diện web để upload nhé!"}
                
                # Kiểm tra quyền Backend
                if not middleware.check_backend_access(request.role_id, endpoint, method):
                    return {"action": "TEXT", "message": f"Xin lỗi bạn, role {role_name} của bạn không có quyền thực hiện thao tác này ({method} {endpoint})."}
                
                # Thực thi API
                api_result = execute_api(endpoint, method, params, token)
                print(f"   📦 [API RESULT]: {api_result[:300]}...")
                
                # Kiểm tra lỗi từ API
                try:
                    result_json = json.loads(api_result)
                    if isinstance(result_json, dict) and result_json.get("error"):
                        return {"action": "TEXT", "message": f"⚠️ {result_json.get('message', result_json.get('error', 'Có lỗi xảy ra'))}"}
                except:
                    pass
                
                # Kiểm tra dữ liệu quá lớn → gợi ý chuyển trang
                if len(api_result) > 3000:
                    # Cắt bớt dữ liệu để AI tổng hợp
                    truncated = api_result[:2000] + "\n... (dữ liệu còn nhiều, đã cắt bớt)"
                    
                    messages.append(msg)
                    messages.append({
                        'role': 'tool',
                        'content': truncated,
                        'name': f_name
                    })
                    
                    final_response = client.chat(model='qwen2.5:1.5b', messages=messages)
                    ai_summary = final_response['message'].get('content', '')
                    
                    return {
                        "action": "API_RESULT",
                        "message": ai_summary + "\n\n📋 Dữ liệu khá nhiều, bạn có muốn mình chuyển đến trang quản lý để xem đầy đủ không?",
                        "data": api_result
                    }
                
                # Gửi kết quả API về AI để tổng hợp câu trả lời tự nhiên
                messages.append(msg)
                messages.append({
                    'role': 'tool',
                    'content': api_result,
                    'name': f_name
                })
                
                final_response = client.chat(model='qwen2.5:1.5b', messages=messages)
                ai_message = final_response['message'].get('content', '')
                
                # Trả về kèm data để frontend render bảng
                return {
                    "action": "API_RESULT",
                    "message": ai_message,
                    "data": api_result
                }
    
    # =================================================================
    # AI TRẢ LỜI BÌNH THƯỜNG (không dùng tool)
    # =================================================================
    return {"action": "TEXT", "message": msg.get('content', '')}