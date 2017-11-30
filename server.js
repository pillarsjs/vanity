var project = require('pillars'),
    GDB = require("goblindb"),
    config = require('./config');

// Goblin Setup
var goblinDB = GDB();

// Starting the project
project.services.get('http').configure({
    port: process.env.PORT || 3000
}).start();

project.routes.add(new Route({
    id: 'root',
    path: '/',
    directory: {
        path: './public/index.html',
        listing: true
    }
}));

// Statics
project.routes.add(new Route({
    id: 'staticRoute',
    path: '/*:path',
    directory: {
        path: './public',
        listing: true
    }
}));