import { useMusicStore } from "@/stores/useMusicStore";  // Lấy dữ liệu từ store quản lý nhạc
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";  // Component skeleton cho phần dữ liệu nhạc
import PlayButton from "./PlayButton";  // Component nút phát nhạc

const FeaturedSection = () => {
    const { isLoading, featuredSongs, error } = useMusicStore();  // Lấy dữ liệu từ store: trạng thái tải dữ liệu, bài hát nổi bật và lỗi

    // Nếu đang tải dữ liệu, hiển thị skeleton loader
    if (isLoading) return <FeaturedGridSkeleton />;

    // Nếu có lỗi, hiển thị thông báo lỗi
    if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {/* Duyệt qua danh sách bài hát nổi bật */}
            {featuredSongs.map((song) => (
                <div
                    key={song._id}  // Mỗi bài hát có một key riêng biệt (dựa vào id của bài hát)
                    className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                    hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                >
                    {/* Hiển thị ảnh của bài hát */}
                    <img
                        src={song.imageUrl}  // Lấy đường dẫn ảnh của bài hát
                        alt={song.title}  // Tên bài hát dùng làm mô tả cho ảnh
                        className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                    />
                    <div className='flex-1 p-4'>
                        {/* Tiêu đề bài hát */}
                        <p className='font-medium truncate'>{song.title}</p>
                        {/* Tên nghệ sĩ */}
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>
                    {/* Nút Play để phát bài hát */}
                    <PlayButton song={song} />
                </div>
            ))}
        </div>
    );
};

export default FeaturedSection;
