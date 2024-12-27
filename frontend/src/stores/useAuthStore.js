import { axiosInstance } from "@/lib/axios"; // Import axiosInstance từ thư mục lib để thực hiện các yêu cầu HTTP
import { create } from "zustand"; // Import thư viện zustand để tạo store quản lý trạng thái

// Tạo store sử dụng zustand
export const useAuthStore = create((set) => ({
    isAdmin: false, // Trạng thái mặc định về quyền admin (false nếu không phải admin)
    isLoading: false, // Trạng thái loading khi kiểm tra quyền admin
    error: null, // Lưu trữ lỗi nếu có trong quá trình kiểm tra quyền admin

    // Hàm kiểm tra quyền admin của người dùng
    checkAdminStatus: async () => {
        set({ isLoading: true, error: null }); // Khi bắt đầu, đặt trạng thái loading là true và xóa lỗi cũ
        try {
            const response = await axiosInstance.get("/admin/check"); // Gửi yêu cầu GET đến API để kiểm tra quyền admin
            set({ isAdmin: response.data.admin }); // Cập nhật trạng thái isAdmin từ phản hồi của API
        } catch (error) {
            set({ isAdmin: false, error: error.response.data.message }); // Nếu có lỗi, đặt isAdmin là false và lưu thông báo lỗi
        } finally {
            set({ isLoading: false }); // Sau khi kiểm tra xong, thay đổi trạng thái loading thành false
        }
    },

    // Hàm reset store về trạng thái mặc định
    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null }); // Đặt lại trạng thái về mặc định
    },
}));
