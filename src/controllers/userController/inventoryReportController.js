const inventoryReport = require('../../models/inventoryReport')
const accessories = require('../../models/accessories')
const accessoriesDetail = require('../../models/detailedAccessories')
const importationDetail = require('../../models/detailedAccessoriesImportation')
const sequelize = require('../../pkg/database/sequelize')


getArisingQuantity = async (month, year) => {
    try{
        const accessoriesDB = await accessories.findAll({
            attributes: ["id", "Name"]
        })

        let accessoriesQuantity = []

        console.log(month, "     ", year)
        await Promise.all(accessoriesDB.map(async accessory => {
            console.log("accessoriesID: ", accessory.id)

            //GET USED QUANTITY
            let accessoriesDetailDB = await accessoriesDetail.findAll({
                attributes: [ 
                    [sequelize.fn('sum', sequelize.col('Quantity')), 'TotalUsedQuantity'] 
                ],
                group: ["ACCESSORIES_DETAIL.AccessoriesID"],
                where: {
                    Op: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', month),
                    andOp: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', year),
                    AccessoriesID: accessory.id
                }
            })
            let totalUsedQuantity
            if (!accessoriesDetailDB[0]){
                totalUsedQuantity = 0
            }else{
                totalUsedQuantity = Number(accessoriesDetailDB[0].getDataValue('TotalUsedQuantity'))
            }

            // GET IMPORTED QUANTITY
            let importationDetailDB = await importationDetail.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('Quantity')), 'TotalImportedQuantity']
                ],
                group: ['ACCESSORIESIMPORTATION_DETAIL.AccessoriesID'],
                where:{
                    Op: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', month),
                    andOp: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', year),
                    AccessoriesID: accessory.id
                }
            })

            let totalImportedQuantity
            if (!importationDetailDB[0]){
                totalImportedQuantity = 0
            }else{
                totalImportedQuantity = Number(importationDetailDB[0].getDataValue('TotalImportedQuantity'))
            }

            accessoriesQuantity.push({
                AccessoriesID: accessory.id,
                Accessories: accessory.Name,
                TotalUsedQuantity: totalUsedQuantity,
                TotalImportedQuantity: totalImportedQuantity
            })
        }))
        console.log(accessoriesQuantity)
        return accessoriesQuantity
    }catch(err){
        return null
    }
}

const inventoryReportController = {
    create: async (req, res, next) => {
        try{
            const inventoryReportReq = {
                month: req.body.month,
                year: req.body.year,
                initialQuantity: req.body.initialQuantity, // array
            }

            // tính tổng số lượng đã sử dụng
            // tính tổng số lượng đã nhập trong tháng
            // số phát sinh

            if(!inventoryReportReq.month || !inventoryReportReq.year || !inventoryReportReq.initialQuantity){
                return res.status(400).json("dataError")
            }
            //CHECK EXISTED
            const reportDB = await inventoryReport.findOne({
                where:{
                    Month: inventoryReportReq.month,
                    Year: inventoryReportReq.year
                }
            })
            if(reportDB){
                return res.status(400).json("existed")
            }


            //CREATE
            let usedQuantity = await getArisingQuantity(inventoryReportReq.month, inventoryReportReq.year)
            
            let Name = []
            let createValues = usedQuantity.map((value, i) => {
                let arisingQuantity = value.TotalImportedQuantity - value.TotalUsedQuantity
                let finalQuantity = Number(inventoryReportReq.initialQuantity[i]) + Number(arisingQuantity)
                Name.push(value.Accessories)
                return {
                    Month: inventoryReportReq.month,
                    Year: inventoryReportReq.year,
                    AccessoriesID: value.AccessoriesID,
                    InitialQuantity: inventoryReportReq.initialQuantity[i],
                    UsedQuantity: value.TotalUsedQuantity,
                    ImportedQuantity: value.TotalImportedQuantity,
                    Arising: arisingQuantity,
                    FinalQuantity: finalQuantity
                }
            })
            let newReport = await inventoryReport.bulkCreate(createValues)
            return res.status(200).json({
                Name: Name,
                Reports: createValues
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getByMonth: async (req, res, next) => {
        try{
            const reportReq = {
                month: req.body.month,
                year: req.body.year
            }
    
            const reportDB = await inventoryReport.findAll({
                attributes:["AccessoriesID", "InitialQuantity", "ImportedQuantity", "UsedQuantity", "Arising", "FinalQuantity"],
                where:{
                    Month: reportReq.month,
                    Year: reportReq.year
                },
                include:{
                    model: accessories,
                    attributes: ["Name"],
                    where:{ id: sequelize.col('INVENTORYREPORT.AccessoriesID')}
                }
            })
    
            return res.status(200).json({
                Year: reportReq.year,
                Month: reportReq.month,
                Accessories: reportDB
            })
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = inventoryReportController