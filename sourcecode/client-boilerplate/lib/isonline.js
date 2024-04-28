'use strict'
const request = require('request')

// cli usage example
// lounger isonline http://localhost:5984
const cli = (url) => {}

// api usage example
// lounger.commands.isonline('http://localhost:5984')
const isOnline = (url) => {}

exports.api = isOnline
exports.cli = cli
