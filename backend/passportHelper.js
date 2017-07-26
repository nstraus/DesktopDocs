var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' );
var User = require( './models' ).User;

function passportHelper( app ){
    passport.serializeUser( function ( user, done ) {
        done( null, user._id );
    } );

    passport.deserializeUser( function ( id, done ) {
        User.findById( id, function ( err, user ) {
            done( err, user );
        } );
    } );

    app.use( passport.initialize() );
    app.use( passport.session() );

  // passport strategy
    passport.use( new LocalStrategy( function ( username, password, done ) {
      // Find the user with the given username
        console.log( "password", password );
        User.findOne( { username: username }, function ( err, user ) {
          // if there's an error, finish trying to authenticate (auth failed)
            if ( err ) {
                //console.log( err );
                return done( err );
            }
          // if no user present, auth failed
            if ( !user ) {
                //console.log( user );
                return done( null, false, { message: 'Incorrect username.' } );
            }
          // if passwords do not match, auth failed
            if ( user.password !== password ) {
                ///console.log( "wrongpassword", user );
                return done( null, false, { message: 'Incorrect password.' } );
            }
            ///console.log( "rightone", user );
          // auth has has succeeded
            return done( null, user );
        } );
    }
  ) );
}

module.exports = {
    passportHelper
};
