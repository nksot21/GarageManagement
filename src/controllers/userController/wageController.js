const wage = require('../../models/wage')

const wageController = {
    create: async (req, res, next) => {
        try{
            const wageReq = {
                name: req.body.name,
                value: req.body.value
            }
    
            if(!wageReq.name || !wageReq.value ){
                return res.status(400).json("Enter name or value")
            }
    
            const newWage = await wage.create({
                Name: wageReq.name,
                Value: wageReq.value
            })
            return res.status(200).json("inserted")
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) => {
        try{
            const {count, rows} = await wage.findAndCountAll({
                attributes: ["Name", "Value"]
            })
            return res.status(200).json({
                Total: count,
                Wage: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    delete: async (req, res, next) => {
        try{
            const wageID = req.params.wageid
            if(!wageID){
                return res.status(400).json("error")
            }
            await wage.destroy({where: {id: wageID}})
            return res.status(200).json("deleted")
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = wageController