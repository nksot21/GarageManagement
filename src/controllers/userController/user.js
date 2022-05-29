const { user, password } = require('pg/lib/defaults');
const User = require('../../models/user');
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
            var userReq = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
            //var user =  isUserExisted(userReq.email)

            if( !userReq.username || !userReq.email || !userReq.password){
                return res.json("fill in username or email or password")
            }

            //CHECK USER EXIST
            var user = await User.findOne({where:{Email:userReq.email}})
            if (user){
                return res.json("Email existed")
            }

            bcrypt.hash(userReq.password, saltRounds, async function(err, hash){
                if (err){
                    return res.json("bcypt err")
                }
                let newUser = await User.create({
                    Username: userReq.username,
                    Email: userReq.email,
                    Password: hash
                })
                return res.status(200).json(newUser.toJSON())
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },
    signin: async (req, res, next) => {
        try{
            var signInInfo = {
                email: req.body.email,
                password: req.body.password
            }

            if (!signInInfo.email || !signInInfo.password){
                return res.status(400).json("fill in email or password")
            }

            // FIND USER BY EMAIL
            var userDB = await User.findOne({where:{Email:signInInfo.email}})
            if (!userDB){
                return res.status(400).json("User does not existed")
            }

            bcrypt.compare(signInInfo.password, userDB.Password)
            .then(function(result){
                if(!result){
                    return res.status(400).json("wrong password")
                }else{
                    console.log(process.env.PRIVATE_KEY)
                    const token = jwt.sign(
                      {email: userDB.Email, password: userDB.Password},
                      process.env.PRIVATE_KEY,
                      {expiresIn: "1h"}
                    )
                    return res.status(200).json({
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
            return res.status(400).json(err)
        }
    },
    getUsers: async (req, res, next) => {
        try{
            var users = await User.findAll()
            return res.status(200).json(users)
        }catch(err) {
            return res.status(400).json(err)
        }
    },

    getUsersByName: async (req, res, next) => {
        try{
            var usernameReq = req.body.username
            if (!usernameReq){
                return res.status(400).json("fill in username")
            }
            var users = await User.findAll({where:{Username: usernameReq}})
            if (!users)
               return res.status(400).json("user not found")

            return res.status(200).json(users)
        }
        catch(err){
            return res.status(400).json("error")
        }
    }
}

module.exports = userController