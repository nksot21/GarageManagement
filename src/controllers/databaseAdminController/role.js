const user = require('../../models/user')


const databaseAdminController = {
    //UPDATE ROLE BY USERID
    //@route [update]
    updateRole: async (req, res, next) =>{
        try{
            let userID = req.params.userid
            let newPermission = req.body.permission
            //CHECK NEW PERMISSION VALID : [0, 1, 2]
            // code ngu qua =))))) ktra lai nha
            if (newPermission != 0 && newPermission != 1 && newPermission != 2){
                res.status(400).json("Permission is not valid")
            }

            console.log("UserID: ", userID);
    
            // FIND USER BY ID
            let userDB = await user.findByPk(userID)
            console.log(userDB)
            if(!userDB){
                res.status(400).json("Find User By ID Error")
            }

            // UPDATE USER PERMISSTION
            await userDB.update({Permission: newPermission})

            res.status(200).json("success")

        }catch(err){
            res.status(400).json(err)
        }
    }
}

module.exports = databaseAdminController