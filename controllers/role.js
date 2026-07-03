const Role = require("../models/role");
const Permission = require("../models/permission");


const createRole = async (req, res) => {
    try {

        const { roleName, description } = req.body;

        if (!roleName) {
            return res.status(400).json({
                success: false,
                message: "Role Name is required"
            });
        }

        const roleExists = await Role.findOne({ roleName });

        if (roleExists) {
            return res.status(400).json({
                success: false,
                message: "Role already exists"
            });
        }

        const role = await Role.create({
            roleName,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Role Created Successfully",
            data: role
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const getAllRoles = async (req, res) => {

    try {

        const roles = await Role.find({
            deletedAt: null
        }).populate("permissions");

        return res.status(200).json({
            success: true,
            count: roles.length,
            data: roles
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const getRoleById = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id)
            .populate("permissions");

        if (!role || role.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: role
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const updateRole = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role || role.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Role Updated Successfully",
            data: updatedRole
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const deleteRole = async (req, res) => {

    try {

        const role = await Role.findById(req.params.id);

        if (!role || role.deletedAt) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        role.deletedAt = new Date();

        await role.save();

        return res.status(200).json({
            success: true,
            message: "Role Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const assignPermissions = async (req, res) => {

    try {

        const { roleId, permissions } = req.body;

        if (!roleId || !permissions || !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: "Role ID and Permissions are required"
            });
        }

        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        const permissionExists = await Permission.find({
            _id: { $in: permissions }
        });

        if (permissionExists.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid"
            });
        }

        role.permissions = permissions;

        await role.save();

        const updatedRole = await Role.findById(roleId)
            .populate("permissions");

        return res.status(200).json({
            success: true,
            message: "Permissions Assigned Successfully",
            data: updatedRole
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignPermissions
};