import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

// Hàm định dạng thời gian tin nhắn theo định dạng 12 giờ (AM/PM)
const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const ChatPage = () => {
    const { user } = useUser();  // Lấy thông tin người dùng hiện tại từ Clerk
    const { messages, selectedUser, fetchUsers, fetchMessages, initSocket } = useChatStore();  // Lấy các phương thức và dữ liệu từ store chat

    // useEffect này chạy khi người dùng đã đăng nhập
    useEffect(() => {
        if (user) {
            fetchUsers();  // Lấy danh sách người dùng khi người dùng đã đăng nhập
            initSocket(user.id);  // Khởi tạo kết nối WebSocket để gửi và nhận tin nhắn
        }
    }, [fetchUsers, initSocket, user]);  // Chạy lại mỗi khi `fetchUsers` hoặc `initSocket` thay đổi hoặc người dùng thay đổi

    // useEffect này chạy khi người dùng được chọn
    useEffect(() => {
        if (selectedUser) fetchMessages(selectedUser.clerkId);  // Lấy tin nhắn của người dùng đã chọn
    }, [selectedUser, fetchMessages]);  // Chạy lại mỗi khi người dùng được chọn hoặc phương thức `fetchMessages` thay đổi

    return (
        <div className='h-[calc(100vh-110px)] bg-zinc-900'>
            <div className='h-full'>
                <div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-full'>
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900">
                        {/* Danh sách người dùng */}
                        <UsersList />
                    </div>

                    {/* Khu vực trò chuyện */}
                    <div className='flex flex-col h-full border-l border-zinc-800 bg-gradient-to-b from-zinc-800 to-zinc-900'>
                        {selectedUser ? (
                            <>
                                {/* Header của cuộc trò chuyện (thông tin người được chọn) */}
                                <ChatHeader />

                                {/* Hiển thị tin nhắn */}
                                <ScrollArea className='flex-1 min-h-0'>
                                    <div className='p-4 space-y-4'>
                                        {/* Duyệt qua các tin nhắn và hiển thị */}
                                        {messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`flex items-start gap-3 ${
                                                    message.senderId === user?.id ? "flex-row-reverse" : ""
                                                }`}
                                            >
                                                {/* Avatar của người gửi */}
                                                <Avatar className='size-8 shrink-0'>
                                                    <AvatarImage
                                                        src={
                                                            message.senderId === user?.id
                                                                ? user.imageUrl
                                                                : selectedUser.imageUrl
                                                        }
                                                    />
                                                </Avatar>

                                                {/* Nội dung tin nhắn */}
                                                <div
                                                    className={`rounded-lg p-3 max-w-[70%] break-words
                                                        ${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
                                                    `}
                                                >
                                                    <p className='text-sm'>{message.content}</p>
                                                    <span className='text-xs text-zinc-300 mt-1 block'>
                                                        {formatTime(message.createdAt)} {/* Hiển thị thời gian tin nhắn */}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                {/* Khu vực nhập tin nhắn */}
                                <MessageInput />
                            </>
                        ) : (
                           // {/* Khi chưa chọn người trò chuyện */}
                            <NoConversationPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Màn hình thay thế khi chưa chọn người để trò chuyện
const NoConversationPlaceholder = () => (
    <div className='flex flex-col items-center justify-center h-full space-y-6'>
        <img src='/img/logo.png' alt='Logo' className='size-16 animate-bounce' />
        <div className='text-center'>
            <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
            <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
        </div>
    </div>
);

export default ChatPage;
