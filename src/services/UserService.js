const User = require('../models/UserModel')
const bcrypt = require('bcryptjs');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')
const EmailService = require('../services/EmailService')
const otps = {};

const generateOtp = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString(); 
};

const sendOtp = async (email) => {
    try {
        const now = Date.now(); 
        const cooldownPeriod = 60 * 1000; 
        if (otps[email]) {
            const { sentAt } = otps[email];
            if (now - sentAt < cooldownPeriod) {
                return {
                    status: 'ERR',
                    message: 'OTP đã được gửi tới email này. Vui lòng đợi một lúc trước khi gửi lại.'
                };
            }
        }
        const newOtp = generateOtp();
        otps[email] = {
            otp: newOtp,
            sentAt: now
        };
        await EmailService.sendOtpEmail(email, newOtp);
        return {
            status: 'OK',
            message: 'OTP đã được gửi tới email của bạn.'
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message || 'Có lỗi xảy ra khi gửi OTP.'
        };
    }
};


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const resendOtp = async (userData) => { 
    const { email } = userData;
    // Kiểm tra xem email có tồn tại trong danh sách OTP không
    if (!otps[email]) {
        throw new Error('Không tìm thấy mã OTP cho email này.');
    }
    // Gửi lại mã OTP qua email
    const otp = otps[email];
    await EmailService.sendOtpEmail(email, otp);
    return { status: 'SUCCESS', message: 'Mã OTP đã được gửi lại!' };
}

const resetPassword = async (email, otp, newPassword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 'ERR',
                message: 'Người dùng không tồn tại.'
            };
        }
        if (!otps[email] || otps[email].otp !== otp) {
            return {
                status: 'ERR',
                message: 'OTP không hợp lệ hoặc không được cung cấp.'
            };
        }
        delete otps[email];
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return {
            status: 'SUCCESS',
            message: 'Mật khẩu đã được đặt lại thành công.'
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.'
        };
    }
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email });
            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại vui lòng đăng kí!'
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return resolve({
                    status: 'ERR',
                    message: 'Thông tin tài khoản hoặc mật khẩu không chính xác'
                });
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isTeacher: checkUser.isTeacher
                
            });

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isTeacher: checkUser.isTeacher
            });

            resolve({
                status: 'OK',
                message: 'Login successful',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    });
};



const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ok',
                    message: 'the user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'ok',
                message: 'success',
                data: updatedUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ok',
                    message: 'the user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'ok',
                message: 'delete user success'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany(id)
            resolve({
                status: 'ok',
                message: 'delete user success'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'ok',
                message: 'getall user success',
                data: allUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ok',
                    message: 'the user is not defined'
                })
            }
            resolve({
                status: 'ok',
                message: 'Succes',
                data: user
            })
        }
        catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    otps,
    sendOtp,
    resendOtp,
    resetPassword,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}
