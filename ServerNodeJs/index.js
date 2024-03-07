const express = require('express')
const app = express()

const POST = 3000

app.get('/', (req,res) => {
    res.send("Hello, world!")
})
app.get('/hi', (req,res) => {
    res.send("Hi, world!")
})

app.listen(POST, () => {
    console.log(`listening on port ${POST}`)
})