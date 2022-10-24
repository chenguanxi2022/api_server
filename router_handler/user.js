// 导入 jwt 加密token
const jwt = require('jsonwebtoken')

// 导入数据库db
const db = require('../db')

// 导入bcrypt 中间件加密密码
const bcrypt = require('bcryptjs')

// 导入jwt 密钥配置文件
const config = require('../config')

// 注册处理函数
exports.regUser = (req, res) => {
  // 使用userinfo接收数据
  const userinfo = req.body
  // 在数据库中查看用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    // SQL语句执行失败
    if (err) {
      return res.cc(err)
    }
    // SQL 语句执行成功
    // 用户名已存在
    if (results.length > 0) {
      return res.cc('用户名已被占用')
    }
    // 用户名不存在
    // 1、加密密码
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 2、插入用户
    const sqlStr = 'insert into ev_users set?'
    db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      // SQL 语句执行成功
      if (err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试')
      }
      // 注册用户成功
      res.cc('注册成功',0)
    })
  })
}

// 登录处理函数
exports.login = (req, res) => {
  // 使用userinfo接收数据
  const userinfo = req.body
  // 查看是否有该用户名
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr,userinfo.username,(err,results)=>{
    // SQL 语句执行失败
    if(err) {
      return res.cc(err)
    }
    // SQL 语句执行成功，但查询到的数据条数不等于1
    if(results.length!==1) {
      return res.cc('登陆失败')
    }
    // 用户输入的密码与数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
    if(!compareResult) {
      return res.cc('密码错误')
    }
    // 登陆成功（准备加密token）
    // 1、剔除密码和头像
    const user = {...results[0],password:''}
    // 2、加密token
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{
      expiresIn:'3h'    // token有效期为3h
    })
    // 3、将加密后的token响应给客户端
    res.send({
      status:0,
      msg:'登陆成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token:'Bearer '+ tokenStr
    })
  })
}

