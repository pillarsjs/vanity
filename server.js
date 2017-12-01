var project = require('pillars'),
    GDB = require("goblindb"),
    exec = require('child_process').exec,
    fs = require('fs'),
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

// Cron Tasks
var pythonRocks = new Scheduled({
    id: "pythonRocks",
    pattern: "00 9 * * * *", // 09:00 AM every day
    task: function() {
        config.packages.forEach(function(pkg){
            console.log(`---- Child process for pkg: ${pkg} Started! ------`);
            exec(`python3 scraper.py ${config.organization} ${pkg}`, function(error, stdout, stderr) {
                console.log(`---- Child process for pkg: ${pkg} Ended! -----`);
                if (stdout) {
                    console.log('stdout: ' + stdout);
                }
            
                if (stderr) {
                    console.log('stderr: ' + stderr);
                }
            
                if (error) {
                    console.log('exec error: ' + error);
                }
            });
        })
    }
}).start();

// Just for the first start.
pythonRocks.launch();
