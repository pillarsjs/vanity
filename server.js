var project = require('pillars'),
    GDB = require("goblindb"),
    config = require('./config');

// Goblin Setup
var goblinDB = GDB();

var data = goblinDB.get("packages") || [];

// Starting the project
project.services.get('http').configure({
    port: process.env.PORT || 3000
}).start();



// Root
project.routes.add(new Route({
    id: 'root',
    path: '/'
},function(gw){
    gw.render('./public/index.html');
}));

project.routes.add(new Route({
    id: 'api',
    path: '/api',
    cors: true
}, function(gw) {
    gw.json(data, {
        deep: 10
    });
}))

// Statics
project.routes.add(new Route({
    id: 'staticRoute',
    path: '/*:path',
    directory: {
        path: './public',
        listing: true
    }
}));
