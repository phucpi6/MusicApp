import { Route, Routes } from "react-router-dom"; // Thư viện để định tuyến trong React
import HomePage from "./pages/home/HomePage"; // Trang chính
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage"; // Trang callback sau khi xác thực
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"; // Thành phần xử lý callback sau xác thực với Clerk
import MainLayout from "./layout/MainLayout"; // Bố cục chính của ứng dụng
import ChatPage from "./pages/chat/ChatPage"; // Trang trò chuyện
import AlbumPage from "./pages/album/AlbumPage"; // Trang album
import AdminPage from "./pages/admin/AdminPage"; // Trang quản trị
import SignInPage from "./pages/auth/SignInPage"; // Trang đăng nhập

import { Toaster } from "react-hot-toast"; // Thành phần thông báo từ thư viện react-hot-toast
import NotFoundPage from "./pages/404/NotFoundPage"; // Trang không tìm thấy

// App component chính của ứng dụng
function App() {
    return (
        <>
            <Routes> {/* Các tuyến đường được định nghĩa trong Routes */}
                {/* Định nghĩa các tuyến đường đơn lẻ */}
                <Route path="/sign-in" element={<SignInPage />} /> {/* Đường dẫn đăng nhập */}
                <Route
                    path='/sso-callback' // Đường dẫn sau khi xác thực bằng SSO
                    element={<AuthenticateWithRedirectCallback signUpUrl="/sign-up" />} // Callback sau xác thực với Clerk
                />
                <Route path='/auth-callback' element={<AuthCallbackPage />} /> {/* Trang callback */}
                <Route path='/admin' element={<AdminPage />} /> {/* Trang quản trị */}

                {/* Định nghĩa các tuyến đường với layout chung */}
                <Route element={<MainLayout />}> 
                    <Route path='/' element={<HomePage />} /> {/* Trang chủ */}
                    <Route path='/chat' element={<ChatPage />} /> {/* Trang trò chuyện */}
                    <Route path='/albums/:albumId' element={<AlbumPage />} /> {/* Trang album với albumId */}
                    <Route path='*' element={<NotFoundPage />} /> {/* Trang lỗi 404 nếu không tìm thấy tuyến đường */}
                </Route>
            </Routes>
            <Toaster /> {/* Thành phần để hiển thị các thông báo (toast) */}
        </>
    );
}

export default App;
