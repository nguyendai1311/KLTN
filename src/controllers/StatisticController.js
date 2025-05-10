const Order = require("../models/OrderProduct");
const Course = require("../models/CourseModel");
const Class = require("../models/ClassModel");

const getMonthlyRevenue = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const data = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" }
        }
      },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy doanh thu", error: err.message });
  }
};



const getCourseStudentDistribution = async (req, res) => {
  try {
    const courses = await Course.find().populate("classes");
    const result = courses.map(course => {
      const studentCount = course.classes.reduce(
        (sum, cls) => sum + (cls.students?.length || 0),
        0
      );
      return { name: course.name, value: studentCount };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy số học viên theo khóa học", error: err.message });
  }
};


const getStudentGrowth = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const classes = await Class.find({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });

    const monthlyGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: `T${i + 1}`,
      students: 0
    }));

    for (let cls of classes) {
      const month = new Date(cls.createdAt).getMonth(); // 0-based
      monthlyGrowth[month].students += cls.students?.length || 0;
    }

    res.json(monthlyGrowth);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy tăng trưởng học viên", error: err.message });
  }
};

module.exports = {
  getMonthlyRevenue,
  getCourseStudentDistribution,
  getStudentGrowth
};