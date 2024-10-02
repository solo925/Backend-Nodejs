import http from 'http';
import router from './routes.js';


const listner = (req, res) => {
    router(req, res)
}

const server = http.createServer(listner)
const PORT = 3000;
const HOST = 'localhost';
server.listen(PORT, HOST, () => {
    console.log(`server running at port ${PORT}`);

});