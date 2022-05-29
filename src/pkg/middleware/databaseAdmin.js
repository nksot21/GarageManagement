// CHECK PERMISSION OF DATABASE ADMIN
const jwt = require('jsonwebtoken')
const user = require('../../models/user')

const isDatabaseAdminPermission = async (req, res, next) => {
    try{    
        if(req.headers.authorization){
            // DECODED INFO: email + passwords
            const decoded = jwt.verify(
                req.headers.authorization,
                process.env.PRIVATE_KEY
            );
            console.log("Decoded: ", decoded.email)

            //FIND USER BY EMAIL
            let userDB = await user.findOne({where:{Email:decoded.email}})
            if (!userDB){
                res.status(400).json("You are not allowed!!!")
            }

            //CHECK USER PERMISSION
            console.log(userDB.Permission)
            if(userDB.Permission != 0){
                res.status(400).json("You are not allowed!!!")
            }else{
                next()
            }

        }else{
            res.status(400).json("Authorization is required.")
        }
    }catch(err){
        res.status(400).json("You are not allowed!!!")
    }   
}

module.exports = isDatabaseAdminPermission