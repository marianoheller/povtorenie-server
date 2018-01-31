var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
 
var User = require('../../models/User');
 

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



describe('User model createUser static method', function(done) {

    beforeEach(function() {

    });
 
    afterEach(function() {
        
    });

    it('createUser should create an user correctly', function() {
        sinon.stub(User, 'create').resolves( {} );
        const callback= sinon.spy();

        return User.createUser("", "", "", callback )
        .then( () => {
            expect(callback).to.have.been.called;
            expect(callback).to.have.been.calledWith(null);

            User.create.restore();
        } )
    });

    it('createUser should handle errors correctly', function() {
        sinon.stub(User, 'create').rejects( {} );
        const callback= sinon.spy();

        return User.createUser( "", "", "", callback )
        .then( () => {
            expect(callback).to.have.been.called;
            expect(callback).to.have.been.calledWith( {}, null );

            User.create.restore();
        } )
    });
});