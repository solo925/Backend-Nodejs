const express = require('express');
const app = express();

// express.json(inflate=false,)
app.get('/', (res, req) => {
    res.send("Hello")
})

app.listen(3000)