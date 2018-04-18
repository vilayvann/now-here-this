# rnum
> Generate a random number of a given length

[![Travis](https://img.shields.io/travis/ecrmnn/rnum.svg?style=flat-square)](https://travis-ci.org/ecrmnn/rnum.svg?branch=master)
[![npm version](https://img.shields.io/npm/v/rnum.svg?style=flat-square)](http://badge.fury.io/js/rnum)
[![npm downloads](https://img.shields.io/npm/dm/rnum.svg?style=flat-square)](http://badge.fury.io/js/rnum)
[![npm license](https://img.shields.io/npm/l/rnum.svg?style=flat-square)](http://badge.fury.io/js/rnum)

### Installation
```bash
npm install rnum --save
```

### Usage
``rnum(1)`` will never return 0

```javascript
const rnum = require('rnum');

rnum(1);
//=> 5

rnum(1);
//=> 6

rnum(1);
//=> 9

rnum(2);
//=> 56

rnum(4);
//=> 9408

rnum(4);
//=> 3004

rnum(6);
//=> 586509

rnum(9);
//=> 965090084

rnum(12);
//=> 109654480023
```

### License
MIT © [Daniel Eckermann](http://danieleckermann.com)