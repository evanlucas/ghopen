'use strict'

var test = require('tap').test
  , fs = require('fs')
  , path = require('path')
  , exec = require('child_process').exec
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , GH = require('../')

test('checkPackage should return err if no package.json', function(t) {
  var gh = GH({
    dir: __dirname + '/test'
  })
  gh.checkPackage(function(err, res) {
    t.type(err, Error)
    t.end()
  })
})

test('checkPackage should return err if no json', function(t) {
  var gh = new GH({
    dir: __dirname + '/fixtures/one'
  })
  gh.checkPackage(function(err, res) {
    t.type(err, Error)
    t.equal(err.message, 'No/invalid package.json')
    t.end()
  })
})

test('checkPackage should return null, null if no repo', function(t) {
  var gh = new GH({
    dir: __dirname + '/fixtures/two'
  })
  gh.checkPackage(function(err, res) {
    t.ifError(err)
    t.equal(res, null)
    t.end()
  })
})

test('checkPackage should return null, url if repo', function(t) {
  var gh = new GH({
    dir: __dirname + '/fixtures/three'
  })
  gh.checkPackage(function(err, res) {
    t.ifError(err)
    t.equal(res, 'https://github.com/evanlucas/ghopen')
    t.end()
  })
})

test('checkGit should return err if exec errs', function(t) {
  var dir = path.join(__dirname, 'fixtures', 'four')
  mkdirp.sync(dir)
  var cmd = 'git init'
  exec(cmd, {
    cwd: dir
  , env: process.env
  }, function(err, stdout, stderr) {
    t.ifError(err, stderr)

    var gh = new GH({
      dir: __dirname + '/fixtures/four'
    })
    gh.checkGit(function(err, res) {
      t.type(err, Error)
      t.end()
    })
  })
})

test('checkGit should return null, null on invalid', function(t) {
  var dir = path.join(__dirname, 'fixtures', 'five')
  mkdirp.sync(dir)
  var cmd = 'git init && git remote add origin \'\''
  exec(cmd, {
    cwd: dir
  , env: process.env
  }, function(err, stdout, stderr) {
    t.ifError(err, stderr)

    var gh = new GH({
      dir: __dirname + '/fixtures/five'
    })
    gh.checkGit(function(err, res) {
      t.ifError(err)
      t.equal(res, null)
      t.end()
    })
  })
})

test('checkGit should return null, url on success', function(t) {
  var dir = path.join(__dirname, 'fixtures', 'six')
  mkdirp.sync(dir)
  var cmd = 'git init && ' +
    'git remote add origin \'git@github.com:evanlucas/ghopen\''
  exec(cmd, {
    cwd: dir
  , env: process.env
  }, function(err, stdout, stderr) {
    t.ifError(err, stderr)

    var gh = new GH({
      dir: __dirname + '/fixtures/six'
    })
    gh.checkGit(function(err, res) {
      t.ifError(err)
      t.equal(res, 'https://github.com/evanlucas/ghopen')
      t.end()
    })
  })
})

test('cleanup', function(t) {
  rimraf.sync(path.join(__dirname, 'fixtures', 'four'))
  rimraf.sync(path.join(__dirname, 'fixtures', 'five'))
  rimraf.sync(path.join(__dirname, 'fixtures', 'six'))
  t.end()
})
