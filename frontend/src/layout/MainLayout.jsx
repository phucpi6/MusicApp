import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"; // Import các component cho giao diện thay đổi kích thước
import { Outlet } from "react-router-dom"; // Import Outlet từ react-router-dom, nơi chứa các trang con
import LeftSidebar from "./components/LeftSidebar"; // Import Sidebar bên trái
import FriendsActivity from "./components/FriendsActivity"; // Import Activity của bạn bè
import AudioPlayer from "./components/AudioPlayer"; // Import AudioPlayer
import { PlaybackControls } from "./components/PlaybackControls"; // Import các điều khiển phát nhạc
import { useEffect, useState } from "react"; // Import các hook của React

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false); // State để kiểm tra xem màn hình có phải là mobile không

    // useEffect kiểm tra kích thước màn hình và cập nhật trạng thái isMobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Nếu chiều rộng màn hình nhỏ hơn 768px, coi là mobile
        };

        checkMobile(); // Kiểm tra ngay khi component render
        window.addEventListener("resize", checkMobile); // Lắng nghe sự kiện thay đổi kích thước của cửa sổ
        return () => window.removeEventListener("resize", checkMobile); // Cleanup khi component bị hủy
    }, []); // useEffect chỉ chạy một lần khi component mount

    return (
        <div className='h-screen bg-black text-white flex flex-col'>
            {/* ResizablePanelGroup: Tạo một nhóm các panel có thể thay đổi kích thước */}
            <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
                <AudioPlayer /> {/* Component phát nhạc */}

                {/* Sidebar bên trái với ResizablePanel */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                    <LeftSidebar /> {/* Component Sidebar bên trái */}
                </ResizablePanel>

                {/* Handle thay đổi kích thước giữa các panel */}
                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                {/* Nội dung chính */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <Outlet /> {/* Outlet để render các trang con */}
                </ResizablePanel>

                {/* Sidebar bên phải chỉ hiển thị khi không phải mobile */}
                {!isMobile && (
                    <>
                        {/* Handle thay đổi kích thước giữa các panel */}
                        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                        {/* Sidebar bên phải với ResizablePanel */}
                        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                            <FriendsActivity /> {/* Component Activity của bạn bè */}
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>

            {/* PlaybackControls: Component điều khiển phát nhạc ở dưới cùng */}
            <PlaybackControls />
        </div>
    );
};

export default MainLayout;
