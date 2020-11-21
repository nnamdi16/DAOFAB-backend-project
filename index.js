const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(require('./db')());
const middlewares = jsonServer.defaults();
const {fetchTransaction, fetchParentTransaction, fetchChildTransactionByParentId} = require('./transactions/transaction.controller')


server.use(middlewares);

server.get('/transactionDetails',fetchTransaction);
server.get('/parentTransactions' , fetchParentTransaction);
server.get('/childTransactionsByParentId', fetchChildTransactionByParentId);

server.use(router);
server.listen(3000,  () =>
    console.log('JSON Server is running'))
