import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Nhập các thành phần để tạo ảnh đại diện cho người dùng
import { useChatStore } from "@/stores/useChatStore"; // Nhập hook useChatStore để lấy trạng thái chat và người dùng

const ChatHeader = () => {
    // Lấy các giá trị từ useChatStore: selectedUser (người dùng đã chọn), onlineUsers (danh sách người dùng online), isConnected (trạng thái kết nối), error (thông báo lỗi)
    const { selectedUser, onlineUsers, isConnected, error } = useChatStore();

    // Nếu không có người dùng nào được chọn, không hiển thị gì
    if (!selectedUser) return null;

    return (
        <div className='p-4 border-b border-zinc-800 space-y-2'>
            {/* Nếu có lỗi, hiển thị thông báo lỗi */}
            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 rounded-md p-2">
                    {error}
                </div>
            )}
            
            <div className='flex items-center justify-between'>
                {/* Thông tin người dùng đã chọn */}
                <div className='flex items-center gap-3'>
                    <Avatar>
                        {/* Nếu người dùng có ảnh đại diện, hiển thị ảnh đó, nếu không hiển thị chữ cái đầu của tên */}
                        <AvatarImage src={selectedUser.imageUrl} />
                        <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className='font-medium'>{selectedUser.fullName}</h2>
                        <p className='text-sm text-zinc-400'>
                            {/* Kiểm tra xem người dùng có đang online hay không */}
                            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                {/* Trạng thái kết nối của ứng dụng */}
                <div className="flex items-center gap-2">
                    {/* Hiển thị trạng thái kết nối với màu sắc khác nhau */}
                    <span className={`size-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-zinc-400">
                        {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
