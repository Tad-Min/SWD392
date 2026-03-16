import ollama
import json

# 1. Giả lập một API nội bộ của bạn (Ví dụ: Tra cứu giá sản phẩm trong Database)
def get_product_price(product_name):
    database = {"iphone 15": "20.000.000 VNĐ", "samsung s24": "22.000.000 VNĐ"}
    # Tìm giá, nếu không có trả về lỗi
    price = database.get(product_name.lower(), "Sản phẩm không tồn tại trong kho")
    return json.dumps({"product": product_name, "price": price})

# 2. Định nghĩa các công cụ (Tools) để AI biết nó có thể làm gì
tools = [
    {
        'type': 'function',
        'function': {
            'name': 'redirect_page',
            'description': 'Điều hướng người dùng đến một trang web cụ thể',
            'parameters': {
                'type': 'object',
                'properties': {
                    'url': {'type': 'string', 'description': 'Đường dẫn URL (vd: /lien-he, /san-pham)'}
                },
                'required': ['url']
            }
        }
    },
    {
        'type': 'function',
        'function': {
            'name': 'get_product_price',
            'description': 'Gọi API để lấy giá của một sản phẩm',
            'parameters': {
                'type': 'object',
                'properties': {
                    'product_name': {'type': 'string', 'description': 'Tên sản phẩm'}
                },
                'required': ['product_name']
            }
        }
    }
]

# 3. Luồng xử lý chính (Mô phỏng Backend)
def chat_with_bot(user_prompt):
    print(f"\n[Người dùng]: {user_prompt}")
    
    messages = [{'role': 'user', 'content': user_prompt}]
    
    # Gửi câu hỏi kèm bộ tools cho Llama 3.2
    response = ollama.chat(
        model='llama3.2:3b',
        messages=messages,
        tools=tools
    )
    
    message = response['message']
    
    # Trường hợp 1: AI trả lời giao tiếp bình thường (không dùng tool)
    if not message.get('tool_calls'):
        print(f"[AI]: {message['content']}")
        return

    # Trường hợp 2: AI quyết định dùng Tool
    for tool in message['tool_calls']:
        func_name = tool['function']['name']
        args = tool['function']['arguments']
        
        print(f" -> [Hệ thống]: AI yêu cầu dùng lệnh '{func_name}' với dữ liệu: {args}")
        
        # Xử lý Logic Backend dựa trên yêu cầu của AI
        if func_name == 'redirect_page':
            # Thực tế: Trả chuỗi JSON này về Frontend để Javascript chạy window.location.href
            print(f" -> [Hành động]: Báo cho Web tự động chuyển hướng sang trang: {args['url']}")
            
        elif func_name == 'get_product_price':
            # Thực tế: Gọi hàm hoặc fetch API thật của bạn
            api_result = get_product_price(args['product_name'])
            print(f" -> [Kết quả API]: {api_result}")
            
            # Gửi kết quả API ngược lại cho AI để nó tổng hợp câu trả lời tự nhiên
            messages.append(message) # Lưu lại lịch sử AI gọi tool
            messages.append({
                'role': 'tool',
                'content': api_result,
                'name': func_name
            })
            
            final_response = ollama.chat(model='llama3.2:3b', messages=messages)
            print(f"[AI Trả lời lại]: {final_response['message']['content']}")

# 4. Chạy thử nghiệm các kịch bản
if __name__ == "__main__":
    chat_with_bot("Tôi muốn xem chính sách bảo mật của web")
    chat_with_bot("Kiểm tra giúp tôi iPhone 15 giá bao nhiêu?")
    chat_with_bot("Chào bạn, bạn là ai?")