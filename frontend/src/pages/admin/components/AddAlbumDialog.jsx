import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false); // Điều khiển trạng thái mở/đóng hộp thoại
    const [isLoading, setIsLoading] = useState(false); // Điều khiển trạng thái đang tải
    const fileInputRef = useRef(null); // Tham chiếu đến input file

    const [newAlbum, setNewAlbum] = useState({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    }); // Dữ liệu album mới

    const [imageFile, setImageFile] = useState(null); // Dữ liệu ảnh bìa album

    // Hàm xử lý khi chọn ảnh
    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    // Hàm xử lý khi người dùng gửi thông tin album
    const handleSubmit = async () => {
        setIsLoading(true); // Bắt đầu quá trình tải

        try {
            if (!imageFile) {
                return toast.error("Please upload an image"); // Nếu không có ảnh, hiển thị lỗi
            }

            const formData = new FormData();
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());
            formData.append("imageFile", imageFile);

            await axiosInstance.post("/admin/albums", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng form-data
                },
            });

            // Reset lại các trường sau khi gửi thành công
            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: new Date().getFullYear(),
            });
            setImageFile(null);
            setAlbumDialogOpen(false); // Đóng hộp thoại
            toast.success("Album created successfully"); // Hiển thị thông báo thành công
        } catch (error) {
            toast.error("Failed to create album: " + error.message); // Hiển thị thông báo lỗi
        } finally {
            setIsLoading(false); // Kết thúc quá trình tải
        }
    };

    return (
        <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-violet-500 hover:bg-violet-600 text-white'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Album
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700'>
                <DialogHeader>
                    <DialogTitle>Add New Album</DialogTitle>
                    <DialogDescription>Add a new album to your collection</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    {/* Chọn ảnh album */}
                    <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept='image/*'
                        className='hidden'
                    />
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                                <Upload className='h-6 w-6 text-zinc-400' />
                            </div>
                            <div className='text-sm text-zinc-400 mb-2'>
                                {imageFile ? imageFile.name : "Upload album artwork"}
                            </div>
                            <Button variant='outline' size='sm' className='text-xs'>
                                Choose File
                            </Button>
                        </div>
                    </div>

                    {/* Nhập tiêu đề album */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Album Title</label>
                        <Input
                            value={newAlbum.title}
                            onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter album title'
                        />
                    </div>

                    {/* Nhập tên nghệ sĩ */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Artist</label>
                        <Input
                            value={newAlbum.artist}
                            onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter artist name'
                        />
                    </div>

                    {/* Nhập năm phát hành */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Release Year</label>
                        <Input
                            type='number'
                            value={newAlbum.releaseYear}
                            onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter release year'
                            min={1900}
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className='bg-violet-500 hover:bg-violet-600'
                        disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
                    >
                        {isLoading ? "Creating..." : "Add Album"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAlbumDialog;
