// 导入数据库 db
const req = require('express/lib/request')
const res = require('express/lib/response')
const db = require('../db')

// 获取文章分类列表处理函数
exports.getArticleCates = (req,res)=>{
  // 定义 SQL 语句
  // 获取所有未被删除的分类列表数据，id默认升序排列（order by id asc）
  const sqlStr = 'select * from ev_article_cate where is_delete=0 order by id asc'
  // 执行 SQL 语句
  db.query(sqlStr,(err,results)=>{
    // SQL 执行失败
    if(err) {
      return res.cc(err)
    }
    // SQL 执行成功
    res.send({
      status:0,
      message:'获取文章分类列表成功',
      data:results
    })
  })
}

// 新增文章分类处理函数
exports.addArticleCates = (req,res)=>{
  // 定义 SQL 语句
  const sqlStr = 'select * from ev_article_cate where name=? or alias=?'
  // 执行 SQL 语句
  db.query(sqlStr,[req.body.name,req.body.alias],(err,results)=>{
    // SQL 语句执行失败
    if(err) {
      return res.send(err)
    }
    // SQL 语句执行成功
    // 1.分类名称和别名被占用，请更换后重试
    if((results.length===2)||(results.length===1&&results[0].name===req.body.name&&results[0].alias===req.body.alias)) {
      return res.cc('分类名称和别名被占用，请更换后重试')
    }
    // 2.分类名称被占用，请更换后重试
    if(results.length===1&&results[0].name===req.body.name) {
     return res.cc('分类名称被占用，请更换后重试')
    }
    // 3.分类别名被占用，请更换后重试
    if(results.length===1&&results[0].alias===req.body.alias) {
      return res.cc('分类别名被占用，请更换后重试')
    }
    // 4.分类名称和别名均未被占用
    // 实现新增文章分类的功能
    // 定义 SQL 语句
    const sqlStr ='insert into ev_article_cate set?'
    // 执行 SQL 语句
    db.query(sqlStr,{name:req.body.name,alias:req.body.alias},(err,results)=>{
      // SQL 语句执行失败
      if(err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为1
      if(results.affectedRows!==1) {
        return res.cc('新增文章分类失败')
      }
      // 新增文章分类成功
      res.cc('新增文章分类成功',0)
    })
  })
}

// 根据id删除文章分类的处理函数
exports.deleteCateById = (req,res)=>{
  // 定义 SQL 语句
  const sqlStr = 'update ev_article_cate set is_delete=1 where id=?'
  // 执行 SQL 语句
  db.query(sqlStr,req.params.id,(err,results)=>{
    // SQL 语句执行失败
    if(err) {
      return res.cc(err)
    }
    // SQL 语句执行成功，但影响行数不为1
    if(results.affectedRows!==1) {
      return res.cc('删除文章分类失败')
    }
    // 删除文章分类成功
    res.cc('删除文章分类成功',0)
  })
}

// 根据id获取文章分类数据
exports.getArtCateById = (req,res)=>{
  // 定义 SQL 语句
  const sqlStr = 'select * from ev_article_cate where id=?'
  // 执行 SQL 语句
  db.query(sqlStr,req.params.id,(err,results)=>{
    // SQL 执行失败
    if(err) {
      return res.cc(err)
    }
    // SQL 执行成功，但是没有查询到任何数据
    if(results.length!==1) {
      return res.cc('获取失败')
    }
    // 根据id获取文章分类数据成功，响应给客户端
    res.send({
      status:0,
      message:'根据id获取文章分类数据成功',
      data:results[0]
    })
  })
}

// 根据 Id 更新文章分类数据
exports.updateCateById = (req,res)=>{
  // 查询 分类名称 和 分类别名 是否被占用
  // 定义 SQL 语句
  const sqlStr = 'select * from ev_article_cate where id<>? and(name=? or alias=?)'
  // 执行 SQL 语句
  db.query(sqlStr,[req.body.id,req.body.name,req.body.alias],(err,results)=>{
    // SQL 语句执行失败
    if(err) {
      return res.cc(err)
    }
    // SQL 语句执行成功
    // 1.分类名称和别名被占用，请更换后重试
    if((results.length===2)||(results.length===1&&results[0].name===req.body.name&&results[0].alias===req.body.alias)) {
      return res.cc('分类名称和别名被占用，请更换后重试')
    }
    // 2.分类名称被占用，请更换后重试
    if(results.length===1&&results[0].name===req.body.name) {
     return res.cc('分类名称被占用，请更换后重试')
    }
    // 3.分类别名被占用，请更换后重试
    if(results.length===1&&results[0].alias===req.body.alias) {
      return res.cc('分类别名被占用，请更换后重试')
    }
    // 4.分类名称和别名均未被占用
    // 实现更新文章分类的功能
    // 定义 SQL 语句
    const sqlStr = 'update ev_article_cate set? where id=?'
    // 执行 SQL 语句
    db.query(sqlStr,[req.body,req.body.id],(err,results)=>{
      // SQL 执行语句失败
      if(err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为1
      if(results.affectedRows!==1) {
        return res.cc('更新失败')
      }
      // 更新成功
      res.cc('更新文章分类成功')
    })
  })
}
