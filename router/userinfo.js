const express = require('express')
const router = express.Router()

// 获取和更新用户信息处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 表单数据验证规则
const {update_userinfo_schema,update_password_schema} = require('../schema/user')
const expressJoi = require('@escook/express-joi')

// 获取用户信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

module.exports = router