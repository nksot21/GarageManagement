const accessoryType = require('../../models/accessoriesType')

const accessoryTypeController = {
    create: async (req, res, next) => {
        try{
            const accessoryTypeReq = {
                name: req.body.name
            }
            if(!accessoryTypeReq.name){
                return res.status(400).json("Enter accessory Type")
            }
            const newType = await accessoryType.create({
                Name: accessoryTypeReq.name
            })
            return res.status(200).json("inserted")
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) => {
        try{
            const {count, rows} = accessoryType.findAndCountAll({
                attributes: ["Name"]
            })
            return res.status(200).json({
                Total: count,
                AccessoryTypes: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    delete: async (req, res, next) => {
        try{
            const accessoryTypeID = req.params.accessorytypeid 
            if(!accessoryTypeID){
                return res.status(400).json("error")
            }
            await accessoryType.destroy({where: {id: accessoryTypeID}})
            return res.status(200).json("deleted")
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = accessoryTypeController