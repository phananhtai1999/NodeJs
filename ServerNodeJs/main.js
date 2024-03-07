const http = require('http')
const POST = 4000
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(`{"message" :"Hello"}`)
})

server.listen(POST, () => {
    console.log(`Serve is running post ${POST}`)
})