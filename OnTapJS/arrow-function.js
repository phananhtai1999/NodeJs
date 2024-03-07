
// const data = () => {
//     console.log(123)
//     return "!23"
// } 
// console.log(data())
getName = () => {
    return "!23"
}

const user = {
    'name': 'John',
    as:getName
}

console.log(JSON.stringify(user))