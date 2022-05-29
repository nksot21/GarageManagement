const jwt = require('jsonwebtoken')

const authen = (req, res, next) => {
    try{
        console.log(req.headers.authorization)
        if(req.headers.authorization){
            const decoded = jwt.verify(
                req.headers.authorization,
                process.env.PRIVATE_KEY
            );
            console.log("authen")
            next()
        }
        else{
            res.json("token error")
        }
    }catch(err){
        res.status(505).json(err)
    }
};

module.exports = authen