'use strict'

var path = require('path')
  , fs = require('fs')
  , gepo = require('gepo')
  , exec = require('child_process').exec

module.exports = GHOpen

function GHOpen(opts) {
  if (!(this instanceof GHOpen))
    return new GHOpen(opts)

  opts = opts || {}
  this.dir = opts.dir || process.cwd()
  this.remote = opts.remote || 'origin'
  this.browser = opts.browser || undefined
}

GHOpen.prototype.checkPackage = function checkPackage(cb) {
  var fp = path.join(this.dir, 'package.json')
  fs.readFile(fp, 'utf8', function(err, data) {
    if (err) return cb(err)
    data = tryParseJSON(data)
    if (!data) return cb(new Error('No/invalid package.json'))

    if (data.repository && data.repository.type === 'git') {
      var u = gepo(data.repository.url)
      return cb(null, u)
    }

    cb(null, null)
  })
}

GHOpen.prototype.checkGit = function checkGit(cb) {
  var remote = this.remote
  var cmd = 'git config --get remote.' + remote + '.url'
  exec(cmd, {
    cwd: this.dir
  , env: process.env
  }, function(err, stdout, stderr) {
    if (err) return cb(err)
    var url = gepo(stdout.trim())
    if (url) return cb(null, url)
    cb(null, null)
  })
}

function tryParseJSON(data) {
  try {
    return JSON.parse(data)
  }
  catch (err) {
    return null
  }
}
