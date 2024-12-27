// Import các thành phần và hook cần thiết
import { usePlayerStore } from "../stores/usePlayerStore"; // Store quản lý trạng thái của trình phát nhạc
import { Card } from "./ui/card"; // Thành phần giao diện Card
import { PlayCircle } from "lucide-react"; // Biểu tượng phát nhạc

// Định nghĩa component SearchResults
const SearchResults = ({ results, isLoading, onSongSelect }) => {
    // Lấy hàm setCurrentSong từ store để đặt bài hát hiện tại
    const { setCurrentSong } = usePlayerStore();

    // Hàm xử lý khi nhấn vào một bài hát
    const handlePlay = (song) => {
        setCurrentSong(song); // Cập nhật bài hát hiện tại trong store
        onSongSelect(); // Gọi hàm để ẩn danh sách kết quả tìm kiếm
    };

    // Hiển thị giao diện khi dữ liệu đang tải
    if (isLoading) {
        return (
            <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-md border border-zinc-800 shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="p-4">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-4">
                                {/* Hiệu ứng skeleton cho hình ảnh */}
                                <div className="w-12 h-12 bg-zinc-800 rounded animate-pulse"></div>
                                {/* Hiệu ứng skeleton cho nội dung */}
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không có kết quả, không hiển thị gì
    if (!results?.length) {
        return null;
    }

    // Hiển thị danh sách kết quả tìm kiếm
    return (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-md border border-zinc-800 shadow-lg max-h-96 overflow-y-auto z-50">
            <div className="p-2">
                {results.map((song) => (
                    <Card
                        key={song._id} // Sử dụng _id của bài hát làm key
                        className="flex items-center space-x-4 p-2 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                        onClick={() => handlePlay(song)} // Gọi hàm khi nhấn vào bài hát
                    >
                        {/* Hiển thị hình ảnh bài hát */}
                        <img
                            src={song.imageUrl} // URL hình ảnh của bài hát
                            alt={song.title} // Alt text là tiêu đề bài hát
                            className="w-12 h-12 rounded object-cover"
                        />
                        {/* Hiển thị thông tin bài hát */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-white">
                                {song.title} {/* Tiêu đề bài hát */}
                            </p>
                            <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300">
                                {song.artist} {/* Tên nghệ sĩ */}
                            </p>
                        </div>
                        {/* Biểu tượng phát nhạc */}
                        <PlayCircle className="w-8 h-8 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                ))}
            </div>
        </div>
    );
};

// Xuất component để sử dụng ở nơi khác
export default SearchResults;
