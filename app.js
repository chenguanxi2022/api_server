const express = require('express')
const app = express()

// cors跨域 
const cors = require('cors')
app.use(cors())

// 解析数据中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件，封装一个res.cc()函数
app.use((req, res, next) => {
  // 默认错误status=1
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 判断 err 为 Error实例对象还是字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 判断err instanceof joi.ValidationError
const joi = require('joi')

// 导入jwt 密钥配置文件
const config = require('./config')
// 导入解析 token 的中间件
const expressJwt = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 注册用户路由
const userRouter = require('./router/use')
app.use('/api', userRouter)
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
const artcateRouter = require('./router/artcate')
app.use('/my/article',artcateRouter)

// 错误中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

  // 未知错误

})
app.listen(3000, () => {
  console.log('Express server running at http://127.0.0.1:3000')
})