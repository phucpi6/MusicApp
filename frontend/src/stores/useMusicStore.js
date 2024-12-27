import { axiosInstance } from "@/lib/axios"; // Import axios để gọi API
import toast from "react-hot-toast"; // Thư viện để hiển thị thông báo
import { create } from "zustand"; // Thư viện Zustand để quản lý state

// Tạo store bằng Zustand để quản lý trạng thái của ứng dụng nhạc
export const useMusicStore = create((set) => ({
    // Các trạng thái của ứng dụng
    albums: [], // Danh sách album
    songs: [], // Danh sách bài hát
    isLoading: false, // Trạng thái đang tải dữ liệu
    error: null, // Lỗi nếu có khi gọi API
    currentAlbum: null, // Album hiện tại
    madeForYouSongs: [], // Bài hát gợi ý cho người dùng
    featuredSongs: [], // Bài hát nổi bật
    trendingSongs: [], // Bài hát thịnh hành
    searchResults: [], // Kết quả tìm kiếm bài hát
    stats: { // Thống kê ứng dụng
        totalSongs: 0, // Tổng số bài hát
        totalAlbums: 0, // Tổng số album
        totalUsers: 0, // Tổng số người dùng
        totalArtists: 0, // Tổng số nghệ sĩ
    },

    // Hàm xóa bài hát
    deleteSong: async (id) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            await axiosInstance.delete(`/admin/songs/${id}`); // Gọi API để xóa bài hát

            // Cập nhật lại danh sách bài hát trong store sau khi xóa
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
            }));
            toast.success("Song deleted successfully"); // Hiển thị thông báo thành công
        } catch (error) {
            console.log("Error in deleteSong", error); // Log lỗi
            toast.error("Error deleting song"); // Hiển thị thông báo lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm xóa album
    deleteAlbum: async (id) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            await axiosInstance.delete(`/admin/albums/${id}`); // Gọi API để xóa album
            set((state) => ({
                albums: state.albums.filter((album) => album._id !== id), // Cập nhật lại danh sách album
                songs: state.songs.map((song) =>
                    song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song // Cập nhật album của bài hát nếu album bị xóa
                ),
            }));
            toast.success("Album deleted successfully"); // Hiển thị thông báo thành công
        } catch (error) {
            toast.error("Failed to delete album: " + error.message); // Hiển thị thông báo lỗi nếu xóa album thất bại
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy danh sách bài hát
    fetchSongs: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/songs"); // Gọi API để lấy danh sách bài hát
            set({ songs: response.data }); // Lưu danh sách bài hát vào state
        } catch (error) {
            set({ error: error.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy thông tin thống kê (tổng số bài hát, album, người dùng, nghệ sĩ)
    fetchStats: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/stats"); // Gọi API để lấy thông tin thống kê
            set({ stats: response.data }); // Lưu dữ liệu thống kê vào state
        } catch (error) {
            set({ error: error.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy danh sách album
    fetchAlbums: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/albums"); // Gọi API để lấy danh sách album
            set({ albums: response.data }); // Lưu danh sách album vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy album theo ID
    fetchAlbumById: async (id) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get(`/albums/${id}`); // Gọi API để lấy album theo ID
            set({ currentAlbum: response.data }); // Lưu album vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy danh sách bài hát nổi bật
    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/songs/featured"); // Gọi API để lấy bài hát nổi bật
            set({ featuredSongs: response.data }); // Lưu bài hát nổi bật vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy danh sách bài hát gợi ý cho người dùng
    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/songs/made-for-you"); // Gọi API để lấy bài hát gợi ý
            set({ madeForYouSongs: response.data }); // Lưu bài hát gợi ý vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm lấy danh sách bài hát thịnh hành
    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/songs/trending"); // Gọi API để lấy bài hát thịnh hành
            set({ trendingSongs: response.data }); // Lưu bài hát thịnh hành vào state
        } catch (error) {
            set({ error: error.response.data.message }); // Lưu lỗi vào state nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm tìm kiếm bài hát
    searchSongs: async (query) => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            if (!query?.trim()) { // Nếu không có từ khóa tìm kiếm, trả về danh sách rỗng
                set({ searchResults: [] });
                return;
            }
            const response = await axiosInstance.get(`/songs/search?query=${encodeURIComponent(query)}`); // Gọi API để tìm kiếm bài hát
            set({ searchResults: response.data }); // Lưu kết quả tìm kiếm vào state
        } catch (error) {
            set({ error: error.message }); // Lưu lỗi vào state nếu có lỗi
            toast.error("Error searching songs"); // Hiển thị thông báo lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },

    // Hàm xóa kết quả tìm kiếm
    clearSearch: () => {
        set({ searchResults: [] }); // Xóa kết quả tìm kiếm
    },

    // Hàm tải thêm bài hát
    getMoreSongs: async () => {
        set({ isLoading: true, error: null }); // Đặt trạng thái đang tải
        try {
            const response = await axiosInstance.get("/songs/more"); // Gọi API để lấy thêm bài hát
            return response.data; // Trả về dữ liệu bài hát mới
        } catch (error) {
            set({ error: error.message }); // Lưu lỗi vào state nếu có lỗi
            toast.error("Error loading more songs"); // Hiển thị thông báo lỗi
            return []; // Trả về danh sách rỗng nếu có lỗi
        } finally {
            set({ isLoading: false }); // Đặt trạng thái không còn tải
        }
    },
}));
