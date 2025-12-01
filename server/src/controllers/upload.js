export const uploadImage = async (req, res) => {
  try {
    // Kiểm tra xem có file được upload không
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được upload!",
      });
    }

    const uploadedImages = req.files;

    // Lấy URL của các ảnh đã upload lên Cloudinary
    const imageUrls = uploadedImages.map((image) => image.path);

    res.status(200).json({ success: true, urls: imageUrls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi upload ảnh!",
      error: error.message,
    });
  }
};
