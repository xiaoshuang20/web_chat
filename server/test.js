import Bmob from 'hydrogen-js-sdk'

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
let id1 = '30497a417c'
let id2 = '3181c1fd8e'

const test = (id1, id2) => {
  const relation = Bmob.Relation('users')
  const relID = relation.remove(id1)
  const query = Bmob.Query('users')
  query.get(id2).then((res) => {
    res.set('friends', relID)
    res.save()
  })
}

test(id1, id2)
test(id2, id1)
