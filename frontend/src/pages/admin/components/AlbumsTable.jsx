import { Button } from "@/components/ui/button"; // Nhập nút từ thư viện UI
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Nhập các thành phần bảng từ thư viện UI
import { useMusicStore } from "@/stores/useMusicStore"; // Sử dụng hook để lấy dữ liệu album từ store
import { Calendar, Music, Trash2 } from "lucide-react"; // Nhập các biểu tượng từ thư viện lucide-react
import { useEffect } from "react"; // Sử dụng hook useEffect để thực hiện một hành động khi component render lần đầu

const AlbumsTable = () => {
    // Lấy các dữ liệu album, hàm xóa album và hàm tải album từ hook useMusicStore
    const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

    // Hook useEffect sẽ gọi hàm fetchAlbums khi component được render lần đầu
    useEffect(() => {
        fetchAlbums(); // Tải danh sách album từ backend khi component render
    }, [fetchAlbums]); // Chỉ gọi lại khi fetchAlbums thay đổi

    return (
        <Table>
            {/* Header của bảng */}
            <TableHeader>
                <TableRow className='hover:bg-zinc-800/50'>
                    <TableHead className='w-[50px]'></TableHead> {/* Cột đầu tiên để chứa ảnh album */}
                    <TableHead>Title</TableHead> {/* Tiêu đề cột "Title" */}
                    <TableHead>Artist</TableHead> {/* Tiêu đề cột "Artist" */}
                    <TableHead>Release Year</TableHead> {/* Tiêu đề cột "Release Year" */}
                    <TableHead>Songs</TableHead> {/* Tiêu đề cột "Songs" */}
                    <TableHead className='text-right'>Actions</TableHead> {/* Tiêu đề cột "Actions" - Các hành động như xóa */}
                </TableRow>
            </TableHeader>
            {/* Thân bảng - Hiển thị dữ liệu album */}
            <TableBody>
                {/* Lặp qua tất cả các album để tạo một dòng cho mỗi album */}
                {albums.map((album) => (
                    <TableRow key={album._id} className='hover:bg-zinc-800/50'>
                        {/* Cột chứa ảnh album */}
                        <TableCell>
                            <img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
                        </TableCell>
                        {/* Cột chứa tiêu đề album */}
                        <TableCell className='font-medium'>{album.title}</TableCell>
                        {/* Cột chứa tên nghệ sĩ */}
                        <TableCell>{album.artist}</TableCell>
                        {/* Cột chứa năm phát hành */}
                        <TableCell>
                            <span className='inline-flex items-center gap-1 text-zinc-400'>
                                <Calendar className='h-4 w-4' /> {/* Biểu tượng Calendar */}
                                {album.releaseYear} {/* Năm phát hành của album */}
                            </span>
                        </TableCell>
                        {/* Cột chứa số lượng bài hát trong album */}
                        <TableCell>
                            <span className='inline-flex items-center gap-1 text-zinc-400'>
                                <Music className='h-4 w-4' /> {/* Biểu tượng Music */}
                                {album.songs.length} songs {/* Hiển thị số lượng bài hát */}
                            </span>
                        </TableCell>
                        {/* Cột chứa các hành động - như xóa album */}
                        <TableCell className='text-right'>
                            <div className='flex gap-2 justify-end'>
                                {/* Nút xóa album */}
                                <Button
                                    variant='ghost' // Chế độ nút không màu nền
                                    size='sm' // Kích thước nhỏ
                                    onClick={() => deleteAlbum(album._id)} // Gọi hàm xóa album khi nút được nhấn
                                    className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                >
                                    <Trash2 className='h-4 w-4' /> {/* Biểu tượng thùng rác để xóa */}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AlbumsTable;
