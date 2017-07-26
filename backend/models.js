var mongoose = require( 'mongoose' );
mongoose.connect( process.env.MONGODB_URI );

var userSchema = mongoose.Schema( {
    documents: Array,
    username: String,
    password: String,
    firstName: String,
    lastName: String
} );

var documentSchema = mongoose.Schema( {
    title: String,
    password: {
        type: String,
        required: true
    },
    contentState: Array
} );

var User = mongoose.model( 'User', userSchema );
var Document = mongoose.model( 'Document', documentSchema );

module.exports = {
    User: User,
    Document: Document
};
