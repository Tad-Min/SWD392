import json
import re

class MiddleWare:
    def __init__(self, config_path="AppConfig.json"):
        # Đọc file cấu hình
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = json.load(f)
            
        # Trích xuất cấu hình ra dict để tra cứu nhanh
        self.frontend_routes = self.config.get("FontEndSettings", {})
        self.backend_routes = self.config.get("BackendSettings", {})

    def check_frontend_access(self, user_role_id, requested_path):
        """
        Kiểm tra xem user_role_id có quyền truy cập requested_path của Frontend không.
        """
        # Tìm đường dẫn trong file config
        for key, settings in self.frontend_routes.items():
            if settings["path"] == requested_path:
                authorize_list = settings["Authorize"]
                
                # Nếu mảng rỗng [] => Ai cũng vào được (Public)
                if len(authorize_list) == 0:
                    return True
                
                # Nếu mảng có data => Kiểm tra xem role_id của user có nằm trong mảng không
                if user_role_id in authorize_list:
                    return True
                else:
                    return False
                
        # Nếu đường dẫn không tồn tại trong config, mặc định từ chối (Hoặc cho phép tùy bạn)
        return False

    def check_backend_access(self, user_role_id, requested_path, method="GET"):
        """
        Kiểm tra quyền truy cập API Backend (Xử lý cả các param động như {id})
        """
        for group, apis in self.backend_routes.items():
            for api_name, settings in apis.items():
                api_path = settings["path"]
                api_method = settings["method"]
                
                # Chuyển đổi đường dẫn có {id} thành Regex để so khớp
                # Ví dụ: /api/Product/{id} -> ^/api/Product/[^/]+$
                regex_pattern = "^" + re.sub(r"\{[a-zA-Z0-9_]+\}", r"[^/]+", api_path) + "$"
                
                # Khớp đường dẫn và method
                if re.match(regex_pattern, requested_path) and api_method == method:
                    authorize_list = settings["Authorize"]
                    
                    if len(authorize_list) == 0:
                        return True
                        
                    if user_role_id in authorize_list:
                        return True
                    return False
                    
        return False
    
def call_internal_api(endpoint_path, method, parameters, access_token):
    """
    Hàm này đại diện cho Backend đi gọi API nội bộ bằng AccessToken của người dùng
    """
    # Lấy base url từ AppConfig (giả sử là http://localhost:5000)
    base_url = "http://localhost:5000" 
    full_url = f"{base_url}{endpoint_path}"
    
    # Kẹp Token vào Header y hệt như cách Frontend làm
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        print(f" -> [Thực thi gọi API]: {method} {full_url}")
        
        # Thực hiện gọi HTTP Request tương ứng
        if method.upper() == "GET":
            response = requests.get(full_url, headers=headers, params=parameters)
        elif method.upper() == "POST":
            response = requests.post(full_url, headers=headers, json=parameters)
        elif method.upper() == "PUT":
            response = requests.put(full_url, headers=headers, json=parameters)
        elif method.upper() == "DELETE":
            response = requests.delete(full_url, headers=headers, json=parameters)
            
        # Xử lý trường hợp Token hết hạn hoặc sai
        if response.status_code == 401:
            return json.dumps({"error": "Unauthorized", "message": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."})
        elif response.status_code == 403:
            return json.dumps({"error": "Forbidden", "message": "Bạn không có quyền thực hiện hành động này."})
            
        return response.text # Trả về chuỗi JSON kết quả từ API thật
        
    except Exception as e:
        return json.dumps({"error": "Internal Error", "message": str(e)})