import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.model.js";
import cloudinary from "../lib/claudinary.js";
import bcrypt from "bcryptjs";
import APIFeatures from "../lib/ApiFeautres.js";
dotenv.config();
export const SignUP = async (req, res) => {
  try {
    const { fristName, lastName, email, password, isAdmin } = req.body;
    const userOne = await User.findOne({ email });
    if (userOne) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!fristName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = new User({
      fristName,
      lastName,
      email,
      password,
      isAdmin,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.TOKENSECERTKEY);
    await res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(201).json({ message: "Signup has been successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.TOKENSECERTKEY);
    await res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).json({ message: "Login has been successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    res.status(200).json({ message: "Logout success" });
  } catch (error) {
    res.status(400).json({ message: "faild to logout" });
  }
};

export async function getCurrentUser(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllUser = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search();
    const user = await features.query;
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("error : ", error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(postId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.image) {
      await cloudinary.uploader.destroy(
        user.image.split("/").pop().split(".")[0]
      );
    }

    await User.findByIdAndDelete(postId);

    res.json({
      message: "User has been deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("error : ", error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const allfieldAllowed = [
      "fristName",
      "lastName",
      "email",
      "password",
      "image",
      "city",
      "country",
      "phone",
      "address",
    ];

    const updateData = {};
    for (const field of allfieldAllowed) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }
    if (req.body.image) {
      // Ensure field names match
      try {
        const result = await cloudinary.uploader.upload(req.body.image);

        updateData.image = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res
          .status(400)
          .json({ message: "Error uploading profile picture" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(400).json({ message: "User faild to update" });
    }
    res.json({
      message: "User has been updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: "faild to update Profile" });
    console.log("error : ", error.message);
  }
};

export const Checkrole = async (req, res) => {
  try {
    res.json({ message: "you are an admin" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const countUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
