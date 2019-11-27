#!/usr/bin/env node

var main = require('../src/main')

function run (argv) {
    main.exec(argv)
}

run(process.argv.slice(2));