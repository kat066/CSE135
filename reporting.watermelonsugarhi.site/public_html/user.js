const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 3;
mongoose.connect('mongodb://localhost/users',{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
var validateEmail = function(email){
    var re =/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return re.test(email);
}
const User = new Schema({
    username:{
        type:String,
        unique: true
    },
    email:{
        type:String,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password:String,
    admin: Boolean
});

User.plugin(passportLocalMongoose);
const userModel = mongoose.model('AuthenticatedUser',User);
bcrypt.hash("cse135", saltRounds).then(function(hash) {
    var  user1 = new userModel({
        username: "grader",
        email: "grader@ucsd.edu",
        password: hash,
        admin: 0,
    
    })
    userModel.findOne({username:"grader"},function(err,user){
        if(err){
            done(err);
        }
        if(!user){
            user1.save(function (err,user){
                if(err){
                    return console.error(err);
                }
                console.log(user.username + " saved to userModel collection");
            });
        }
    });

});
bcrypt.hash("cse135", saltRounds).then(function(hash) {
    var  user2 = new userModel({
        username: "admingrader",
        email:"admingrader@ucsd.edu",
        password: hash,
        admin: 1,
    
    })
    userModel.findOne({username:"admingrader"},function(err,user){
        if(err){
            done(err);
        }
        if(!user){
            user2.save(function (err,user){
                if(err){
                    return console.error(err);
                }
                console.log(user.username + " saved to userModel collection");
            });
        }
    });
});




module.exports=userModel;



