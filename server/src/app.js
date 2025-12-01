import express from "express";
import cors from "cors";
import connect from "./database/index.js";
import {
  AuthRouter,
  CartRouter,
  CateRouter,
  ProductRouter,
  uploadRouter,
  mailRouter,
  orderRouter,
  blogRouter,
  voucherRouter,
  searchRouter,
  vnPayRouter,
  contactRouter,
  reviewRouter,
  roleRouter,
  soldProductRouter,
  refundRouter,
  notificationRouter,
  userAddressRouter,
} from "./routers/index.js";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", ProductRouter);
app.use("/users", AuthRouter);
app.use("/category", CateRouter);
app.use("/image", uploadRouter);
app.use("/mail", mailRouter);
app.use("/cart", CartRouter);
app.use("/order", orderRouter);
app.use("/blog", blogRouter);
app.use("/voucher", voucherRouter);
app.use("/search", searchRouter);
app.use("/vnpay", vnPayRouter);
app.use("/contact", contactRouter);
app.use("/review", reviewRouter);
app.use("/review", reviewRouter);
app.use("/role", roleRouter);
app.use("/soldProduct", soldProductRouter);
app.use("/refundHistory", refundRouter);
app.use("/notification", notificationRouter);
app.use("/userAddress", userAddressRouter);

// Health check endpoint for client to verify server is up
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

// Start server only after DB is connected to avoid Mongoose buffering timeouts
(async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (e) {
    console.error("Server not started due to DB connection error.");
    process.exit(1);
  }
})();
