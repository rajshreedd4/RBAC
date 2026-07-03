const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/role");
const permissionRoutes = require("./routes/permission");
const userRoutes = require("./routes/user");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RBAC API Running Successfully"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});