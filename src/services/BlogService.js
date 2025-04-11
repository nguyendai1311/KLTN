const Blog = require('../models/BlogModel');

const createBlog = (blogData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newBlog = await Blog.create(blogData);
            resolve({
                status: "OK",
                message: "Tạo blog thành công",
                data: newBlog
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getAllBlogs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const blogs = await Blog.find();
            resolve({
                status: "OK",
                message: "Lấy tất cả blog thành công",
                data: blogs
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getBlogById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                reject({ message: "Blog không tồn tại" });
            }
            resolve({
                status: "OK",
                message: "Lấy blog thành công",
                data: blog
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateBlog = (id, blogData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
            if (!updatedBlog) {
                reject({ message: "Blog không tồn tại để cập nhật" });
            }
            resolve({
                status: "OK",
                message: "Cập nhật blog thành công",
                data: updatedBlog
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteBlog = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedBlog = await Blog.findByIdAndDelete(id);
            if (!deletedBlog) {
                reject({ message: "Blog không tồn tại để xóa" });
            }
            resolve({
                status: "OK",
                message: "Xóa blog thành công"
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};