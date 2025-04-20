const { default: mongoose } = require("mongoose");
const Class = require("../models/ClassModel");

const createClass = async (newClass) => {
    const { name } = newClass;
    const checkClass = await Class.findOne({ name });
    if (checkClass) {
        return {
            status: 'ERR',
            message: 'The name of class already exists'
        };
    }

    try {
        const createdClass = await Class.create(newClass); // Using newClass directly
        return {
            status: "OK",
            message: "Tạo lớp học thành công",
            data: createdClass
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message || 'An error occurred while creating the class'
        };
    }
};


//  Lấy danh sách tất cả lớp học
const getAllClasses = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await Class.find().populate("course teacher students");
            resolve({
                status: "OK",
                message: "Lấy danh sách lớp học thành công",
                data: classes
            });
        } catch (e) {
            reject(e);
        }
    });
};

//  Lấy thông tin lớp học theo ID
const getClassById = (classId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const classData = await Class.findById(classId).populate("course teacher students");
            if (!classData) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học" });
            }
            resolve({
                status: "OK",
                message: "Lấy lớp học thành công",
                data: classData
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getClassesByStudentId = async (studentId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(studentId);

        const classes = await Class.find({ students: objectId }).populate("course teacher students");

        return {
            status: "OK",
            message: "Lấy danh sách lớp của học viên thành công",
            data: classes,
        };
    } catch (error) {
        return {
            status: "ERR",
            message: "Lỗi khi lấy lớp học: " + error.message,
        };
    }
};


// Cập nhật lớp học theo ID
const updateClass = (classId, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedClass = await Class.findByIdAndUpdate(classId, updateData, { new: true });
            if (!updatedClass) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học để cập nhật" });
            }
            resolve({
                status: "OK",
                message: "Cập nhật lớp học thành công",
                data: updatedClass
            });
        } catch (e) {
            reject(e);
        }
    });
};

//  Xóa lớp học theo ID
const deleteClass = (classId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedClass = await Class.findByIdAndDelete(classId);
            if (!deletedClass) {
                return resolve({ status: "ERR", message: "Không tìm thấy lớp học để xóa" });
            }
            resolve({
                status: "OK",
                message: "Xóa lớp học thành công",
                data: deletedClass
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getTotalStudent = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await Class.find().populate("course teacher students");

            // Tính tổng số học viên từ tất cả các lớp
            const totalStudents = classes.reduce((sum, classItem) => {
                return sum + (classItem.students?.length || 0);
            }, 0);

            resolve({
                status: "OK",
                message: "Lấy danh sách lớp học thành công",
                data: classes,
                totalStudents
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getTotalStudentByCourses = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy toàn bộ lớp học và populate course, students
            const classes = await Class.find().populate("course students");

            const courseStudentMap = new Map();

            classes.forEach((classItem) => {
                const courseId = classItem.course?._id?.toString();
                if (!courseId) return;

                if (!courseStudentMap.has(courseId)) {
                    courseStudentMap.set(courseId, new Set());
                }

                classItem.students?.forEach(student => {
                    courseStudentMap.get(courseId).add(student._id.toString());
                });
            });

            let totalStudents = 0;
            courseStudentMap.forEach(studentSet => {
                totalStudents += studentSet.size;
            });

            resolve({
                status: "OK",
                message: "Tổng số học viên từ tất cả khóa học",
                totalStudents
            });

        } catch (e) {
            reject(e);
        }
    });
};

const getTotalClasses = async () => {
    try {
        const count = await Class.countDocuments();
        return count;
    } catch (error) {
        throw new Error('Không thể đếm lớp học: ' + error.message);
    }
};


const getClassesByTeacherId = async (teacherId) => {
    try {
        const classes = await Class.find({ teacher: teacherId })
            .populate("course teacher students");
        return {
            status: "OK",
            message: "Lấy danh sách lớp của giảng viên thành công",
            data: classes
        };
    } catch (error) {
        return {
            status: "ERR",
            message: "Lỗi khi lấy lớp học: " + error.message
        };
    }
};

const getStudentsInClass = async (classId) => {
    try {
        const foundClass = await Class.findById(classId).populate("students", "-password");

        if (!foundClass) {
            return {
                status: "ERR",
                message: "Class not found"
            };
        }

        return {
            status: "OK",
            message: "Students retrieved successfully",
            students: foundClass.students
        };

    } catch (error) {
        return {
            status: "ERR",
            message: "Server error",
            error: error.message
        };
    }
};


module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getTotalStudentByCourses,
    getTotalClasses,
    getClassesByTeacherId,
    getStudentsInClass,
    getClassesByStudentId
}
