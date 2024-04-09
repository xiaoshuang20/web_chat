import Bmob from 'hydrogen-js-sdk'
import path from 'path'

// 测试
Bmob.initialize('bc82f997576ffeca', 'xiao')

// const queryUsers = Bmob.Relation('users')
// //关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
// const relID = queryUsers.add('2af9d6f414')
// // console.log(relID)
// const queryUsers1 = Bmob.Query('users')
// queryUsers1.get('830ec3c630').then((res) => {
//   res.set('friends', relID) // 将Relation对象保存到two字段中，即实现了一对多的关联
//   res.save()
// })
// let id1 = '3dc0bb5e8c'
// let id2 = 'dc0af110cd'

// const test = (id1, id2) => {
//   const relation = Bmob.Relation('users')
//   const relID = relation.remove(id1)
//   const query = Bmob.Query('users')
//   query.get(id2).then((res) => {
//     res.set('friends', relID)
//     res.save()
//   })
// }

// test(id1, id2)
// test(id2, id1)

// const query = Bmob.Query('user_message')
// query
//   .get('b396db39ce')
//   .then((res) => {
//     res.unset('message')
//     res.save()
//   })
//   .catch((err) => {
//     console.log(err)
//   })
