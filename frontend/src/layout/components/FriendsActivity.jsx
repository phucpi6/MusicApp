// Import các component và hooks cần thiết từ thư viện và các file khác trong ứng dụng
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

// Component FriendsActivity hiển thị hoạt động của bạn bè
const FriendsActivity = () => {
    // Lấy dữ liệu người dùng và các trạng thái từ store chat
    const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
    const { user } = useUser();

    // Dùng useEffect để lấy danh sách người dùng khi có người dùng đã đăng nhập
    useEffect(() => {
        if (user) fetchUsers(); // Gọi hàm fetchUsers từ store khi có người dùng
    }, [fetchUsers, user]); // Chạy lại khi thay đổi user

    return (
        <div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
            <div className='p-4 flex justify-between items-center border-b border-zinc-800'>
                <div className='flex items-center gap-2'>
                    <Users className='size-5 shrink-0' /> {/* Biểu tượng người dùng */}
                    <h2 className='font-semibold'>What they're listening to</h2> {/* Tiêu đề */}
                </div>
            </div>

            {/* Nếu chưa đăng nhập, hiển thị phần đăng nhập */}
            {!user && <LoginPrompt />}

            {/* Hiển thị danh sách người dùng với hoạt động nghe nhạc */}
            <ScrollArea className='flex-1'>
                <div className='p-4 space-y-4'>
                    {users.map((user) => {
                        // Lấy hoạt động của người dùng từ store
                        const activity = userActivities.get(user.clerkId);
                        const isPlaying = activity && activity !== "Idle"; // Kiểm tra xem người dùng có đang nghe nhạc hay không

                        return (
                            <div
                                key={user._id}
                                className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='relative'>
                                        {/* Hiển thị ảnh đại diện của người dùng */}
                                        <Avatar className='size-10 border border-zinc-800'>
                                            <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        {/* Hiển thị trạng thái online/offline của người dùng */}
                                        <div
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                                                ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}
                                            `}
                                            aria-hidden='true'
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium text-sm text-white'>{user.fullName}</span>
                                            {/* Nếu người dùng đang nghe nhạc, hiển thị biểu tượng nhạc */}
                                            {isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0' />}
                                        </div>

                                        {isPlaying ? (
                                            <div className='mt-1'>
                                                {/* Hiển thị tên bài hát và nghệ sĩ đang phát */}
                                                <div className='mt-1 text-sm text-white font-medium truncate'>
                                                    {activity.replace("Playing ", "").split(" by ")[0]}
                                                </div>
                                                <div className='text-xs text-zinc-400 truncate'>
                                                    {activity.split(" by ")[1]}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='mt-1 text-xs text-zinc-400'>Không nghe gì</div> 
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

// Component hiển thị thông báo yêu cầu người dùng đăng nhập
const LoginPrompt = () => (
    <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
        <div className='relative'>
            <div
                className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
                opacity-75 animate-pulse'
                aria-hidden='true'
            />
            <div className='relative bg-zinc-900 rounded-full p-4'>
                <HeadphonesIcon className='size-8 text-emerald-400' /> {/* Biểu tượng tai nghe */}
            </div>
        </div>

        <div className='space-y-2 max-w-[250px]'>
            <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3> {/* Tiêu đề */}
            <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p> {/* Mô tả yêu cầu đăng nhập */}
        </div>
    </div>
);

export default FriendsActivity;
