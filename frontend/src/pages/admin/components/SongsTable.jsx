import { Button } from "@/components/ui/button"; // Nhập component Button từ thư viện UI để tạo nút bấm
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Nhập các thành phần bảng từ thư viện UI
import { useMusicStore } from "@/stores/useMusicStore"; // Nhập custom hook để lấy dữ liệu bài hát từ store
import { Calendar, Trash2 } from "lucide-react"; // Nhập các biểu tượng Calendar và Trash2 từ lucide-react

const SongsTable = () => {
    // Sử dụng custom hook useMusicStore để lấy dữ liệu từ store (danh sách bài hát, trạng thái loading, lỗi và hàm xóa bài hát)
    const { songs, isLoading, error, deleteSong } = useMusicStore();

    // Nếu đang tải dữ liệu bài hát, hiển thị thông báo "Loading songs..."
    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-8'>
                <div className='text-zinc-400'>Loading songs...</div>
            </div>
        );
    }

    // Nếu có lỗi khi tải dữ liệu bài hát, hiển thị thông báo lỗi
    if (error) {
        return (
            <div className='flex items-center justify-center py-8'>
                <div className='text-red-400'>{error}</div>
            </div>
        );
    }

    // Hiển thị bảng bài hát
    return (
        <Table>
            <TableHeader>
                {/* Tiêu đề của bảng, bao gồm các cột */}
                <TableRow className='hover:bg-zinc-800/50'>
                    <TableHead className='w-[50px]'></TableHead> {/* Cột trống cho ảnh bài hát */}
                    <TableHead>Title</TableHead> {/* Cột Tiêu đề bài hát */}
                    <TableHead>Artist</TableHead> {/* Cột Nghệ sĩ */}
                    <TableHead>Release Date</TableHead> {/* Cột Ngày phát hành */}
                    <TableHead className='text-right'>Actions</TableHead> {/* Cột hành động (Xóa bài hát) */}
                </TableRow>
            </TableHeader>

            <TableBody>
                {/* Duyệt qua danh sách bài hát và hiển thị từng bài hát trong bảng */}
                {songs.map((song) => (
                    <TableRow key={song._id} className='hover:bg-zinc-800/50'>
                        {/* Cột hình ảnh bài hát */}
                        <TableCell>
                            <img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
                        </TableCell>
                        {/* Cột Tiêu đề bài hát */}
                        <TableCell className='font-medium'>{song.title}</TableCell>
                        {/* Cột Nghệ sĩ */}
                        <TableCell>{song.artist}</TableCell>
                        {/* Cột Ngày phát hành */}
                        <TableCell>
                            <span className='inline-flex items-center gap-1 text-zinc-400'>
                                <Calendar className='h-4 w-4' /> {/* Biểu tượng lịch */}
                                {song.createdAt.split("T")[0]} {/* Hiển thị ngày phát hành (chỉ lấy phần ngày từ timestamp) */}
                            </span>
                        </TableCell>

                        {/* Cột hành động (Xóa bài hát) */}
                        <TableCell className='text-right'>
                            <div className='flex gap-2 justify-end'>
                                {/* Nút Xóa bài hát */}
                                <Button
                                    variant={"ghost"}
                                    size={"sm"}
                                    className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                    onClick={() => deleteSong(song._id)} // Khi nhấn nút, gọi hàm xóa bài hát
                                >
                                    <Trash2 className='size-4' /> {/* Biểu tượng thùng rác */}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SongsTable;
