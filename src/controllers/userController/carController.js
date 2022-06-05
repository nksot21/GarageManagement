const car = require('../../models/car')
const customer = require('../../models/customer')
const brand = require('../../models/brand')

const carController = {
    getAll: async (req, res, next) => {
        try{
            const {count, rows} = await car.findAndCountAll({
                attributes: ["LicensePlate", "Debt", "CustomerID", "BrandID"],
                include: [{
                    model: customer,
                    attributes:["Name"]
                },{
                    model: brand,
                    attributes:["Name"]
                }]
            })
            return res.status(200).json({
                Total: count,
                Cars: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getByLicense: async (req, res, next) =>{
        try{
            const licenseReq = req.body.license

            const carDB = await car.findOne({
                attributes: ["LicensePlate", "Debt", "CustomerID", "BrandID"],
                include: [{
                    model: customer,
                    attributes:["Name"]
                },{
                    model: brand,
                    attributes:["Name"]
                }],
                where:{LicensePlate: licenseReq}
            })

            return res.status(200).json(carDB)
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = carController