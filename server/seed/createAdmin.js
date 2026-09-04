import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({
    $or: [
        { role: "admin" },
        { phone: "9888888888" },
        { email: "admin@gmail.com" },
        ],
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const admin = await User.create({
      fullName: "System Administrator",
      email: "admin@gmail.com",
      phone: "9888888888",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("✅ Admin created successfully.");
    console.log(admin);

    process.exit();

  } catch (error) {

    console.error("❌ Error creating admin:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();