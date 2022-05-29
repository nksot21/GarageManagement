const parameterModel = require('../../models/parameters')


// GET PARAMETER LASTEST VALUE
getParamDB = async () =>{
    try{
        const paramDB = await parameterModel.findAll({
            limit: 1,
            order: [ [ 'createdAt', 'DESC'] ]
        })
        if(!paramDB){
            return null
        }
        return paramDB[0]
    }catch(err){
        return err
    }
}

const parameterController = {
    create: async (req, res, next) => {
        try{
            const paramReq = {
                carReceivedperDay: req.body.carReceivedperDay,
                saleRatio: req.body.saleRatio
            }

            // ktra dieu kien ...

            let newParam = await parameterModel.create({
                carReceivedperDay: paramReq.carReceivedperDay,
                SaleRatio: paramReq.saleRatio
            })

            return res.status(200).json(newParam)

        }catch(err){
            return res.status(400).json(err)
        }
    },

    get: async (req, res, next) =>{
        // tim recode moi nhat
        try{
            const ParameterRes = await getParamDB()
            return res.status(200).json({
                carReceivedperDay: ParameterRes.CarReceivedperDay,
                saleRatio: ParameterRes.SaleRatio
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    updateCarReceivedperDay: async (req, res, next) => {
        try{
            const paramReq = {
                carReceivedperDay: req.body.carReceivedperDay,
            }
            
            if(!paramReq.carReceivedperDay){
                return res.status(400).json("Enter new carReceivedperDay")
            }

            let paramDB = await getParamDB()
            let newParam = {
                carReceivedperDay: paramReq.carReceivedperDay
            }
            await paramDB.update({
                CarReceivedperDay: newParam.carReceivedperDay
            })
            return res.status(200).json("updated")
        }catch(err){
            return res.status(400).json(err)
        }
    },

    updateSaleRatio: async (req, res, next) =>{
        try{
            const paramReq = {
                saleRatio: req.body.saleRatio,
            }
            
            if(!paramReq.saleRatio){
                return res.status(400).json("Enter new saleRatio")
            }

            let paramDB = await getParamDB()
            let newParam = {
                saleRatio: paramReq.saleRatio
            }
            await paramDB.update({
                SaleRatio: newParam.saleRatio
            })
            return res.status(200).json("updated")
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = parameterController