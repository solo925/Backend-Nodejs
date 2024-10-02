
import http from 'http';
const requestlister = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({ req }));
}

const server = http.createServer(requestlister);

server.listen(8000, () => {
    console.log('Server is running at http://localhost:3000/');
});