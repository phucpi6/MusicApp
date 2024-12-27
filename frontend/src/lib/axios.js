import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP

// Tạo một instance axios tùy chỉnh để sử dụng trong ứng dụng
export const axiosInstance = axios.create({
    // Cấu hình baseURL dựa vào môi trường (development hoặc production)
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "/api",
    // Nếu môi trường là 'development', baseURL sẽ là 'http://localhost:4000/api'.
    // Nếu môi trường là 'production', baseURL sẽ là '/api' (tức là dùng đường dẫn tương đối đến API từ server).
});
