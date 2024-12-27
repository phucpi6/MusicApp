import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton"; // Import component hiển thị khi dữ liệu đang tải
import { buttonVariants } from "@/components/ui/button"; // Import các biến thể nút (button)
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea để tạo khu vực cuộn
import { cn } from "@/lib/utils"; // Import hàm cn để kết hợp các lớp CSS
import { useMusicStore } from "@/stores/useMusicStore"; // Hook để lấy dữ liệu từ store âm nhạc
import { SignedIn } from "@clerk/clerk-react"; // Dùng để kiểm tra người dùng đã đăng nhập hay chưa
import { HomeIcon, Library, MessageCircle } from "lucide-react"; // Import các biểu tượng từ lucide-react
import { useEffect } from "react"; // Import useEffect để thực hiện các hiệu ứng phụ
import { Link } from "react-router-dom"; // Import Link từ react-router để tạo các liên kết điều hướng

// Component LeftSidebar là thanh bên trái của ứng dụng
const LeftSidebar = () => {
    const { albums, fetchAlbums, isLoading } = useMusicStore(); // Lấy albums, hàm fetchAlbums và trạng thái isLoading từ store

    // Dùng useEffect để tải danh sách album khi component được render lần đầu
    useEffect(() => {
        fetchAlbums(); // Gọi hàm fetchAlbums từ store để tải album
    }, [fetchAlbums]); // useEffect chỉ chạy lại khi fetchAlbums thay đổi

    return (
        <div className="h-full flex flex-col gap-2"> {/* Container chính cho sidebar */}
            {/* Navigation menu */}
            <div className="rounded-lg bg-zinc-900 p-4"> {/* Thanh menu điều hướng */}
                <div className="space-y-2">
                    {/* Liên kết đến trang chủ */}
                    <Link
                        to="/"
                        className={cn(
                            buttonVariants({
                                variant: "ghost", // Chế độ nút ghost (không nền)
                                className: "w-full justify-start text-white hover:bg-zinc-800", // Căn chỉnh và màu nền khi hover
                            })
                        )}
                    >
                        <HomeIcon className="mr-2 size-5" /> {/* Biểu tượng trang chủ */}
                        <span className="hidden md:inline">Home</span> {/* Hiển thị "Home" trên màn hình lớn */}
                    </Link>

                    {/* Liên kết đến trang chat chỉ khi người dùng đã đăng nhập */}
                    <SignedIn>
                        <Link
                            to="/chat"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost", // Chế độ nút ghost (không nền)
                                    className: "w-full justify-start text-white hover:bg-zinc-800", // Căn chỉnh và màu nền khi hover
                                })
                            )}
                        >
                            <MessageCircle className="mr-2 size-5" /> {/* Biểu tượng tin nhắn */}
                            <span className="hidden md:inline">Messages</span> {/* Hiển thị "Messages" trên màn hình lớn */}
                        </Link>
                    </SignedIn>
                </div>
            </div>

            {/* Phần Playlists (Thư viện) */}
            <div className="flex-1 rounded-lg bg-zinc-900 p-4"> {/* Container cho Playlists */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className="size-5 mr-2" /> {/* Biểu tượng thư viện */}
                        <span className="hidden md:inline">Playlists</span> {/* Hiển thị "Playlists" trên màn hình lớn */}
                    </div>
                </div>

                {/* Khu vực cuộn cho danh sách album */}
                <ScrollArea className="h-[calc(100vh-300px)]"> {/* Đảm bảo scrollable đúng chiều cao */}
                    <div className="space-y-2">
                        {isLoading ? (  // Nếu dữ liệu đang tải, hiển thị Skeleton loader
                            <PlaylistSkeleton />
                        ) : (
                            // Khi dữ liệu đã được tải, hiển thị danh sách album
                            albums.map((album) => (
                                <Link
                                    to={`/albums/${album._id}`} // Liên kết đến trang album chi tiết
                                    key={album._id} // Mỗi album có một khoá duy nhất
                                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                                >
                                    {/* Hình ảnh album */}
                                    <img
                                        src={album.imageUrl}
                                        alt="Playlist img"
                                        className="size-12 rounded-md flex-shrink-0 object-cover"
                                    />
                                    {/* Thông tin album */}
                                    <div className="flex-1 min-w-0 hidden md:block">
                                        <p className="font-medium truncate">{album.title}</p> {/* Tên album */}
                                        <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p> {/* Tên nghệ sĩ */}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default LeftSidebar;
