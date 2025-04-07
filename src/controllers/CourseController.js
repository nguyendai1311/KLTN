const CourseService = require('../services/CourseSevice')
const Course = require('../models/CourseModel')

const createCourse = async (req, res) => {
    try {
        const { name, image, type, classes, price, rating, description, discount } = req.body;

        // Kiểm tra input
        if (!name || !type  ||!rating|| !price  || !discount ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required',
            });
        }

        // Tạo khóa học mới
        const newCourse = await Course.create({
            name,
            image,
            type,
            price,
            rating,
            description,
            discount: Number(discount),
            classes
        });

        return res.status(201).json({
            status: 'OK',
            message: 'Course created successfully',
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        const data = req.body
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await CourseService.updateCourse(courseId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// const updateCourse = async (req, res) => {
//     try {
//         const courseId = req.params.id
//         const data = req.body
//         if (!courseId) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The courseId is required'
//             })
//         }
//         const response = await CourseService.updateCourse(courseId, data)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

const getDetailsCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await CourseService.getDetailsCourse(courseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await CourseService.deleteCourse(courseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await CourseService.deleteManyCourse(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCourse = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await CourseService.getAllCourse(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await CourseService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCourse,
    updateCourse,
    getDetailsCourse,
    deleteCourse,
    getAllCourse,
    deleteMany,
    getAllType
}