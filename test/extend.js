process.env.NODE_ENV = 'test';

var MapValidator = require('../validator');
	
describe('extend', function() {
	var obj = {
    name: 'John Doe',
    email: 'John.Doe@Example.com',
    msg: 'Hello World! '
  };
	
	describe('sanitizers', function() {
    it('should exists', function() {
      Array.isArray(MapValidator.sanitizers).should.be.true;
    });

    it('should be extend', function() {
      MapValidator.validator.should.not.have.property('toLowerCase');
      
      MapValidator.sanitizerExtend('toLowerCase', function(str) {
        return String(str).toLowerCase();
      });
      
      MapValidator.sanitizers.should.containEql('toLowerCase');
      MapValidator.validator.should.have.property('toLowerCase');
      
      var validator = MapValidator(obj);
      
      var orgName = obj.name;
      validator.sanitize('name').toLowerCase();
      
      obj.name.should.be.equal(orgName.toLowerCase());
      obj.name = orgName;
      
      validator.check('name').should.not.have.property('toLowerCase');
    });
  });
  
	describe('validators', function() {
    it('should be extend', function() {
      MapValidator.validator.should.not.have.property('isArray');
      
      MapValidator.extend('isArray', function(str) {
        return Array.isArray(str);
      });
      
      MapValidator.sanitizers.should.not.containEql('isArray');
      MapValidator.validator.should.have.property('isArray');
      
      var validator = MapValidator(obj);
      
      var orgName = obj.name;
      validator.check('name', 'name is not array').isArray();
      
      var errors = validator.verify();
      
      Array.isArray(errors).should.be.true;
      errors.length.should.be.equal(1);
      errors[0].should.be.eql({
        error: 'name is not array',
        key: 'name',
        value: obj.name
      });
      
      validator.sanitize('name').should.not.have.property('isArray');
    });
  });
});