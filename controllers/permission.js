const Permission = require("../models/permission");


const createPermission = async (req, res) => {
    try {

        const {
            actionName,
            description,
            method,
            baseUrl,
            path
        } = req.body;

        if (!actionName || !method || !baseUrl || !path) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory"
            });
        }

        const permissionExists = await Permission.findOne({ actionName });

        if (permissionExists) {
            return res.status(400).json({
                success: false,
                message: "Permission already exists"
            });
        }

        const permission = await Permission.create({
            actionName,
            description,
            method,
            baseUrl,
            path
        });

        return res.status(201).json({
            success: true,
            message: "Permission Created Successfully",
            data: permission
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const getAllPermissions = async (req, res) => {

    try {

        const permissions = await Permission.find({
            deletedAt: null
        });

        return res.status(200).json({
            success: true,
            count: permissions.length,
            data: permissions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getPermissionById = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission || permission.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: permission
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updatePermission = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission || permission.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        const updatedPermission = await Permission.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Permission Updated Successfully",
            data: updatedPermission
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deletePermission = async (req, res) => {

    try {

        const permission = await Permission.findById(req.params.id);

        if (!permission || permission.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        permission.deletedAt = new Date();

        await permission.save();

        return res.status(200).json({
            success: true,
            message: "Permission Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
};