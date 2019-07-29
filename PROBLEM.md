static in JS

bodyParser = require('body-parser'),
app = express().use(bodyParser.json());

vs.

{ urlencoded, json } = require('body-parser'),
app = express()
app.use(urlencoded({extended: true}));

Learn about async, await, promise
