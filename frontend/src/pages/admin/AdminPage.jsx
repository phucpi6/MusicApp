import { useAuthStore } from "@/stores/useAuthStore"; // Nhập hook để quản lý trạng thái xác thực
import Header from "./components/Header"; // Nhập component Header để hiển thị phần đầu trang
import DashboardStats from "./components/DashboardStats"; // Nhập component để hiển thị thống kê
import { Album, Music } from "lucide-react"; // Nhập các biểu tượng Album và Music từ lucide-react
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Nhập các thành phần Tabs từ UI
import SongsTabContent from "./components/SongsTabContent"; // Nhập component nội dung Tab cho "Songs"
import AlbumsTabContent from "./components/AlbumsTabContent"; // Nhập component nội dung Tab cho "Albums"
import { useEffect } from "react"; // Nhập hook useEffect để quản lý tác vụ bất đồng bộ
import { useMusicStore } from "@/stores/useMusicStore"; // Nhập hook để quản lý các dữ liệu liên quan đến âm nhạc

// Component chính AdminPage, hiển thị giao diện quản lý cho admin
const AdminPage = () => {
    const { isAdmin, isLoading } = useAuthStore(); // Lấy trạng thái người dùng là admin từ store

    // Lấy các hàm fetch từ store để tải dữ liệu album, bài hát và thống kê
    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

    // Tải dữ liệu khi component được render lần đầu
    useEffect(() => {
        fetchAlbums(); // Tải dữ liệu album
        fetchSongs(); // Tải dữ liệu bài hát
        fetchStats(); // Tải dữ liệu thống kê
    }, [fetchAlbums, fetchSongs, fetchStats]); // Chạy lại khi các hàm fetch thay đổi

    // Nếu người dùng không phải là admin và dữ liệu đang được tải, hiển thị thông báo Unauthorized
    if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

    return (
        <div
            className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
            to-black text-zinc-100 p-8'
        >
            {/* Hiển thị Header */}
            <Header />

            {/* Hiển thị DashboardStats */}
            <DashboardStats />

            {/* Tabs để chuyển đổi giữa các tab "Songs" và "Albums" */}
            <Tabs defaultValue='songs' className='space-y-6'>
                <TabsList className='p-1 bg-zinc-800/50'>
                    {/* Tab cho Songs */}
                    <TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
                        <Music className='mr-2 size-4' />
                        Songs
                    </TabsTrigger>
                    {/* Tab cho Albums */}
                    <TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
                        <Album className='mr-2 size-4' />
                        Albums
                    </TabsTrigger>
                </TabsList>

                {/* Nội dung của tab Songs */}
                <TabsContent value='songs'>
                    <SongsTabContent />
                </TabsContent>
                {/* Nội dung của tab Albums */}
                <TabsContent value='albums'>
                    <AlbumsTabContent />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPage;
