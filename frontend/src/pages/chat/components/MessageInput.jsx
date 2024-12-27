import { Button } from "@/components/ui/button";  // Nhập Button component
import { Input } from "@/components/ui/input";    // Nhập Input component
import { useChatStore } from "@/stores/useChatStore"; // Nhập hook để lấy trạng thái và các hàm từ store chat
import { useUser } from "@clerk/clerk-react";     // Nhập hook để lấy thông tin người dùng từ Clerk
import { Send } from "lucide-react";               // Nhập biểu tượng gửi từ lucide-react
import { useState } from "react";                 // Nhập useState hook để quản lý trạng thái trong component

const MessageInput = () => {
    const [newMessage, setNewMessage] = useState("");  // Trạng thái cho tin nhắn mới
    const [error, setError] = useState("");            // Trạng thái cho lỗi khi gửi tin nhắn
    const { user } = useUser();  // Lấy thông tin người dùng từ Clerk
    const { selectedUser, sendMessage, socket, isConnected } = useChatStore(); // Lấy dữ liệu và hàm từ store chat

    const handleSend = () => {
        // Kiểm tra xem có người dùng được chọn, người dùng đã đăng nhập và tin nhắn không rỗng hay không
        if (!selectedUser || !user || !newMessage) return;
        
        // Kiểm tra trạng thái kết nối
        if (!socket || !isConnected) {
            setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
            return;
        }

        try {
            // Gửi tin nhắn thông qua hàm sendMessage từ useChatStore
            sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
            setNewMessage("");  // Xóa tin nhắn sau khi gửi
            setError("");  // Xóa lỗi (nếu có)
        } catch (err) {
            // Xử lý lỗi nếu gửi tin nhắn thất bại
            console.error("Error sending message:", err);
            setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    };

    return (
        <div className='p-4 mt-auto border-t border-zinc-800'>
            {/* Nếu có lỗi, hiển thị thông báo lỗi */}
            {error && (
                <div className="text-red-500 text-sm mb-2 px-2">
                    {error}
                </div>
            )}
            <div className='flex gap-2'>
                {/* Input để nhập tin nhắn */}
                <Input
                    placeholder='Type a message'  // Hiển thị văn bản gợi ý
                    value={newMessage}  // Liên kết với trạng thái newMessage
                    onChange={(e) => setNewMessage(e.target.value)}  // Cập nhật trạng thái khi người dùng nhập
                    className='bg-zinc-800 border-none'  // Thiết kế cho input
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}  // Gửi tin nhắn khi nhấn Enter
                />

                {/* Button để gửi tin nhắn */}
                <Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
                    {/* Biểu tượng gửi tin nhắn */}
                    <Send className='size-4' />
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;
