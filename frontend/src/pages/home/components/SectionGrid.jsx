import { useState } from 'react';  // Dùng hook useState để quản lý trạng thái
import SectionGridSkeleton from "./SectionGridSkeleton";  // Skeleton hiển thị trong khi tải dữ liệu
import { Button } from "@/components/ui/button";  // Lấy component Button từ thư viện UI
import PlayButton from "./PlayButton";  // Lấy component PlayButton để phát nhạc

const SectionGrid = ({ songs, title, isLoading }) => {
    const [showingMore, setShowingMore] = useState(false);  // Trạng thái điều khiển xem thêm bài hát

    // Hiển thị 4 bài đầu hoặc tất cả tùy thuộc vào trạng thái 'showingMore'
    const displayedSongs = showingMore ? songs : songs.slice(0, 4);

    // Hàm chuyển đổi giữa trạng thái xem thêm và thu gọn bài hát
    const handleToggleView = () => {
        setShowingMore(!showingMore);
    };

    // Nếu dữ liệu đang được tải, hiển thị Skeleton
    if (isLoading) return <SectionGridSkeleton />;

    // Chỉ hiện nút khi có nhiều hơn 4 bài hát
    const showButton = songs.length > 4;

    return (
        <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
                {/* Tiêu đề của section */}
                <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
                {/* Hiển thị nút 'Xem thêm' hoặc 'Thu gọn' nếu có nhiều hơn 4 bài hát */}
                {showButton && (
                    <Button 
                        variant='link'  // Nút dạng liên kết
                        className='text-sm text-zinc-400 hover:text-white'
                        onClick={handleToggleView}
                    >
                        {showingMore ? 'Thu gọn' : 'Xem thêm'}  {/* Text thay đổi khi trạng thái showingMore thay đổi */}
                    </Button>
                )}
            </div>

            {/* Grid hiển thị các bài hát */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {displayedSongs.map((song) => (
                    <div
                        key={song._id}
                        className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
                    >
                        {/* Hình ảnh album của bài hát */}
                        <div className='relative mb-4'>
                            <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className='w-full h-full object-cover transition-transform duration-300 
                                    group-hover:scale-105'
                                />
                            </div>
                            {/* Nút Play */}
                            <PlayButton song={song} />
                        </div>
                        {/* Tiêu đề và nghệ sĩ của bài hát */}
                        <h3 className='font-medium mb-2 truncate'>{song.title}</h3>
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionGrid;
