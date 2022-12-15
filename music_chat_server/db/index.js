const mysql = require ('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'mjhula123',
    database:'chatroom',
})

//for test 
// const sqlstr = 'select * from cr_users'
// db.query(sqlstr,(err,results)=>{
//     if(err) return console.log(err.message)
//     //select 查询返回的结果是一个数组
//     console.log(results)
// })

module.exports = db