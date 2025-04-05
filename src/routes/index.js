const UserRouter = require('./UserRouter')
const CourseRouter = require('./CourseRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const ScheduleRouter = require('./ScheduleRouter')
const ClassRouter = require('./ClassRouter')
const AttendanceRouter = require('./AttendanceRouter')
const ReviewRouter = require('./ReviewRouter')
const ExamRouter = require('./ExamRouter')
const ScoreRouter = require('./ScoreRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/course', CourseRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/schedule', ScheduleRouter)
    app.use('/api/class', ClassRouter)
    app.use('/api/attendance', AttendanceRouter)
    app.use('/api/review', ReviewRouter)
    app.use('/api/exam', ExamRouter)
    app.use('/api/score', ScoreRouter)
}

module.exports = routes