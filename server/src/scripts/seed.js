import dotenv from "dotenv";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import user from "../models/user.js";
import category from "../models/category.js";
import product from "../models/products.js";
import role from "../models/roles.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bosshouse";

async function connect() {
  await mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000,
  });
}

async function seed() {
  console.log("Seeding database...");
  // Clear minimal sets (optional)
  await Promise.all([
    user.deleteMany({}),
    category.deleteMany({}),
    product.deleteMany({}),
    role.deleteMany({}),
  ]);

  // Categories - Pet food & accessories only
  const cats = await category.insertMany([
    { name: "Thức ăn cho chó", slug: "thuc-an-cho" },
    { name: "Thức ăn cho mèo", slug: "thuc-an-meo" },
    { name: "Phụ kiện chó", slug: "phu-kien-cho" },
    { name: "Phụ kiện mèo", slug: "phu-kien-meo" },
    { name: "Vệ sinh & chăm sóc", slug: "ve-sinh-cham-soc" },
    { name: "Đồ chơi", slug: "do-choi" },
    { name: "Sức khỏe & dinh dưỡng", slug: "suc-khoe-dinh-duong" },
    { name: "unCategorized", slug: "uncategorized" },
  ]);

  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c._id]));

  // Products - Pet food and accessories only (no live animals)
  const prods = await product.insertMany([
    // Thức ăn cho chó
    {
      name: "Thức ăn hạt Royal Canin cho chó con",
      description: "Royal Canin Puppy - thức ăn dinh dưỡng cao cấp cho chó con dưới 12 tháng tuổi. Hỗ trợ phát triển xương, răng, tăng cường miễn dịch. Xuất xứ Pháp.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "1kg", quantity: 50, price: 185000, importPrice: 135000 },
        { size: "3kg", quantity: 30, price: 520000, importPrice: 380000 },
        { size: "8kg", quantity: 15, price: 1250000, importPrice: 920000 },
      ],
      categoryId: catMap["thuc-an-cho"],
    },
    {
      name: "Thức ăn hạt Pedigree cho chó trưởng thành",
      description: "Pedigree Adult - thức ăn hoàn chỉnh cho chó trưởng thành, giàu protein từ thịt gà và rau củ. Giúp xương chắc khỏe, lông mượt.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "1.5kg", quantity: 45, price: 95000, importPrice: 68000 },
        { size: "3kg", quantity: 35, price: 175000, importPrice: 128000 },
        { size: "10kg", quantity: 20, price: 550000, importPrice: 410000 },
      ],
      categoryId: catMap["thuc-an-cho"],
    },
    {
      name: "Pate Whiskas cho mèo trưởng thành",
      description: "Pate Whiskas vị cá ngừ & cá hồi, 400g - thức ăn mềm bổ sung đầy đủ vitamin, khoáng chất cho mèo. Dễ tiêu hóa, thơm ngon.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "85g (1 gói)", quantity: 200, price: 15000, importPrice: 9000 },
        { size: "400g (hộp)", quantity: 80, price: 48000, importPrice: 32000 },
      ],
      categoryId: catMap["thuc-an-meo"],
    },
    {
      name: "Thức ăn hạt Me-O cho mèo",
      description: "Me-O Adult - thức ăn khô cho mèo trưởng thành, giúp giảm mùi phân, tốt cho đường tiêu hóa. Vị cá biển thơm ngon.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "1.2kg", quantity: 55, price: 85000, importPrice: 62000 },
        { size: "3kg", quantity: 35, price: 195000, importPrice: 145000 },
        { size: "7kg", quantity: 20, price: 420000, importPrice: 315000 },
      ],
      categoryId: catMap["thuc-an-meo"],
    },
    {
      name: "Xương gặm sạch răng Vegebrand",
      description: "Xương gặm Vegebrand Dental Care - giúp làm sạch răng, giảm cao răng, thơm miệng cho chó. Thành phần tự nhiên an toàn.",
      images: ["https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=500"],
      isActive: true,
      sizes: [
        { size: "S (5-10kg)", quantity: 60, price: 35000, importPrice: 22000 },
        { size: "M (10-20kg)", quantity: 45, price: 55000, importPrice: 36000 },
        { size: "L (>20kg)", quantity: 30, price: 75000, importPrice: 50000 },
      ],
      categoryId: catMap["suc-khoe-dinh-duong"],
    },

    // Phụ kiện cho chó
    {
      name: "Vòng cổ chó da thật cao cấp",
      description: "Vòng cổ da bò thật 100%, bền chắc, thoáng khí. Khóa kim loại chống gỉ, có móc gắn dây dắt. Phù hợp chó trung bình đến lớn.",
      images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"],
      isActive: true,
      sizes: [
        { size: "S (30-40cm)", quantity: 35, price: 120000, importPrice: 75000 },
        { size: "M (40-50cm)", quantity: 40, price: 150000, importPrice: 95000 },
        { size: "L (50-60cm)", quantity: 25, price: 180000, importPrice: 115000 },
      ],
      categoryId: catMap["phu-kien-cho"],
    },
    {
      name: "Lồng vận chuyển thú cưng IATA",
      description: "Lồng vận chuyển tiêu chuẩn hàng không IATA, nhựa ABS chắc chắn, có quạt thông gió, khay lót đáy tháo rời. An toàn khi di chuyển xa.",
      images: ["https://images.unsplash.com/photo-1544568104-5b7eb8189dd4?w=500"],
      isActive: true,
      sizes: [
        { size: "M (mèo, chó <8kg)", quantity: 12, price: 550000, importPrice: 380000 },
        { size: "L (chó 8-15kg)", quantity: 8, price: 850000, importPrice: 600000 },
        { size: "XL (chó >15kg)", quantity: 5, price: 1250000, importPrice: 900000 },
      ],
      categoryId: catMap["phu-kien-cho"],
    },
    {
      name: "Dây dắt chó có đệm tay cầm",
      description: "Dây dắt chó dù bền chắc, tay cầm có đệm xốp êm tay, móc xoay 360° chống rối. Chiều dài 1.5m phù hợp dắt chó đi dạo.",
      images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"],
      isActive: true,
      sizes: [
        { size: "S (chó <10kg)", quantity: 50, price: 75000, importPrice: 48000 },
        { size: "M (chó 10-25kg)", quantity: 45, price: 95000, importPrice: 62000 },
        { size: "L (chó >25kg)", quantity: 30, price: 125000, importPrice: 85000 },
      ],
      categoryId: catMap["phu-kien-cho"],
    },
    {
      name: "Bát ăn inox đôi kèm giá đỡ cho chó",
      description: "Bát ăn, uống inox 304 không gỉ, giá đỡ gỗ cao cấp giúp chó ăn uống đúng tư thế, tốt cho cột sống. Dễ vệ sinh.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "S (200ml x 2)", quantity: 45, price: 95000, importPrice: 60000 },
        { size: "M (500ml x 2)", quantity: 35, price: 145000, importPrice: 95000 },
        { size: "L (1000ml x 2)", quantity: 20, price: 195000, importPrice: 130000 },
      ],
      categoryId: catMap["phu-kien-cho"],
    },
    {
      name: "Khay vệ sinh cho mèo có viền cao",
      description: "Khay vệ sinh mèo nhựa PP cao cấp, viền cao chống văng cát, có xẻng xúc kèm theo. Dễ lau chùi, không thấm mùi.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "M (40x30cm)", quantity: 35, price: 125000, importPrice: 82000 },
        { size: "L (50x40cm)", quantity: 25, price: 185000, importPrice: 128000 },
      ],
      categoryId: catMap["phu-kien-meo"],
    },
    {
      name: "Nhà ngủ mèo dạng hang ấm áp",
      description: "Nhà ngủ mèo dạng hang lông cừu, giữ ấm tốt, êm ái thoải mái. Có thể gấp gọn, dễ vệ sinh. Phù hợp mùa đông.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "M (40x40cm)", quantity: 30, price: 195000, importPrice: 135000 },
        { size: "L (50x50cm)", quantity: 20, price: 275000, importPrice: 195000 },
      ],
      categoryId: catMap["phu-kien-meo"],
    },

    // Vệ sinh & chăm sóc
    {
      name: "Cát vệ sinh Catsan cho mèo",
      description: "Cát vệ sinh Catsan Hygiene Plus, khử mùi hiệu quả, vón cục nhanh, không bụi, an toàn cho mèo và người. Dung tích 10L.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "5L", quantity: 60, price: 120000, importPrice: 85000 },
        { size: "10L", quantity: 40, price: 220000, importPrice: 160000 },
        { size: "20L", quantity: 20, price: 410000, importPrice: 300000 },
      ],
      categoryId: catMap["ve-sinh-cham-soc"],
    },
    {
      name: "Sữa tắm Bio-Groom cho chó mèo",
      description: "Sữa tắm Bio-Groom Protein-Lanolin, công thức dưỡng ẩm chuyên sâu, giúp lông mượt, óng ả, giảm rụng lông. pH cân bằng, không kích ứng da.",
      images: ["https://images.unsplash.com/photo-1600353983520-1f50a1a3c9f1?w=500"],
      isActive: true,
      sizes: [
        { size: "250ml", quantity: 80, price: 135000, importPrice: 90000 },
        { size: "500ml", quantity: 50, price: 245000, importPrice: 170000 },
        { size: "1L", quantity: 25, price: 450000, importPrice: 320000 },
      ],
      categoryId: catMap["ve-sinh-cham-soc"],
    },
    {
      name: "Lược chải lông tự động",
      description: "Lược chải lông tự động One Touch, loại bỏ lông rụng hiệu quả, nút nhả lông tiện lợi. Đầu lược tròn êm ái, massage da thú cưng.",
      images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500"],
      isActive: true,
      sizes: [
        { size: "S (mèo, chó nhỏ)", quantity: 55, price: 85000, importPrice: 55000 },
        { size: "L (chó lớn)", quantity: 35, price: 125000, importPrice: 85000 },
      ],
      categoryId: catMap["ve-sinh-cham-soc"],
    },

    // Đồ chơi
    {
      name: "Bóng cao su gai massage",
      description: "Bóng đồ chơi cao su tự nhiên có gai massage, giúp làm sạch răng, tăng cường sức khỏe nướu răng khi chó cắn. Có tiếng kêu thu hút.",
      images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500"],
      isActive: true,
      sizes: [
        { size: "S (5cm)", quantity: 100, price: 45000, importPrice: 28000 },
        { size: "M (7cm)", quantity: 80, price: 65000, importPrice: 42000 },
        { size: "L (10cm)", quantity: 50, price: 95000, importPrice: 62000 },
      ],
      categoryId: catMap["do-choi"],
    },
    {
      name: "Cần câu lông vũ cho mèo",
      description: "Đồ chơi cần câu lông vũ đầu chuột, kích thích bản năng săn mồi của mèo. Thân cần carbon linh hoạt, có thể thay đầu đồ chơi.",
      images: ["https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500"],
      isActive: true,
      sizes: [
        { size: "Standard", quantity: 120, price: 35000, importPrice: 20000 },
        { size: "Premium (có 3 đầu)", quantity: 60, price: 75000, importPrice: 48000 },
      ],
      categoryId: catMap["do-choi"],
    },
    {
      name: "Kong Classic đồ chơi nhồi thức ăn",
      description: "Kong Classic - đồ chơi cao su tự nhiên nổi tiếng, có thể nhồi thức ăn bên trong, giúp chó giải trí, giảm stress khi ở nhà một mình.",
      images: ["https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=500"],
      isActive: true,
      sizes: [
        { size: "S", quantity: 40, price: 175000, importPrice: 125000 },
        { size: "M", quantity: 35, price: 225000, importPrice: 165000 },
        { size: "L", quantity: 25, price: 285000, importPrice: 210000 },
      ],
      categoryId: catMap["do-choi"],
    },
  ]);

  // Link products to categories
  await Promise.all(
    prods.map(async (p) => {
      await category.findByIdAndUpdate(p.categoryId, {
        $addToSet: { products: p._id },
      });
    })
  );

  // Users - realistic accounts
  const pwAdmin = await bcryptjs.hash("Admin@2024", 10);
  const pwStaff = await bcryptjs.hash("Staff@2024", 10);
  const pwUser1 = await bcryptjs.hash("User@123", 10);
  const pwUser2 = await bcryptjs.hash("User@456", 10);
  const pwUser3 = await bcryptjs.hash("User@789", 10);

  // Roles with full admin permissions
  const roles = await role.insertMany([
    {
      role: "admin",
      permissions: [
        "*", // Full access to all operations
        "deleteUser",
        "manageProducts",
        "manageOrders",
        "manageVouchers",
        "manageRoles",
        "manageCategories",
        "manageBlog",
        "manageContact",
        "manageReviews",
        "viewReports",
        "manageSettings",
      ],
    },
    { role: "nhanvien", permissions: ["manageProducts", "manageOrders", "viewReports"] },
    { role: "guest", permissions: [] },
  ]);
  const roleMap = Object.fromEntries(roles.map((r) => [r.role, r._id]));

  await user.insertMany([
    {
      username: "Nguyễn Văn Minh",
      email: "admin.bosshouse@gmail.com",
      password: pwAdmin,
      phoneNumber: 987654321,
      address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      roleId: roleMap["admin"],
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      username: "Trần Thị Hương",
      email: "nhanvien.huong@gmail.com",
      password: pwStaff,
      phoneNumber: 912345678,
      address: "456 Láng Hạ, Đống Đa, Hà Nội",
      roleId: roleMap["nhanvien"],
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      username: "Lê Hoàng Nam",
      email: "lehoangnam.hnt@gmail.com",
      password: pwUser1,
      phoneNumber: 909123456,
      address: "78 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      roleId: roleMap["guest"],
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
      username: "Phạm Minh Anh",
      email: "phamminhanh92@gmail.com",
      password: pwUser2,
      phoneNumber: 976543210,
      address: "234 Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh",
      roleId: roleMap["guest"],
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    {
      username: "Đặng Thu Trang",
      email: "thutrang.dang@gmail.com",
      password: pwUser3,
      phoneNumber: 965432109,
      address: "567 Lê Duẩn, Hải Châu, Đà Nẵng",
      roleId: roleMap["guest"],
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  ]);

  console.log("✅ Seeding completed successfully!");
  console.log("\n📧 Sample accounts:");
  console.log("👤 Admin: admin.bosshouse@gmail.com / Admin@2024");
  console.log("👤 Staff: nhanvien.huong@gmail.com / Staff@2024");
  console.log("👤 User1: lehoangnam.hnt@gmail.com / User@123");
  console.log("👤 User2: phamminhanh92@gmail.com / User@456");
  console.log("👤 User3: thutrang.dang@gmail.com / User@789");
  console.log("\n📦 Seeded:", prods.length, "products in", cats.length - 1, "categories");
  console.log("🎭 Created 3 roles: admin, nhanvien, guest\n");
}

async function main() {
  try {
    await connect();
    await seed();
  } catch (e) {
    console.error("Seed failed:", e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
