const express = require('express');
const app = express();
const titlecontroller = require('./controllers/titlecontroller');

//The middleware
/*
We are not handling CORS, but just for the sake of learning writing this piece
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//End of middleware

const PORT = process.env.PORT || 3000;

app.get('/I/want/title/', titlecontroller.getTitles);
app.set('view engine', 'ejs');
app.listen(PORT, () => {
    console.log(`Server started using the port ${PORT}`);
});

