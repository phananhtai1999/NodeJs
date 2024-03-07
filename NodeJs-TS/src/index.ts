type Hanle = () => Promise<string>
const nameTest = 'Du Thanh Duoc Nha'
const hanle: Hanle = () => Promise.resolve(nameTest)
hanle().then(console.log)
console.log(nameTest)
