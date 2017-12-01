var project = require('pillars'),
    GDB = require("goblindb"),
    exec = require('child_process').exec,
    fs = require('fs'),
    config = require('./config');

// Goblin Setup
var goblinDB = GDB();

// Starting the project
project.services.get('http').configure({
    port: process.env.PORT || 3000
}).start();

// Root
project.routes.add(new Route({
    id: 'root',
    path: '/'
},function(gw){
    gw.file('./public/index.html');
}));

project.routes.add(new Route({
    id: 'api',
    path: '/api',
    cors: true
}, function(gw) {
    var data = goblinDB.get("packages") || [];
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

var goblinRocks = new Scheduled({
    id: "goblinRocks",
    pattern: "05 9 * * * *",
    task: function(){
        fs.readdir('./data/', function (err, files) {
            if(err){
                console.log("ERROR reading ./data/:", err);
            } else {
                var pkgData = []
                files.forEach(function (file) {
                    console.log(`- Adding ${file} data to goblinDB!`);
                    pkgData.push(require("./data/"+file));
                });
                goblinDB.set(pkgData, "packages")
            }
        });
    }
})


// Just for the first start
if(!goblinDB.get("packages")){
    console.log("GoblinDB is empty! Time to run all the cron jobs...")
    pythonRocks.launch();
    
    // Setup a delay of 2 minutes for syncronization...
    setTimeout(function(){
        goblinRocks.launch()
    }, 2000);
}
