// app
const express = require('express');
const app = express();
const socket = require('socket.io');
// routers-api
const auth = require('./router/api/auth').router;
// routers-doc
const doc = require('./router/doc/doc');
// Setup-Template Engine
app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(express.static(__dirname + '/templates/static'));
// Setup-Data Parser
app.use(express.json());
app.use(require('body-parser').urlencoded({extended: false}));
app.use(require("cookie-parser")());
// Setup-Routers
app.use('/api/auth', auth);
app.use('/', doc);
// Setup-Socket
const server = require('http').Server(app);
require('./chat-app')(server);
server.listen(5000);
