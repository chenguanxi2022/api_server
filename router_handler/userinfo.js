// 导入数据库操作模块
const db = require('../db')

// 导入加密中间件 bcryptjs
const bcrypt = require('bcryptjs')

// 获取用户信息
exports.getUserInfo = (req, res) => {
  // 定义 SQL 语句
  // 1、根据用户的 id，查询用户的基本信息
  // 2、注意：为了防止用户的密码泄露，需要排除 password 字段
  const sqlStr = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  // 执行 SQL 语句
  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sqlStr, req.user.id, (err, results) => {
    // SQL 语句执行失败
    if (err) {
      return res.cc(err)
    }
    //  SQL 语句执行成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) {
      return res.cc('用户信息查询失败')
    }
    // 将用户数据响应给客户端
    res.send({
      status: 0,
      msg: '用户信息查询成功',
      data: results[0]
    })
  })
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
  // 使用userinfo接收数据
  const userinfo = req.body
  // 防止与原信息相同
  const sqlStr = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  db.query(sqlStr, req.user.id, (err, results) => {
    if (
      results[0].nickname === userinfo.nickname &&
      results[0].email === userinfo.email &&
      results[0].user_pic === userinfo.user_pic &&
      results[0].username === userinfo.username
    ) {
      return res.cc('与原信息相同')
    }
    // 定义 SQL 语句
    const sqlStr = 'update ev_users set? where id=?'
    db.query(sqlStr, [userinfo, userinfo.id], (err, results) => {
      // SQL 语句执行失败
      if (err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为1
      if (results.affectedRows !== 1) {
        return res.cc('更新用户信息失败')
      }
      // 更新用户信息成功
      res.cc('更新用户信息成功', 0)
    })
  })
}

// 重置用户密码
exports.updatePassword = (req, res) => {
  // 查询用户是否存在
  // 定义 SQL 语句
  const sqlStr = 'select * from ev_users where id=?'
  // 执行 SQL 语句
  db.query(sqlStr, req.user.id, (err, results) => {
    // SQL 语句执行失败
    if (err) {
      return res.cc(err)
    }
    // SQL 语句执行成功,但用户不存在
    if (results.length !== 1) {
      return res.cc('用户不存在')
    }
    // 用户存在，判断提交旧密码是否正确
    // 使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) {
      return res.cc('原密码错误')
    }
    // 原密码正确,对原密码加密并存入数据库中
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 定义 SQL 语句
    const sqlStr = 'update ev_users set?where id=?'
    // 执行 SQL 语句
    db.query(sqlStr, [{ password: newPwd }, req.user.id], (err, results) => {
      // SQL 语句执行失败
      if (err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为1
      if (results.affectedRows !== 1) {
        return res.cc('重置密码失败')
      }
      // 重置密码成功
      res.cc('重置密码成功', 0)
    })
  })
}