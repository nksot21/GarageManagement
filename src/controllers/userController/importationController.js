const importation = require('../../models/accessoriesImportation')
const importationDetail = require('../../models/detailedAccessoriesImportation')
const accessories = require('../../models/accessories')

// UPDATE ACCESSORIES.UNITPRICE = IMPORTATION.UNITPRICE * PARAMS.SALERATIO
const importationController = {
    create: async (req, res, next) =>{
        try{
            // CREATE IMPORTATION
            const importationReq = {
                // GỒM NHIỀU ACCESSORIES 
                accessories: req.body.accessories
            }

            const newImportation = await importation.create()
            const importationID = newImportation.id

            await Promise.all(importationReq.accessories.map(async accessory => {
                try{
                    // CREATE IMPORTATION DETAIL
                const amount = accessory.quantity * accessory.unitPrice
                const newImportationDetail = await importationDetail.create({
                    AccessoriesID: accessory.accessoriesID,
                    Quantity: accessory.quantity,
                    UnitPrice: accessory.unitPrice,
                    AccessoriesImportationID: importationID,
                    Amount: amount
                })

                // UPDATE ACCESSORIES.QUANTITY
                const accessoriesDB = await accessories.findByPk(accessory.accessoriesID,{
                    attributes: ["id"]
                })
                await accessoriesDB.increment("Quantity", {by: accessory.quantity})
                }catch(err){
                    return res.status(400).json(err)
                }
            }))

            return res.status(200).json("inserted")

        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) => { 
        try{
            const {count, rows} = await importation.findAndCountAll({
                attributes: ["id", "TotalAmount", "Date"]
            })
    
            let importationRes = {
                Total: count,
                Importation: []
            }
            
            await Promise.all(rows.map(async importationDB => {
                try{
                    let importationDetailList = await importationDetail.findAll({
                        where: {AccessoriesImportationID: importationDB.id},
                        attributes: ["AccessoriesID", "Quantity", "UnitPrice", "Amount"],
                        include: [{model: accessories, attributes: ["Name"]}]
                    })
    
                    importationRes.Importation.push({
                        ID: importationDB.id,
                        TotalAmount: importationDB.TotalAmount,
                        Date: importationDB.Date,
                        Detail: importationDetailList
                    })
                }catch(err){
                    return res.status(400).json(err)
                }
            }))
            
            return res.status(200).json(importationRes)
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = importationController