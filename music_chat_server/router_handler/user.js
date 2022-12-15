// const res = require("express/lib/response");
const db = require('../db/index')

//使用 bcryptjs 对用户密码进行加密
const bcrypt = require('bcryptjs')

//使用JWT 生成 Token 字符串
const jwt = require('jsonwebtoken')

// 将用户信息对象加密成 Token 字符串
// 导入配置文件 
const config = require('../config')


exports.regUser = (req, res) =>{
    // res.send ('reuser ok')
    const userinfo  = req.body
    if(!userinfo.username || !userinfo.password){
        return res.send({
            status:1,
            msg:'用户名或密码不能为空！'
        })
    }

    const sqlstr = 'select * from cr_users where username=?'

    db.query(sqlstr, userinfo.username, (err, results)=>{
        if(err){
            // return sle_res.send({status:1,msg:err.message})
            return res.cc(err)
        }
        //用户名已经存在
        if(results.length>0){
            // return sle_res.send({status:1,message:"用户名被占用，请更换"})
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 否则 插入新用户
        /// 对用户的密码,进行 bcrype 加密,返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sqlstr_ins = 'insert into cr_users set ?'
        db.query(sqlstr_ins, {username:userinfo.username, password:userinfo.password}, (err, results)=>{
            // if(err) return results.send({status:1,msg:err.message})
            if (err) return res.cc(err)

            if(results.affectedRows !== 1){
                // return results.send({status:1,msg:'注册失败，稍后再试'})
                return res.cc('注册用户失败，请稍后再试！')
            }
            // results.send({status:0,msg:'注册成功！'})
            res.cc('注册成功！', 0)
        })
    })
}

exports.login = (req, res)=>{
    // res.send('login ok')
    const userinfo = req.body

    const sqlstr = 'select * from cr_users where username=?'
    db.query(sqlstr, userinfo.username, (err, results)=>{
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功,但是查询到数据条数不等于 1
        if(results.length !==1) return res.cc('登录失败')
        // 判断用户输入的登录密码是否和数据库中的密码一致
        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult){
            return res.cc('登陆失败')
        }
        // 登录成功,生成 Token 字符串:

        // 通过 ES6 的高级语法,快速剔除 密码 和 头像 的值:
        const user = {...results[0], password:'',user_pic:''}
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecreKey, {  //随后 发送的请求都带Authorization字段的token 
            expiresIn: '10h'
        })
        res.send({
            status:0,
            msg:'登陆成功', 
            token:'Bearer ' + tokenStr,
        })
    })
}