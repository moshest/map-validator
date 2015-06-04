process.env.NODE_ENV = 'test';

var MapValidator = require('../validator');
	
describe('trivial', function() {
	var obj = {
    name: 'John Doe',
    email: 'John.Doe@Example.com',
    msg: 'Hello World! '
  };
	
	describe('constructor', function() {
    it('should create', function() {
      var validator = new MapValidator(obj);
      validator.should.be.instanceof(MapValidator);
    });

    it('should create without new', function() {
      var validator = MapValidator(obj);
      validator.should.be.instanceof(MapValidator);
    });
  });
	
	describe('#check(parm, error)', function() {
    var validator;
    
    beforeEach(function() {
      validator = MapValidator(obj);
    });
    
    it('should pass isEmail', function() {
      validator.check('email', 'Invaild email').isEmail();
      var errors = validator.verify();
      
      (errors === null).should.be.true;
    });
    
    it('should failed isEmail', function() {
      validator.check('name', 'Invaild email').isEmail();
      var errors = validator.verify();
      
      Array.isArray(errors).should.be.true;
      errors.length.should.be.equal(1);
      errors[0].should.be.eql({
        error: 'Invaild email',
        key: 'name',
        value: obj.name
      });
    });
    
    it('should pass nested validators', function() {
      validator.check('email', 'Invaild email').isEmail().isLength(5);
      var errors = validator.verify();
      
      (errors === null).should.be.true;
    });
    
    it('should failed nested validators', function() {
      validator.check('name', 'Invaild email').isEmail().isLength(100);
      var errors = validator.verify();
      
      Array.isArray(errors).should.be.true;
      errors.length.should.be.equal(1);
      
      errors[0].should.be.eql({
        error: 'Invaild email',
        key: 'name',
        value: obj.name
      });
      
      var mappedErrors = validator.verify(true);
      mappedErrors.name.should.be.equal(errors[0]);
    });
    
    it('should pass multipate validators', function() {
      validator.check('name', 'Invaild name').isLength(5);
      validator.check('email', 'Invaild email').isEmail();
      var errors = validator.verify();
      
      (errors === null).should.be.true;
    });
    
    it('should failed multipate validators', function() {
      validator.check('name', 'Invaild name').isLength(100);
      validator.check('email', 'Invaild email').isLength(100);
      var errors = validator.verify();
      
      Array.isArray(errors).should.be.true;
      errors.length.should.be.equal(2);
      
      errors[0].should.be.eql({
        error: 'Invaild name',
        key: 'name',
        value: obj.name
      });
      
      errors[1].should.be.eql({
        error: 'Invaild email',
        key: 'email',
        value: obj.email
      });
      
      var mappedErrors = validator.verify(true);
      mappedErrors.name.should.be.equal(errors[0]);
      mappedErrors.email.should.be.equal(errors[1]);
    });
  });
	
	describe('#sanitize(parm)', function() {
    var validator;
    
    before(function() {
      validator = MapValidator(obj);
    });
    
    it('should sanitize email', function() {
      var originEmail = obj.email;
      
      validator.sanitize('email').normalizeEmail();
      var errors = validator.verify();
      
      (errors === null).should.be.true;
      obj.email.should.be.equal(MapValidator.validator.normalizeEmail(originEmail));
      
      obj.email = originEmail;
    });
    
    it('should sanitize nested', function() {
      var originMsg = obj.msg;
      
      validator.sanitize('msg').trim().blacklist('!');
      
      obj.msg.should.be.equal(originMsg.trim().replace('!', ''));
      
      obj.msg = originMsg;
    });
  });
});