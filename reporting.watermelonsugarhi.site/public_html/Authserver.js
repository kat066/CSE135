const express= require('express');
const app= express();
const session = require('express-session');
const port = 4000;
const passport= require('passport');
const userModel = require('./user');
const LocalStrategy= require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const saltRounds=3;
app.set('view engine', 'ejs');
var validateEmail = function(email){
    var re =/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return re.test(email);
}
// var myUser = [
//     {id:1,username:'admin',password:'admin'},
//     {id:2,username:'admin1',password:'admin1'}
// ]
app.use('/static', express.static('./'));
function findUser(username,func){
    // for(let user of myUser){
    //     if(user.username === username){
    //         return func(null,user);
    //     }
    // }
    // return func(null,null);
    const isEmail=validateEmail(username);
    if(isEmail){
        console.log(username);
        return userModel.findOne({email:username},func);
    }else{
        return userModel.findOne({username:username},func);
    }
}
function checkUser(inPassword, password){
    return bcrypt.compare(inPassword,password);
}

passport.serializeUser(function(user,done){
    done(null,user.username);
})
passport.deserializeUser(function(username,done){
    findUser(username,function(err,user){
        done(err,user);
    })
});
passport.use(new LocalStrategy(
    {usernameField: 'username',
    passwordField:'password',
    passReqToCallback:true},
     function(req,username,password,done) {
        findUser(username,async function(err,user){
            if(err){
                return done(err);
            }
            
            if(!user){
                return done(err,false,{
                    "message":"User/Password does not match"
                });
            }
            var match = await checkUser(password,user.password);
            if(!match){
                return done(err,false,{
                    "message":"User/Password does not match"
                });
            }
            req.session.admin=user.admin;
            return done(null,user);
        });
    }
));
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(session({
    secret:"reporting page",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('login');
}
function checkAdmin(req,res,next){
    if(req.session.admin){
        return next();
    }
    res.redirect('index');
}

app.get('/',checkAuthentication,(req,res)=>{
    var adminbutton="";
    if(req.session.admin){
        adminbutton = "<a href=\"./user\"><button id=\"userPage\">User Management</button></a>";
    }
    res.render("pages/index.ejs",{adminbutton:adminbutton});
})
app.get('/devicereport',checkAuthentication,(req,res)=>{
    res.sendFile('./metricdevice.html',{root:__dirname});
})
app.get('/languagereport',checkAuthentication,(req,res)=>{
    res.sendFile('./metriclanguage.html',{root:__dirname});
})
app.get('/performancereport',checkAuthentication,(req,res)=>{
    res.sendFile('./metricperformance.html',{root:__dirname});
})
app.get('/login',(req,res)=>{
    res.sendFile('./login.html',{root:__dirname});
})
app.post('/login',passport.authenticate('local',
    {successRedirect:"index",failureRedirect:"login"}
));
app.get('/logout',checkAuthentication,(req,res)=>{
    req.logout();
    res.sendFile('./logout.html',{root:__dirname});
})

app.get('/index',checkAuthentication,(req,res)=>{
    var adminbutton="";
    if(req.session.admin){
        adminbutton = "<a href=\"./user\"><button id=\"userPage\">User Management</button></a>";
    }
    res.render("pages/index.ejs",{adminbutton:adminbutton});
})

app.get('/user',checkAdmin,(req,res)=>{
    userModel.find({},function (err, users) {
        res.render("pages/user",{
            users:users
        });
    });

})

app.post('/user',checkAdmin,(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        var  newUser = new userModel({
            username: req.body.username,
            email: req.body.email,
            password:hash,
            admin: req.body.admin,
        
        })
        userModel.findOne({username:req.body.username},function(err,user){
            if(err){
                return res.status(400).send({
                    message: 'Error',
                });
            }
            if(!user){
                newUser.save(function (err,user){
                    if(err){
                        return res.status(400).send({
                            message: 'Invalid Input',
                        });
                    }
                    return res.json({status:"Success",result:user});
                });
            }
            return res.status(400).send({
                message: 'Duplicate Users',
            });

        });
    
    });

})

app.put('/user/:id',checkAdmin,(req,res)=>{
    const isEmail=validateEmail(req.body.email);
    if(!isEmail){
        return res.status(400).send({
            message: 'Invalid Input',
        });
    }else if(req.body.admin.toLowerCase()!="true"&&req.body.admin.toLowerCase()!="false"){
        return res.status(400).send({
            message: 'Invalid Input',
        });
    }
    userModel.findOne({username:req.body.originalUsername},async function(req,err,user){
        if(err){
            error=err;
            console.log(err);
        }else{
            if(req.body.password===user.password){
                userModel.updateOne({username:req.body.originalUsername},{username:req.params.id,email:req.body.email,admin:req.body.admin},function(err,result){
                    if(err){
                        return res.status(400).send({
                            message: 'Invalid Input',
                        });
                    }
                    res.json({status:"Success",result:result});
                });
            }else{
                bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                    userModel.updateOne({username:req.body.originalUsername},{username:req.params.id,email:req.body.email,password:hash,admin:req.body.admin},function(err,result){
                        if(err){
                            return res.status(400).send({
                                message: 'Invalid Input',
                            });
                        }
                        res.json({status:"Success",result:result});
                    });
                })
            }
        }
    }.bind(this,req));
           
})
app.delete('/user/:id',checkAdmin,(req,res)=>{
    userModel.findOneAndDelete({username:req.params.id},function (err, users) {
        console.log(users);
        if(err){
            res.json({status:"failure",reason:err});
        }else{
            res.json(users);
        }
    });

})

app.listen(port,()=>{
    console.log("listening at "+port);
})