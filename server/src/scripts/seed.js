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

  // Categories
  const cats = await category.insertMany([
    { name: "Chó giống", slug: "cho-giong" },
    { name: "Phụ kiện", slug: "phu-kien" },
    { name: "unCategorized", slug: "uncategorized" },
  ]);

  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c._id]));

  // Products
  const prods = await product.insertMany([
    {
      name: "Samoyed Puppy",
      description: "Chó Samoyed thuần chủng, sức khỏe tốt.",
      images: ["https://images.dog.ceo/breeds/samoyed/n02111889_1444.jpg"],
      isActive: true,
      sizes: [
        { size: "S", quantity: 5, price: 5000000, importPrice: 3500000 },
        { size: "M", quantity: 3, price: 7000000, importPrice: 5000000 },
      ],
      categoryId: catMap["cho-giong"] || cats[0]._id,
    },
    {
      name: "Vòng cổ chó",
      description: "Vòng cổ bền đẹp cho thú cưng.",
      images: ["https://via.placeholder.com/300x200?text=Vong+Co"],
      isActive: true,
      sizes: [{ size: "F", quantity: 20, price: 150000, importPrice: 80000 }],
      categoryId: catMap["phu-kien"] || cats[1]._id,
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

  // Users
  const pwAdmin = await bcryptjs.hash("admin123", 10);
  const pwUser = await bcryptjs.hash("user123", 10);

  // Roles
  const roles = await role.insertMany([
    {
      role: "admin",
      permissions: [
        "deleteUser",
        "manageProducts",
        "manageOrders",
        "manageVouchers",
        "manageRoles",
      ],
    },
    { role: "nhanvien", permissions: ["manageProducts", "manageOrders"] },
    { role: "guest", permissions: [] },
  ]);
  const roleMap = Object.fromEntries(roles.map((r) => [r.role, r._id]));

  await user.insertMany([
    {
      username: "Admin",
      email: "admin@bosshouse.local",
      password: pwAdmin,
      address: "Hà Nội",
      roleId: roleMap["admin"] || "admin",
    },
    {
      username: "User",
      email: "user@bosshouse.local",
      password: pwUser,
      address: "TP. HCM",
      roleId: roleMap["guest"] || "guest",
    },
  ]);

  console.log("Seeding done.");
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
