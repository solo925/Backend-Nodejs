import fs from 'fs';
// const process = require('process');

import path from 'path';

console.log(path);
console.log(path.basename("/home/davinci / Desktop / node / commonjs / first.js"));
console.log(path.extname("first.js"));
console.log(path.extname("first.js.jfj"));
console.log(path.join("/student/", "/: id/", "/search = marks"));
console.log(path.resolve("/student/", "/: id/", "/search = marks"));
console.log(path.parse("/home/davinci / Desktop / node / commonjs / first.js"))

const pathObject = {
    root: '/',
    dir: '/home/davinci / Desktop / node / commonjs ',
    base: ' first.js',
    ext: '.js',
    name: ' first'
}


console.log(path.format(pathObject));
console.log();



fs.readFile('/home/davinci/Desktop/node/commonjs/starters.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

console.log();

process.on('UncaughtExcepton', (error) => {
    console.log(`There was uncaught exception: ${error}`);
    process.exit(1);
})

fs.readFile('/home/davinci/Desktop/node/starters.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// with proces module

// console.log(process);

// import('dotenv').config();
// process.env;
// console.log(process.env.db);
console.log("hello");

// process.argv;

fs.readFile(path.join(__dirname, "starters.txt"), (error, data) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(data.toString());
})

const EventEmitter = require('events')
const logger = new Logger();

EventEmitter.EventEmitter(logger)






