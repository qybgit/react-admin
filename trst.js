const data = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
  { id: 3, value: 'A' },
  { id: 4, value: 'C' },
  { id: 5, value: 'B' },
  { id: 6, value: 'A' },
  { id: 7, value: 'A' },
]
// 定义一个空的哈希表
const hashTable = {}

// 遍历对象数组，将元素根据value值归类
data.forEach((item) => {
  const { id, value } = item

  if (hashTable[value]) {
    hashTable[value].push(id)
  } else {
    hashTable[value] = [id]
  }
})
console.log(hashTable)
console.log("ef")
console.log(Object.entries(hashTable))
m = {}
console.log(Object.keys(m).length)
if (m) {

  console.log("sd")
} else {
  console.log("sdr")
}
const t = {
  a: 1,
  test () { }
  , b: 3
}
console.log(t)
