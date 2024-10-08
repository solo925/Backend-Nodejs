const http = require('http');

const PORT = 3001
const HOST = 'localhost';

// console.log(http.request);
// console.log(http.response);


const server = http.createServer((req, res) => {
    // console.log(http)
    // console.log(res)

    res.writeHead(200, {
        'content-type': 'application/json',
    }
    );
    res.end(JSON.stringify({ date: "it is fuciinfg running ion port 300" }));
    res.on('error', () => {
        console.log("something went wrong")
    })



})

server.listen(PORT, HOST, (req, res) => {
    console.log(`listening on ${PORT} Happy haCking`);
});