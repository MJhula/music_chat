const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
const bcrypt = require('bcryptjs') //解析密码并验证是否相等

exports.getUserInfo = (req, res) =>{
    // res.send('ok')
    const sql = 'select id, username, nickname, email, user_pic from user where id=?'
    db.query(sql, req.user.id, (err, results)=>{
        if(err) return res.cc(err)//1. 执行 SQL 语句失败
        if(results.length !==1) return res.cc('获取用户信息失败')//执行 SQL 语句成功,但是查询到的数据条数不等于 1
        res.send({
            status:0,
            mas:'获取用户基本信息成功',
            data:results[0],
        })
    })
}

exports.updateUserInfo = (req, res) =>{
    const sql  = 'update user set ? where id=?'

    db.query(sql, [req.body, req.body.id], (err, results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('修改用户信息失败')
        return res.cc('修改信息成功', 0)
    })
}


exports.updatePassword = (req, res)=>{
    // res.send('ok')
    const sql = 'select * from user where id=?'
    db.query(sql, req.user.id, (err,results)=>{
        if(err) res.cc(err)
        if(results.length !==1) return res.cc('用户不存在')
        // 判断提交的旧密码（是用户输入并提交过来的）是否正确
        // console.log(results[0])
        const compareSync  = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if( !compareSync) return res.cc('原密码错误！')

        const sql_upd = 'update user set password=? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        
        db.query(sql_upd,[newPwd, req.user.id], (err, results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !==1) return res.cc('更新密码失败')
            res.cc('更新密码成功', 0)
        })
    })
}

exports.updateAvatar = (req, res) =>{
    const sql = 'update user set user_pic=? where id=?'

    db.query(sql, [req.body.avatar, req.user.id], (err, results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新用户头像失败')
        res.cc('更新头像成功！',0)
    })
}

