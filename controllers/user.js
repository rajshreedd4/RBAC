const User = require("../models/user");
const Role = require("../models/role");


const createUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const roleExists = await Role.findById(role);

        if (!roleExists) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const createdUser = await User.findById(user._id)
            .populate("role");

        return res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: createdUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find({
            deletedAt: null
        })
        .select("-password")
        .populate({
            path: "role",
            populate: {
                path: "permissions"
            }
        });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password")
            .populate({
                path: "role",
                populate: {
                    path: "permissions"
                }
            });

        if (!user || user.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user || user.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (req.body.role) {

            const roleExists = await Role.findById(req.body.role);

            if (!roleExists) {
                return res.status(404).json({
                    success: false,
                    message: "Role not found"
                });
            }

        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        .select("-password")
        .populate("role");

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            data: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user || user.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.deletedAt = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const assignRole = async (req, res) => {

    try {

        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Role ID are required"
            });
        }

        const user = await User.findById(userId);
        const role = await Role.findById(roleId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        user.role = roleId;

        await user.save();

        const updatedUser = await User.findById(userId)
            .select("-password")
            .populate("role");

        return res.status(200).json({
            success: true,
            message: "Role Assigned Successfully",
            data: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    assignRole
};