# 1. Dùng môi trường Python 3.11 bản slim (siêu nhẹ) làm nền móng
FROM python:3.11-slim

# 2. Tạo một thư mục tên là /app bên trong container
WORKDIR /app

# 3. Copy file danh sách thư viện vào trước
COPY requirements.txt .

# 4. Yêu cầu hệ thống tự động tải và cài các thư viện này
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy toàn bộ code của bạn (main.py, MiddleWare.py, AppConfig.json) vào container
COPY . .

# 6. Mở cửa (port) 8000 để Frontend có thể gọi vào
EXPOSE 8000

# 7. Lệnh khởi chạy server FastAPI ngay khi container vừa bật lên
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]