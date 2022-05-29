const jwt = require('jsonwebtoken')
const user = require('../../models/user')

const isManagePermission = async (req, res, next) => {
    try{
        if(req.headers.authorization){
            const decoded = jwt.verify(
                req.headers.authorization,
                process.env.PRIVATE_KEY
            );

            // FIND USER BY EMAIL
            let userDB = await user.findOne({where:{Email:decoded.email}})
            if(!userDB){
                res.status(200).json("You are not allowed!!!")
            }

            // CHECK USER PERMISSION
            console.log(userDB.Permission)
            if(userDB.Permission != 0 && userDB.Permission != 1){
                res.status(400).json("You are not allowed!!!")
            }else{
                next()
            }
        }else{
            res.status(400).json("Authorization is required.")
        }
    }catch(err){
        res.status(400).json("err")
    }
}

module.exports = isManagePermission