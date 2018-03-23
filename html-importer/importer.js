'use strict';
const through = require('through2'),
    File = require('vinyl'),
    fs = require('fs');

module.exports = function (opt) {
    return through.obj(function (file, enc, callback) {
        let content = null,
            importContent = null;
        // Empty file not supported
        if (!file.contents.toString().trim().length) {
            this.push(file);
            return callback(null);
        }

        content = file.contents.toString();
        for (let i = 0; opt.templates.length > i; i++) {
            while (content.indexOf(opt.templates[i].name) !== -1) {
                importContent = fs.readFileSync(opt.src + opt.templates[i].url, 'utf8').toString();
                content = content.replace(opt.templates[i].name, importContent);
                i = 0;
            }
        }
        callback(null,
            new File({
                contents: new Buffer(content),
                bace: process.cwd(),
                path: file.relative
            })
        );
    })
}
