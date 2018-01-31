var expect = require('chai').expect;
var sinon = require('sinon');
 
var User = require('../../models/User');
/* 
const userSchema = new Schema({
    displayName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    googleID: String,
    admin: { type: Boolean, default: false },
    words: [{ word: String, date: Date }]
  }); */
 

describe('User model fields', function(done) {
    it('should be invalid if displayName is empty', function(done) {
        const user = new User({
            username: "asd",
            password: "asddq"
        });
 
        user.validate(function(err) {
            expect(err.errors.displayName).to.exist;
            done();
        });
    });
    it('should be invalid if username is empty', function(done) {
        const user = new User({
            displayName: "asd",
            password: "asddq"
        });
 
        user.validate(function(err) {
            expect(err.errors.username).to.exist;
            done();
        });
    });
    it('should be invalid if password is empty', function(done) {
        const user = new User({
            username: "asd",
            displayName: "asddq"
        });
 
        user.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
    it('should be valid if optional fields arent included', function(done) {
        const user = new User({
            username: "asd",
            password: "asd",
            displayName: "asddq"
        });
 
        user.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});


describe('User model static methods', function(done) {
    beforeEach(function() {
        sinon.stub(User, 'find');
    });
 
    afterEach(function() {
        User.find.restore();
    });

    it('should create an user correctly', function() {
        var inputData = { 
            googleID: 'asdasdasdasda',
            lastName: 'lastName',
            firstName: 'firstName'
        };
        var expectedModels = [a, b];
        Meme.find.yields(null, expectedModels);
        var req = { params: { } };
        var res = {
            send: sinon.stub()
        };
 
        routes.allMemes(req, res);
 
        sinon.assert.calledWith(res.send, expectedModels);
    });
});