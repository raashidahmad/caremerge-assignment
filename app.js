const express = require('express');
const app = express();
const url = require('url');

//The middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
//End of middleware

/*
for initial testing only
app.get('/', (req, res) => {
    res.send('Hello from Node');
})*/

const PORT = process.env.PORT || 3000;

app.use('/', require('./controllers/titlecontroller'));

app.listen(PORT, () => {
    console.log(`Server started using the port ${PORT}`);
});