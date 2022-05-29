const req = require('express/lib/request')
const brand = require('../../models/brand')

const brandController = {
    create: async (req, res, next) =>{
        try{
            const brandReq = {
                name: req.body.name
            }
            if(!brandReq.name){
                return res.status(400).json("Enter brand's name")
            }
    
            const newBrand = await brand.create({
                Name: brandReq.name
            })
            return res.status(200).json(newBrand)
        }catch(err){
            return res.status(400).json(err)
        }
    },
    getAllCar:() => {},
    getAll: async (req, res, next) => {
        try{
            const {count, rows} = await brand.findAndCountAll({
                attributes: ["Name"]
            })
            return res.status(200).json({
                Total: count,
                Brands: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    // UPDATION IS NOT SUPPORTED
    detele: async (req, res, next) => {
        try{
            const brandID = req.params.brandid
            if(!brandID){
                return res.status(400).json("error")
            }
            console.log(brandID)
            await brand.destroy({where: {id: brandID}})
            return res.status(200).json("deleted")
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = brandController