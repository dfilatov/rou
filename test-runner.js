var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

var mocha = new Mocha({ reporter : 'spec' });

fs.readdirSync('test')
    .filter(function(file){
        return file.substr(-3) === '.js';

    })
    .forEach(function(file) {
        mocha.addFile(path.join('test', file));
    });


mocha.run(function(failures){
    process.exit(failures);
});
