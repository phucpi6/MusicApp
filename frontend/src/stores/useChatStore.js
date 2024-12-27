import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { io } from "socket.io-client";

// Khởi tạo một kết nối socket.io với URL cơ bản (localhost khi ở chế độ phát triển, hoặc URL gốc trong môi trường sản xuất).
const baseURL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

// Khởi tạo socket và cấu hình nó để không tự động kết nối ngay lập tức
const socket = io(baseURL, {
    autoConnect: false, // chỉ kết nối khi người dùng đã xác thực
    withCredentials: true, // Cho phép gửi cookie để duy trì phiên đăng nhập
});

// Sử dụng zustand để tạo state quản lý cho chat
export const useChatStore = create((set, get) => ({
    // Khai báo các state cần thiết
    users: [], // Danh sách người dùng
    isLoading: false, // Trạng thái tải dữ liệu
    error: null, // Lỗi nếu có khi gọi API
    socket: socket, // Lưu socket vào state
    isConnected: false, // Trạng thái kết nối với socket server
    onlineUsers: new Set(), // Danh sách người dùng đang online
    userActivities: new Map(), // Lưu trữ các hoạt động của người dùng
    messages: [], // Tin nhắn
    selectedUser: null, // Người dùng đang được chọn để trò chuyện

    // Hàm để set người dùng được chọn trong state
    setSelectedUser: (user) => set({ selectedUser: user }),

    // Hàm lấy danh sách người dùng từ API
    fetchUsers: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/users"); // Gọi API lấy người dùng
            set({ users: response.data }); // Lưu danh sách người dùng vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải nữa
        }
    },

    // Hàm khởi tạo kết nối socket và các sự kiện liên quan
    initSocket: (userId) => {
        if (!get().isConnected) { // Kiểm tra nếu socket chưa kết nối
            socket.auth = { userId }; // Truyền userId vào socket để xác thực người dùng

            // Thêm các sự kiện cho socket
            socket.on("connect", () => {
                console.log("Socket connected successfully"); // Khi kết nối thành công
                socket.emit("user_connected", userId); // Gửi sự kiện người dùng đã kết nối
            });

            // Xử lý lỗi kết nối
            socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error); // In lỗi ra nếu kết nối thất bại
                set({ error: "Failed to connect to chat server" }); // Lưu lỗi vào state
            });

            socket.connect(); // Kết nối socket

            // Lắng nghe các sự kiện của server
            socket.on("users_online", (users) => {
                set({ onlineUsers: new Set(users) }); // Cập nhật danh sách người dùng online
            });

            socket.on("activities", (activities) => {
                set({ userActivities: new Map(activities) }); // Cập nhật các hoạt động người dùng
            });

            // Cập nhật danh sách người dùng online khi có người dùng kết nối
            socket.on("user_connected", (userId) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId]), // Thêm người dùng mới vào danh sách online
                }));
            });

            // Cập nhật danh sách người dùng online khi có người dùng ngắt kết nối
            socket.on("user_disconnected", (userId) => {
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers); // Tạo bản sao của danh sách người dùng online
                    newOnlineUsers.delete(userId); // Xóa người dùng bị ngắt kết nối
                    return { onlineUsers: newOnlineUsers }; // Cập nhật lại danh sách
                });
            });

            // Lắng nghe tin nhắn nhận được từ server
            socket.on("receive_message", (message) => {
                set((state) => ({
                    messages: [...state.messages, message], // Thêm tin nhắn mới vào danh sách tin nhắn
                }));
            });

            // Lắng nghe tin nhắn đã được gửi
            socket.on("message_sent", (message) => {
                set((state) => ({
                    messages: [...state.messages, message], // Thêm tin nhắn gửi thành công vào danh sách
                }));
            });

            // Cập nhật hoạt động của người dùng khi có sự thay đổi
            socket.on("activity_updated", ({ userId, activity }) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities); // Tạo bản sao của hoạt động người dùng
                    newActivities.set(userId, activity); // Cập nhật hoạt động của người dùng
                    return { userActivities: newActivities }; // Cập nhật lại danh sách hoạt động
                });
            });

            set({ isConnected: true }); // Đặt trạng thái kết nối thành công
        }
    },

    // Hàm ngắt kết nối socket
    disconnectSocket: () => {
        if (get().isConnected) { // Kiểm tra nếu socket đã kết nối
            socket.disconnect(); // Ngắt kết nối
            set({ isConnected: false }); // Đặt trạng thái không còn kết nối
        }
    },

    // Hàm gửi tin nhắn
    sendMessage: async (receiverId, senderId, content) => {
        const socket = get().socket;
        if (!socket) {
            console.error("Socket not initialized"); // In lỗi nếu socket chưa được khởi tạo
            return;
        }
        if (!socket.connected) {
            console.error("Socket not connected"); // In lỗi nếu socket không kết nối
            return;
        }

        console.log("Sending message:", { receiverId, senderId, content }); // In thông tin tin nhắn
        socket.emit("send_message", { receiverId, senderId, content }); // Gửi tin nhắn qua socket
    },

    // Hàm lấy tin nhắn của người dùng từ server
    fetchMessages: async (userId) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`); // Gọi API lấy tin nhắn
            set({ messages: response.data }); // Lưu danh sách tin nhắn vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải nữa
        }
    },
}));
