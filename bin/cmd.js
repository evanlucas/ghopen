#!/usr/bin/env node

'use strict'
var nopt = require('nopt')
  , GH = require('../')
  , help = require('help')()
  , path = require('path')
  , knownOpts = { remote: String
                , browser: String
                , help: Boolean
                , version: Boolean
                , dir: path
                }
  , shortHand = { r: ['--remote']
                , b: ['--browser']
                , h: ['--help']
                , v: ['--version']
                , p: ['--path']
                }
  , parsed = nopt(knownOpts, shortHand)
  , pkg = require('../package')
  , open = require('open')
  , log = require('npmlog')

log.heading = 'ghopen'

if (parsed.help)
  return help()

if (parsed.version) {
  console.log('ghopen', 'v' + pkg.version)
  return
}

var opts = {
  dir: parsed.dir || process.cwd()
, remote: parsed.remote || 'origin'
, browser: parsed.browser
}

var gh = new GH(opts)
gh.checkPackage(function(err, url) {
  if (url) {
    return open(url, gh.browser)
  }
  gh.checkGit(function(err, url) {
    if (url) {
      return open(url, gh.browser)
    }

    log.error(':(', 'unable to find repo')
    process.exit(1)
  })
})
