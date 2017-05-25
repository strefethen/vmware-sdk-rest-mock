#!/usr/bin/env node
var program = require('commander');
const fs = require('fs');
const chalk = require('chalk');

// List all files in a directory in Node.js recursively in a synchronous fashion
// https://gist.github.com/kethinov/6658166
var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

program
  .version('0.0.1')
  .arguments('<path>')
  .action(function(path) {
    console.log(chalk.bold('Output Path: '+ path));
    let files = walkSync(path);
    files.map((file) => {
        if (file.includes('mappings') && file.endsWith('.json')) {
            let mapping = fs.readFileSync(`${file}`);
            console.log(JSON.parse(mapping).request.url);
        }
    });
  })
  .parse(process.argv);
