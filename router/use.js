const express = require('express')

const router = express.Router()

const userHandler = require('../router_handler/user')

// 表单数据验证
const { reg_login_schema } = require('../schema/user')
const expressJOI = require('@escook/express-joi')

// 用户注册
router.post('/reguser', expressJOI(reg_login_schema), userHandler.regUser)

// 用户登录
router.post('/login', expressJOI(reg_login_schema), userHandler.login)

module.exports = router