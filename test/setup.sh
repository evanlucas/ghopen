#!/bin/bash

cd $(dirname $0)/..

mkdir -p test/fixtures/five
cd test/fixtures/five
git init
git remote add origin ''

cd $(dirname $0)/..

mkdir -p test/fixtures/four
cd test/fixtures/four
git init

cd $(dirname $0)/..

mkdir -p test/fixtures/six
cd test/fixtures/six
git init
git remote add origin git@github.com:evanlucas/ghopen
