var validator = require('validator');

module.exports = exports = function(obj) {
   if (!(this instanceof exports))
        return new exports(obj);

  this.obj = obj;
  this.errors = [];
};
exports.validator = validator;
var proto = exports.prototype;


/*** static vars ***/

exports.sanitizers = [
  'blacklist', 'escape', 'ltrim', 'normalizeEmail', 'rtrim', 
  'stripLow', 'toBoolean', 'toDate', 'toFloat', 'toInt', 'toString', 
  'trim', 'whitelist'
];


/*** static functions ***/

exports.extend = function(name, fn) {
  return exports.validator.extend(name, fn);
};

exports.sanitizerExtend = function(name, fn) {
  exports.sanitizers.push(name);
  return exports.validator.extend(name, fn);
};

exports.addSanitizers = function(sanitizers) {
  if(Array.isArray(sanitizers))
    exports.sanitizers.push.apply(exports.sanitizers, sanitizers);
  else
    exports.sanitizers.push(sanitizers);
  
  return exports.sanitizers;
};


/*** public methods ***/

proto.check = function(key, error) {
  var value = this._getPointer(key);
  if(value) value = value.value;
  if(!error) error = 'Validation Error!';
  
  var self = this;
  var checker = {};
  var noopChecker = {};
  
  Object.keys(exports.validator).forEach(function(method) {
    checker[method] = function() {
      Array.prototype.unshift.call(arguments, value);
      
      if(exports.validator[method].apply(exports.validator, arguments))
        return checker;
      
      self.errors.push({
        error: error,
        key: key,
        value: value
      });
      
      return noopChecker;
    };
  });
  
  delete checker.extend;
  
  for(var i in exports.sanitizers)
    delete checker[exports.sanitizers[i]];
  
  Object.keys(checker).forEach(function(method) {
    noopChecker[method] = function() {
      return noopChecker;
    };
  });
  
  checker.optional = function() {
      if(value !== undefined && value !== '' && value !== null) {
        return checker;
      }
      
      return noopChecker;
  };
    
  return checker;
};

proto.sanitize = function(key) {
  var pos = this._getPointer(key);
  
  var sanitizer = {};
  
  exports.sanitizers.forEach(function(method) {
    sanitizer[method] = function() {
      if(pos) {
        Array.prototype.unshift.call(arguments, pos.pointer[pos.key]);
        pos.pointer[pos.key] = exports.validator[method]
                                .apply(exports.validator, arguments);
      }
      
      return sanitizer;
    };
  });
    
  return sanitizer;
};

proto.validationErrors = 
proto.verify = function(mappedErrors) {
  if(!this.errors.length)
    return null;
  
  if(!mappedErrors)
    return this.errors;
  
  var map = {}, error;
  for(var i in this.errors) {
    error = this.errors[i];
    if(map[error.key]) continue;
    
    map[error.key] = error;
  }
  
  return map;
};



/*** protected methods ***/


proto._getPointer = function(key) {
  if(!Array.isArray(key))
    key = [key];
  
  var ret = {
    value: this.obj
  };
  
  for(var i = 0; i < key.length; i++) {
    if(!ret.value)
      return;
    
    ret.pointer = ret.value;
    ret.key = key[i];
    ret.value = ret.pointer[ret.key];
  }
  
  return ret;
};