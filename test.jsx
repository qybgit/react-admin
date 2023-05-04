const arr = [
  {
    id: 1,
    name: '小明',
  },
  {
    id: 2,
    name: '小明2',
  },
  {
    id: 3,
    name: '小明3',
  },
]
const list = arr.filter((item) => item.id === 1)
console.log(list)
list[0].name = 'xiae'
console.log(list)
console.log(arr)

// const arr1 = [1, 2, 3, 4, 5, 5]
// const newArrr = arr1.map((item) => {
//   if (item > 3) {
//     return item
//   }
// })
// console.log(newArrr)
// newArrr[0] = 10
// console.log(newArrr)
// console.log(arr1)
