const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const EmailService = require('../services/EmailService');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const otps = UserService.otps; 
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email là bắt buộc.'
            });
        }

        const response = await UserService.sendOtp(email);
        return res.status(response.status === 'OK' ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Có lỗi xảy ra trên server.'
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone,otp } = req.body;

        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailReg.test(email);

        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const isPasswordValid = passwordReg.test(password);

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
            
        } else if (!isEmailValid) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            });
        } else if (!isPasswordValid) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Password phải có ít nhất 8 ký tự, bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.'
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Password và confirmPassword không khớp.'
            });
        }
 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email đã tồn tại. Vui lòng chọn email khác.'
            });
        }
        
        if (!otps[email] || otps[email].otp !== otp) {
            return res.status(400).json({
                status: 'ERR',
                message: 'OTP không hợp lệ.'
            });
        }

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ 
            message: e.message || 'Internal server error'
        });
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email là bắt buộc.'
            });
        }

        const response = await UserService.sendOtp(email);
        return res.status(response.status === 'OK' ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Có lỗi xảy ra trên server.'
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        const user = User.findOne({ email })
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email, OTP và mật khẩu mới là bắt buộc.'
            });
        }

        const response = await UserService.resetPassword(email, otp, newPassword);
        return res.status(response.status === 'SUCCESS' ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Có lỗi xảy ra trên server.'
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email và OTP là bắt buộc.'
            });
        }
        if (otps[email] && otps[email] === otp) {
            delete otps[email]; // Xóa OTP sau khi xác minh thành công
            const response = await UserService.createUser({ email, ...req.body });
            return res.status(201).json({
                status: 'SUCCESS',
                message: 'Người dùng được tạo thành công.',
                data: response
            });
        } else {
            return res.status(400).json({
                status: 'ERR',
                message: 'OTP không hợp lệ hoặc đã hết hạn.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Có lỗi xảy ra trên server.',
            error: error.message || error
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email and password are required'
            });
        }
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thông tin mật khẩu không hợp lệ'
            })
        }

        const response = await UserService.loginUser(req.body);

        if (response.status === 'ERR') {
            return res.status(401).json({
                status: 'ERR',
                message: response.message
            });
        }

        const { refresh_token, ...newResponse } = response;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({ ...newResponse, refresh_token });

    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error',
            error: e.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
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
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    resendOtp,
    sendOtp,
    resetPassword,
    verifyOtp,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany
}