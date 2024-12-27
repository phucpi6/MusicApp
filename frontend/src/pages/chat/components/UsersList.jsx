import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";  // Nhập Skeleton để hiển thị trong khi đang tải dữ liệu
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Nhập component Avatar để hiển thị hình ảnh người dùng
import { ScrollArea } from "@/components/ui/scroll-area";  // Nhập ScrollArea để tạo vùng cuộn cho danh sách
import { useChatStore } from "@/stores/useChatStore";  // Nhập hook useChatStore để lấy trạng thái và các hành động từ store chat

const UsersList = () => {
    const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();  // Lấy dữ liệu từ store chat

    return (
        <div className='border-r border-zinc-800'>
            <div className='flex flex-col h-full'>
                <ScrollArea className='h-[calc(100vh-280px)]'>
                    <div className='space-y-2 p-4'>
                        {isLoading ? (
                            <UsersListSkeleton />  // Hiển thị Skeleton khi dữ liệu đang tải
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}  // Cập nhật người dùng được chọn khi nhấn
                                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                                        rounded-lg cursor-pointer transition-colors
                                        ${selectedUser?.clerkId === user.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                                >
                                    <div className='relative'>
                                        <Avatar className='size-8 md:size-12'>
                                            <AvatarImage src={user.imageUrl} />  // Hiển thị hình ảnh người dùng
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>  // Hiển thị chữ cái đầu tiên nếu không có hình ảnh
                                        </Avatar>
                                        {/* Chỉ báo trạng thái trực tuyến */}
                                        <div
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                                                ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`}
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0 lg:block hidden'>
                                        <span className='font-medium truncate'>{user.fullName}</span>  {/* Hiển thị tên người dùng */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default UsersList;
