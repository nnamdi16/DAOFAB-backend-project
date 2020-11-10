let parentRoute = require('./Parent.json');
let childRoute = require('./Child.json');

module.exports = function () {
    return {
        parentRoute,
        childRoute
    }
}