const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmpassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'the email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10) // ma hoa pass
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                confirmpassword: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'ok',
                    message: 'success',
                    data: createdUser
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ok',
                    message: 'the user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password) // ma hoa pass       
            if (!comparePassword) {
                resolve({
                    status: 'ok',
                    message: 'The password or user incorrect',
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,

            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,

            })
            resolve({
                status: 'ok',
                message: 'success',
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

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
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}
