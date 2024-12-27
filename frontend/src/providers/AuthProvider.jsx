import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

// Hàm cập nhật token vào header của axios
const updateApiToken = (token) => {
    if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }) => {
    const { getToken, userId } = useAuth(); // Lấy token và userId từ Clerk (quản lý xác thực người dùng)
    const [loading, setLoading] = useState(true); // Quản lý trạng thái loading (đang tải dữ liệu)
    const { checkAdminStatus } = useAuthStore(); // Kiểm tra xem người dùng có quyền admin không
    const { initSocket, disconnectSocket } = useChatStore(); // Quản lý socket (khởi tạo và hủy bỏ kết nối)

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Lấy token từ Clerk
                const token = await getToken();
                updateApiToken(token); // Cập nhật token cho axios

                if (token) {
                    await checkAdminStatus(); // Kiểm tra quyền admin của người dùng
                    if (userId) initSocket(userId); // Khởi tạo socket nếu có userId
                }
            } catch (error) {
                updateApiToken(null); // Nếu có lỗi, xóa token
                console.log("Error in auth provider", error); // In lỗi ra console
            } finally {
                setLoading(false); // Sau khi hoàn tất, thay đổi trạng thái loading
            }
        };

        initAuth(); // Gọi hàm xác thực khi component mount

        // Clean up (hủy kết nối socket khi component bị unmount)
        return () => disconnectSocket();
    }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

    // Nếu đang trong trạng thái loading, hiển thị biểu tượng loading
    if (loading)
        return (
            <div className='h-screen w-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );

    // Khi xác thực xong, render các nội dung con (children)
    return <>{children}</>;
};

export default AuthProvider;
