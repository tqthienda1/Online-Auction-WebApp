import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
// import productDescRoutes from "./routes/productDescription.routes.js";
// import productImgRoutes from "./routes/productImage.routes.js";
// import bidRoutes from "./routes/bid.routes.js";
// import watchlistRoutes from "./routes/watchlist.routes.js";
import commentRoutes from "./routes/comment.routes.js";
// import upgradeRoutes from "./routes/upgrade.routes.js";
// import orderRoutes from "./routes/order.routes.js";
// import ratingRoutes from "./routes/rating.routes.js";
// import systemRoutes from "./routes/system.routes.js";
// import adminRoutes from "./routes/admin.routes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res) => res.send("Server is live!"));

app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/user", userRoutes);
app.use("/categories", categoryRoutes);
// app.use("/descriptions", productDescRoutes);
// app.use("/images", productImgRoutes);
// app.use("/bids", bidRoutes);
// app.use("/watchlist", watchlistRoutes);
app.use("/comments", commentRoutes);
// app.use("/upgrade", upgradeRoutes);
// app.use("/orders", orderRoutes);
// app.use("/rating", ratingRoutes);
// app.use("/system", systemRoutes);
// app.use("/admin", adminRoutes);

app.use("/products", productRoutes);

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
