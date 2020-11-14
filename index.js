const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(require('./db')());
const middlewares = jsonServer.defaults();
const {fetchTransaction} = require('./transactions/transaction.controller')


server.use(middlewares);

server.get('/fetch',fetchTransaction);

server.use(router);
server.listen(3000, function () {
    console.log('JSON Server is running')
    })
