const accessories = require('../../models/accessories')
const accessoriesType = require('../../models/accessoriesType')

const accessoriesController = {
    create: async (req, res, next) => {
        try{
            const accessoriesReq =  {
                name: req.body.name,
                unitPrice: req.body.unitPrice,
                typeID: req.body.typeID
            }
            if(!accessoriesReq.name || !accessoriesReq.unitPrice){
                return res.status(400).json("Enter name or unit price or type")
            }
            const newAccessories = await accessories.create({
                Name: accessoriesReq.name,
                UnitPrice: accessoriesReq.unitPrice,
                AccessoriesTypeID: accessoriesReq.typeID
            })

            return res.status(200).json("inserted")
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) => {
        try{
            const {count, rows} = await accessories.findAndCountAll({
                attributes: ["Name", "UnitPrice", "Quantity"],
                include: {model: accessoriesType, attributes: ["Name"]}
            })
            return res.status(200).json({
                Total: count,
                Accessories: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    delete: async (req, res, next) => {
        try{
            const accessoriesID = req.params.id
            if(!accessoriesID){
                return res.status(400).json("URL error")
            }
            await accessories.destroy({where: {id: accessoriesID}})
            return res.status(200).json("deleted")
        }catch(err){
            return res.status(400).json(err)
        }
    }

}

module.exports = accessoriesController