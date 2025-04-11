const blogService = require("../services/BlogService");

const createBlog = async (req, res) => {
    try {
        const response = await blogService.createBlog(req.body);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const getAllBLog = async (req, res) => {
    try {
        const response = await blogService.getAllBlogs();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        const response = await blogService.getBlogById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const response = await blogService.updateBlog(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const response = await blogService.deleteBlog(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: error.message
        });
    }
};

module.exports = {
    createBlog,
    getAllBLog,
    getBlogById,
    updateBlog,
    deleteBlog
};
