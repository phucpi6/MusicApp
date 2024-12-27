import mongoose from "mongoose"; // Nhập mongoose để làm việc với MongoDB

// Định nghĩa schema cho collection Album
const albumSchema = new mongoose.Schema(
	{
		// Tên album
		title: { type: String, required: true }, // Kiểu dữ liệu là String và là bắt buộc
		
		// Tên nghệ sĩ
		artist: { type: String, required: true }, // Kiểu dữ liệu là String và là bắt buộc
		
		// URL ảnh bìa album
		imageUrl: { type: String, required: true }, // Kiểu dữ liệu là String và là bắt buộc
		
		// Năm phát hành
		releaseYear: { type: Number, required: true }, // Kiểu dữ liệu là Number và là bắt buộc
		
		// Mảng các ID bài hát trong album
		// Tham chiếu đến model Song
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Mảng chứa các ID bài hát
	},
	{ timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model Album từ schema và export
export const Album = mongoose.model("Album", albumSchema);
