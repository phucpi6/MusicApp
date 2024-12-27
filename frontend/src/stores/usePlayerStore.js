import { create } from "zustand";
import { useChatStore } from "./useChatStore";

// Tạo store cho player
export const usePlayerStore = create((set, get) => ({
    currentSong: null, // Bài hát hiện tại đang phát
    isPlaying: false, // Trạng thái phát nhạc (đang phát hay dừng)
    queue: [], // Danh sách các bài hát trong playlist
    currentIndex: -1, // Chỉ số của bài hát hiện tại trong danh sách phát
    isShuffling: false, // Trạng thái phát ngẫu nhiên
    repeatMode: 'OFF', // Chế độ lặp lại (OFF, ONE, ALL)
    shuffledQueue: [], // Danh sách phát ngẫu nhiên (nếu bật chế độ shuffling)

    // Chuyển chế độ phát ngẫu nhiên (Shuffle)
    toggleShuffle: () => {
        const { isShuffling, queue, currentSong } = get();
        if (!isShuffling) {
            // Bật chế độ phát ngẫu nhiên
            const currentSongIndex = queue.findIndex(song => song._id === currentSong?._id);
            const remainingSongs = [...queue];
            if (currentSongIndex !== -1) {
                remainingSongs.splice(currentSongIndex, 1);
            }
            
            // Trộn ngẫu nhiên các bài hát còn lại
            for (let i = remainingSongs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
            }
            
            // Đặt bài hát hiện tại lên đầu
            const shuffledQueue = currentSong ? [currentSong, ...remainingSongs] : remainingSongs;
            
            set({
                isShuffling: true, // Bật chế độ shuffling
                shuffledQueue, // Cập nhật danh sách phát ngẫu nhiên
                currentIndex: 0, // Đặt bài hát hiện tại là bài đầu tiên trong danh sách phát ngẫu nhiên
            });
        } else {
            // Tắt chế độ phát ngẫu nhiên
            const currentSongIndex = queue.findIndex(song => song._id === currentSong?._id);
            set({
                isShuffling: false, // Tắt chế độ shuffling
                shuffledQueue: [], // Dọn sạch danh sách phát ngẫu nhiên
                currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0, // Đặt chỉ số hiện tại nếu có
            });
        }
    },

    // Chuyển chế độ lặp lại (Repeat)
    toggleRepeat: () => {
        set(state => {
            const modes = ['OFF', 'ONE', 'ALL']; // Các chế độ lặp lại
            const currentIndex = modes.indexOf(state.repeatMode);
            const nextIndex = (currentIndex + 1) % modes.length; // Chuyển sang chế độ lặp tiếp theo
            return { repeatMode: modes[nextIndex] }; // Cập nhật chế độ lặp
        });
    },

    // Khởi tạo danh sách phát (queue) với các bài hát
    initializeQueue: (songs) => {
        set({
            queue: songs, // Cập nhật danh sách bài hát
            currentSong: get().currentSong || songs[0], // Đặt bài hát hiện tại là bài đầu tiên trong danh sách
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex, // Đặt chỉ số bài hát nếu chưa có
            shuffledQueue: [], // Reset danh sách phát ngẫu nhiên
            isShuffling: false, // Reset trạng thái phát ngẫu nhiên
        });
    },

    // Phát một album, bắt đầu từ bài hát chỉ định
    playAlbum: (songs, startIndex = 0) => {
        if (songs.length === 0) return; // Nếu không có bài hát thì không làm gì

        const song = songs[startIndex]; // Lấy bài hát bắt đầu

        // Gửi thông tin hoạt động tới server (sử dụng socket)
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`, // Cập nhật trạng thái hoạt động
            });
        }
        set({
            queue: songs, // Cập nhật danh sách phát
            currentSong: song, // Đặt bài hát hiện tại
            currentIndex: startIndex, // Đặt chỉ số bài hát hiện tại
            isPlaying: true, // Đặt trạng thái đang phát
            shuffledQueue: [], // Reset danh sách phát ngẫu nhiên
            isShuffling: false, // Reset trạng thái phát ngẫu nhiên
        });
    },

    // Cập nhật bài hát hiện tại
    setCurrentSong: (song) => {
        if (!song) return; // Nếu không có bài hát thì không làm gì

        // Gửi thông tin hoạt động tới server (sử dụng socket)
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`, // Cập nhật trạng thái hoạt động
            });
        }

        const { isShuffling, queue, shuffledQueue } = get();
        const songIndex = isShuffling 
            ? shuffledQueue.findIndex((s) => s._id === song._id) // Nếu đang phát ngẫu nhiên, tìm bài hát trong danh sách ngẫu nhiên
            : queue.findIndex((s) => s._id === song._id); // Nếu không, tìm bài hát trong danh sách phát bình thường

        set({
            currentSong: song, // Cập nhật bài hát hiện tại
            isPlaying: true, // Đặt trạng thái đang phát
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex, // Cập nhật chỉ số bài hát hiện tại
        });
    },

    // Tạm dừng hoặc phát lại nhạc
    togglePlay: () => {
        const willStartPlaying = !get().isPlaying; // Lật trạng thái phát nhạc

        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity:
                    willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle", // Cập nhật trạng thái
            });
        }

        set({
            isPlaying: willStartPlaying, // Cập nhật trạng thái phát nhạc
        });
    },

    // Phát bài tiếp theo
    playNext: () => {
        const { currentIndex, queue, isShuffling, shuffledQueue, repeatMode, currentSong } = get();
        const songs = isShuffling ? shuffledQueue : queue;
        
        // Nếu đang ở chế độ lặp lại 1 bài
        if (repeatMode === 'ONE' && currentSong) {
            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${currentSong.title} by ${currentSong.artist}`, // Cập nhật trạng thái khi phát lại bài hiện tại
                });
            }
            // Phát lại bài hiện tại
            set({
                isPlaying: true
            });
            return;
        }

        let nextIndex = currentIndex + 1;

        // Nếu đang ở chế độ lặp lại tất cả và đã hết danh sách
        if (nextIndex >= songs.length && repeatMode === 'ALL') {
            nextIndex = 0; // Lặp lại từ đầu
        }

        if (nextIndex < songs.length) {
            const nextSong = songs[nextIndex];

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`, // Cập nhật trạng thái khi chuyển bài
                });
            }

            set({
                currentSong: nextSong, // Cập nhật bài hát hiện tại
                currentIndex: nextIndex, // Cập nhật chỉ số bài hát
                isPlaying: true, // Đặt trạng thái đang phát
            });
        } else {
            // Nếu không còn bài hát và không lặp lại
            set({ isPlaying: false });

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Idle`, // Cập nhật trạng thái khi dừng phát nhạc
                });
            }
        }
    },

    // Phát bài trước đó
    playPrevious: () => {
        const { currentIndex, queue, isShuffling, shuffledQueue, repeatMode, currentSong } = get();
        const songs = isShuffling ? shuffledQueue : queue;
        
        if (repeatMode === 'ONE' && currentSong) {
            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${currentSong.title} by ${currentSong.artist}`, // Cập nhật trạng thái khi phát lại bài hiện tại
                });
            }
            set({
                isPlaying: true
            });
            return;
        }

        let prevIndex = currentIndex - 1;

        if (prevIndex < 0 && repeatMode === 'ALL') {
            prevIndex = songs.length - 1; // Lặp lại từ cuối danh sách
        }

        if (prevIndex >= 0) {
            const prevSong = songs[prevIndex];

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`, // Cập nhật trạng thái khi chuyển về bài trước đó
                });
            }

            set({
                currentSong: prevSong, // Cập nhật bài hát hiện tại
                currentIndex: prevIndex, // Cập nhật chỉ số bài hát
                isPlaying: true, // Đặt trạng thái đang phát
            });
        } else {
            // Không có bài hát trước đó và không lặp lại
            set({ isPlaying: false });

            const socket = useChatStore.getState().socket;
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Idle`, // Cập nhật trạng thái khi dừng phát nhạc
                });
            }
        }
    },
}));
