import { Song } from "../models/song.model.js"; // Nhập model Song từ song.model.js

// Controller tìm kiếm bài hát theo tên hoặc nghệ sĩ
// Controller lấy thêm bài hát
export const getMoreSongs = async (req, res, next) => {
    try {
        // Lấy 12 bài hát ngẫu nhiên
        const songs = await Song.aggregate([
            { $sample: { size: 12 } }, // Lấy mẫu ngẫu nhiên
            {
                $project: {
                    _id: 1, // Chỉ lấy trường _id
                    title: 1, // Chỉ lấy trường title
                    artist: 1, // Chỉ lấy trường artist
                    imageUrl: 1, // Chỉ lấy trường imageUrl
                    audioUrl: 1, // Chỉ lấy trường audioUrl
                    duration: 1 // Chỉ lấy trường duration
                }
            }
        ]);
        res.json(songs); // Trả về danh sách bài hát
    } catch (error) {
        next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
    }
};

// Controller tìm kiếm bài hát theo tên hoặc nghệ sĩ
export const searchSongs = async (req, res, next) => {
    try {
        const { query } = req.query; // Lấy query từ request
        if (!query) {
            return res.json([]); // Trả về mảng rỗng nếu không có query
        }

        // Tìm kiếm bài hát với title hoặc artist chứa query (case insensitive)
        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Tìm theo title
                { artist: { $regex: query, $options: 'i' } } // Tìm theo artist
            ]
        }).limit(10); // Giới hạn kết quả trả về

        res.json(songs); // Trả về danh sách bài hát tìm được
    } catch (error) {
        next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
    }
};

// Controller lấy tất cả bài hát
export const getAllSongs = async (req, res, next) => {
	try {
		// Lấy tất cả bài hát và sắp xếp theo thời gian tạo
		const songs = await Song.find().sort({ createdAt: -1 }); // Sắp xếp giảm dần
		res.json(songs); // Trả về danh sách bài hát
	} catch (error) {
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller lấy các bài hát nổi bật
export const getFeaturedSongs = async (req, res, next) => {
	try {
		// Lấy ngẫu nhiên 6 bài hát sử dụng MongoDB aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 }, // Lấy mẫu ngẫu nhiên 6 bài hát
			},
			{
				$project: {
					_id: 1, // Chỉ lấy trường _id
					title: 1, // Chỉ lấy trường title
					artist: 1, // Chỉ lấy trường artist
					imageUrl: 1, // Chỉ lấy trường imageUrl
					audioUrl: 1, // Chỉ lấy trường audioUrl
				},
			},
		]);

		res.json(songs); // Trả về danh sách bài hát nổi bật
	} catch (error) {
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller lấy các bài hát được đề xuất cho người dùng
export const getMadeForYouSongs = async (req, res, next) => {
    try {
        // Lấy ngẫu nhiên 12 bài hát cho Made For You
        const songs = await Song.aggregate([
            {
                $sample: { size: 12 }, // Lấy mẫu ngẫu nhiên 12 bài hát
            },
            {
                $project: {
                    _id: 1, // Chỉ lấy trường _id
                    title: 1, // Chỉ lấy trường title
                    artist: 1, // Chỉ lấy trường artist
                    imageUrl: 1, // Chỉ lấy trường imageUrl
                    audioUrl: 1, // Chỉ lấy trường audioUrl
                    duration: 1 // Chỉ lấy trường duration
                },
            },
        ]);

        res.json(songs); // Trả về danh sách bài hát được đề xuất
    } catch (error) {
        next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
    }
};

// Controller lấy các bài hát đang thịnh hành
export const getTrendingSongs = async (req, res, next) => {
    try {
        // Lấy ngẫu nhiên 12 bài hát cho Trending
        const songs = await Song.aggregate([
            {
                $sample: { size: 12 }, // Lấy mẫu ngẫu nhiên 12 bài hát
            },
            {
                $project: {
                    _id: 1, // Chỉ lấy trường _id
                    title: 1, // Chỉ lấy trường title
                    artist: 1, // Chỉ lấy trường artist
                    imageUrl: 1, // Chỉ lấy trường imageUrl
                    audioUrl: 1, // Chỉ lấy trường audioUrl
                    duration: 1 // Chỉ lấy trường duration
                },
            },
        ]);

        res.json(songs); // Trả về danh sách bài hát thịnh hành
    } catch (error) {
        next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
    }
};
