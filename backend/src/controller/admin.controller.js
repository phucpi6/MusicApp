import { Song } from "../models/song.model.js"; // Nhập model Song từ song.model.js
import { Album } from "../models/album.model.js"; // Nhập model Album từ album.model.js
import cloudinary from "../lib/cloudinary.js"; // Nhập thư viện Cloudinary để upload file

// Hàm hỗ trợ upload file lên Cloudinary
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto", // Tự động xác định loại tài nguyên
		});
		return result.secure_url; // Trả về URL an toàn của file đã upload
	} catch (error) {
		console.log("Error in uploadToCloudinary", error); // Ghi log lỗi nếu có
		throw new Error("Error uploading to cloudinary"); // Ném lỗi nếu upload thất bại
	}
};

// Controller tạo bài hát mới
export const createSong = async (req, res, next) => {
	try {
		// Kiểm tra xem đã upload đủ file audio và ảnh chưa
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" }); // Trả về lỗi nếu thiếu file
		}

		const { title, artist, albumId, duration } = req.body; // Lấy thông tin từ body request
		const audioFile = req.files.audioFile; // Lấy file audio
		const imageFile = req.files.imageFile; // Lấy file ảnh

		// Upload file lên Cloudinary
		const audioUrl = await uploadToCloudinary(audioFile); // Upload audio
		const imageUrl = await uploadToCloudinary(imageFile); // Upload ảnh

		// Tạo đối tượng bài hát mới
		const song = new Song({
			title,
			artist, 
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null, // Nếu không có albumId thì gán là null
		});

		await song.save(); // Lưu bài hát vào database

		// Nếu bài hát thuộc về album nào đó, cập nhật mảng songs của album đó
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id }, // Thêm bài hát vào mảng songs của album
			});
		}
		res.status(201).json(song); // Trả về bài hát vừa tạo
	} catch (error) {
		console.log("Error in createSong", error); // Ghi log lỗi nếu có
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller xóa bài hát
export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params; // Lấy ID bài hát từ params

		const song = await Song.findById(id); // Tìm bài hát theo ID

		// Nếu bài hát thuộc về album, cập nhật mảng songs của album đó
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id }, // Xóa bài hát khỏi mảng songs của album
			});
		}

		await Song.findByIdAndDelete(id); // Xóa bài hát khỏi database

		res.status(200).json({ message: "Song deleted successfully" }); // Trả về thông báo thành công
	} catch (error) {
		console.log("Error in deleteSong", error); // Ghi log lỗi nếu có
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller tạo album mới
export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body; // Lấy thông tin từ body request
		const { imageFile } = req.files; // Lấy file ảnh

		// Upload ảnh album lên Cloudinary
		const imageUrl = await uploadToCloudinary(imageFile); // Upload ảnh

		// Tạo đối tượng album mới
		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		await album.save(); // Lưu album vào database

		res.status(201).json(album); // Trả về album vừa tạo
	} catch (error) {
		console.log("Error in createAlbum", error); // Ghi log lỗi nếu có
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller xóa album
export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params; // Lấy ID album từ params
		// Xóa tất cả bài hát thuộc album này
		await Song.deleteMany({ albumId: id }); // Xóa tất cả bài hát có albumId tương ứng
		// Xóa album
		await Album.findByIdAndDelete(id); // Xóa album khỏi database
		res.status(200).json({ message: "Album deleted successfully" }); // Trả về thông báo thành công
	} catch (error) {
		console.log("Error in deleteAlbum", error); // Ghi log lỗi nếu có
		next(error); // Gọi middleware xử lý lỗi nếu có lỗi xảy ra
	}
};

// Controller kiểm tra quyền admin
export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true }); // Trả về thông tin quyền admin
};
