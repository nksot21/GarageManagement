const { user, password } = require('pg/lib/defaults');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10;
//const jane = await userModel.create({ name: "Jane" });
// Jane exists in the database now!

//console.log(jane instanceof User); // true
//console.log(jane.name); // "Jane"

//CHECK USER BY EMAIL
/*async function isUserExisted(emailReq) {
    var user = await User.findOne({where:{email:emailReq}})
    console.log("userrrr ", user)
    if (user){  
        return user
    }
    else
        return null
}*/

const userController = {
    createUser: async (req, res, next) => {
        try{
            var userReq = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            //var user =  isUserExisted(userReq.email)

            if( !userReq.username || !userReq.email || !userReq.password){
                req.json("fill in username or email or password")
            }

            //CHECK USER EXIST
            var user = await User.findOne({where:{email:userReq.email}})
            if (user){
                res.json("Email existed")
                return
            }

            bcrypt.hash(userReq.password, saltRounds, async function(err, hash){
                if (err){
                    res.json("bcypt err")
                }
                var newUser = await User.create({
                    username: userReq.username,
                    email: userReq.email,
                    password: hash
                })
                res.json(newUser.toJSON())
            })
        }catch(err){
            console.log(err)
        }
    },
    signin: async (req, res, next) => {
        try{
            var signInInfo = {
                email: req.body.email,
                password: req.body.password
            }

            if (!signInInfo.email || !signInInfo.password){
                res.json("fill in email or password")
            }

            // FIND USER BY EMAIL
            var userDB = await User.findOne({where:{email:signInInfo.email}})
            if (!userDB){
                res.json("User does not existed")
                return
            }

            bcrypt.compare(signInInfo.password, userDB.password)
            .then(function(result){
                if(!result){
                    res.json("wrong password")
                    return
                }else{
                    console.log(process.env.PRIVATE_KEY)
                    const token = jwt.sign(
                      {email: userDB.email, username: userDB.username},
                      process.env.PRIVATE_KEY,
                      {expiresIn: "1h"}
                    )
                    res.status(200).json({
                        message: "You are in",
                        UserInfo:{
                            username: userDB.username,
                            email: userDB.email,
                        },
                        token: token
                    })
                }
            })
        }catch(err){
            res.json(err)
        }
    },
    getUsers: async (req, res, next) => {
        try{
            var users = await User.findAll()
            res.json(users)
        }catch(err) {
            console.log(err)
        }
    },

    getUsersByName: async (req, res, next) => {
        try{
            var usernameReq = req.body.username
            if (!usernameReq){
                res.json("fill in username")
            }
            var users = await User.findAll({where:{username: usernameReq}})
            if (users === null){
                console.log("User not found!")
            }else{
                console.log("kore")
                res.json(users)
            }
        }
        catch(err){
            res.json("error")
        }
    }
}

/*async function create(){
    try{
        await sequelize.sync();
         const jane = await User.create({
      username: 'janedoe',
      birthday: new Date(1980, 6, 20)
    });
    console.log(jane.toJSON());
    }catch{
        console.log("error")
    }
};
create();*/

module.exports = userController