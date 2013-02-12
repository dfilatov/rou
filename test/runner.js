var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    mocha = new Mocha({ reporter : 'spec' });

fs.readdirSync(__dirname)
    .filter(function(file){
        return file !== 'runner.js';
    })
    .forEach(function(file) {
        mocha.addFile(path.join(__dirname, file));
    });

mocha.run(function(failures){
    process.exit(failures);
});
