# map-validator

[![build](https://img.shields.io/travis/moshest/map-validator.svg)](https://travis-ci.org/moshest/map-validator)
[![npm](https://img.shields.io/npm/v/map-validator.svg)](https://npmjs.org/package/map-validator)
[![npm](https://img.shields.io/npm/dm/map-validator.svg)](https://npmjs.org/package/map-validator)
[![npm](https://img.shields.io/npm/l/map-validator.svg)](LICENSE)


An object validator based on [node-validator](https://github.com/chriso/validator.js).
 Heavily inspired by [express-validator](https://github.com/ctavan/express-validator).

## Installation

```
npm install map-validator --save
```

## Usage

```javascript
var MapValidator = require('map-validator');


// our key-value data object
var postBody = {
  name: 'John Doe',
  email: 'John.Doe@Example.com'
  // more data here...
};

// create validator for our object
var validator = new MapValidator(postBody);

// validate object keys
validator.check('name', 'Name is required').notEmpty().isLength(5);
validator.check('email', 'Invalid email').isEmail();
validator.check('age', 'Invalid age').optional().isInt({min: 18, max: 99});

validator.sanitize('email').normalizeEmail();
validator.sanitize('age').toInt();

var errors = validator.verify();
if(errors)
	throw errors;

console.log(postBody);
```

Which will result:

```
{ name: 'John Doe', email: 'john.doe@example.com' }
```

## API

### `instance.verify`
_function(mappedErrors)_

Return all the errors or `null`.

The `mappedErrors` option can be used to return the errors as key-value map or 
as an array (default). On `mappedErrors` mode, if two or more errors occur on the
same key, the first error will be chosen.

errors:

```javascript
[
  {key: "email", error: "required", value: "<received input>"},
  {key: "email", error: "valid email required", value: "<received input>"},
  {key: "password", error: "6 to 20 characters required", value: "<received input>"}
]
```

mappedErrors:

```javascript
{
  email: {
    key: "email",
    error: "required",
    value: "<received input>"
  },
  password: {
    key: "password",
    error: "6 to 20 characters required",
    value: "<received input>"
  }
}
```

### `MapValidator.extend`
_function(name, fn)_

Used to add your own validators:

```javascript
MapValidator.extend('isWhitespace', function(str) {
    return /^\s+$/.test(str);
});
```

### `MapValidator.sanitizerExtend`
_function(name, fn)_

Used to add your own sanitizers:

```javascript
MapValidator.sanitizerExtend('toLowerCase', function(str) {
    return String(str).toLowerCase();
});
```

## License

Copyright &copy; 2015 Moshe Simantov <ms@development.co.il>, 
[MIT License](LICENSE)

