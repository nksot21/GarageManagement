const salesReport = require('../../models/salesReport')
const reportDetail = require('../../models/detailedSalesReport')
const repairInfo = require('../../models/repairInfoSheet')
const repairInfoDetail = require('../../models/detailedRepairInfoSheet')
const brand = require('../../models/brand')
const car = require('../../models/car')

const sequelize = require('../../pkg/database/sequelize')

getRepairDetailByBrand = async (month, year) => {
    try{
        const BrandIDs = await brand.findAll({
            attributes: ["id", "Name"]
        })
    
        let repairDetails = []
        await Promise.all(BrandIDs.map(async brandID => {
            console.log("brandid: ", brandID.id)
            let repairList = await repairInfoDetail.findAll({
                attributes: [
                    "id", "Times", "TotalAmount"
                ],
                include: {
                    model: repairInfo,
                    attributes: [],
                    where: {
                        Op: sequelize.where(sequelize.fn('month', sequelize.col('REPAIRINFOSHEET.createdAt')), '=', month),
                        andOp: sequelize.where(sequelize.fn('year', sequelize.col('REPAIRINFOSHEET.createdAt')), '=', year),
                        id: sequelize.col('REPAIRINFOSHEET_DETAIL.RepairInfoSheetID')
                    },
                    include: {
                        model: car,
                        attributes: [],
                        where: {
                            id: sequelize.col('REPAIRINFOSHEET.CarID')
                        },
                        include: {
                            model: brand,
                            attributes: [],
                            where: {
                                id: sequelize.col('CAR.BrandID'),
                                id: brandID.id
                            }
                        }
                    }
                }
            })

            /*let repairList = await repairInfoDetail.findAll({
                include: {
                    model: repairInfo,
                    where: {
                        Op: sequelize.where(sequelize.fn('month', sequelize.col('REPAIRINFOSHEET.createdAt')), '=', month),
                        andOp: sequelize.where(sequelize.fn('year', sequelize.col('REPAIRINFOSHEET.createdAt')), '=', year)
                    }
                }
            })*/
    
            repairDetails.push({
                ID: brandID.id,
                Name: brandID.Name,
                RepairList: repairList
            })
    
        }))
        return repairDetails
    }catch(err){
        return null
    }
}

// repairInfoSheet BY Req.Month, Req.Year
findRepairList = async (month, year) => {
    try{
        const repairInfoDB = await repairInfo.findAll({
            where: {
                Op: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', month),
                andOp: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', year)
            },
            attributes: ["id"]
        })
        return repairInfoDB
    }catch(err){
        return null
    }
}

sumRepairTimes = async (month, year) => {
    try{
        let total = 0
        console.log(0)
        const repairInfoDB = await repairInfo.findAll({
            where: {
                Op: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', month),
                andOp: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', year)
            },
            attributes: ["id"]
        })

        await Promise.all(repairInfoDB.map(async repairID => {
            console.log(repairID.id)
            let detailDB = await repairInfoDetail.findAll({
                attributes: [[sequelize.fn('sum', sequelize.col('Times')), 'TotalTimes']],
                where: {repairInfoSheetID: repairID.id},
                group: ['RepairInfoSheetID']
            })
            console.log(detailDB[0].getDataValue('TotalTimes'))
            total = total + Number(detailDB[0].getDataValue('TotalTimes'))
            
        }))
        return total
    }catch(err){
        return null
    }
}

// tìm phiếu sửa chữa có ngày lập phiếu = month
sumAmount = async (month, year) => {
   // where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', sequelize.fn('date', sequelize.fn('NOW')))
   try{
        const repairInfoDB = await repairInfo.findAll({
            where: {
                    Op: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', month),
                    andOp: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', year)
            },
            attributes: [
                [sequelize.fn('month', sequelize.col('createdAt')), 'Month'],
                [sequelize.fn('year', sequelize.col('createdAt')), 'Year'],
                [sequelize.fn('count', sequelize.col('id')), 'Total'],
                [sequelize.fn('sum', sequelize.col('Amount')), 'TotalAmount']
            ],
            group: ['month', 'year']
        })
        return repairInfoDB
    }catch(err){
        return null
    }
}

/*
responseList.push({
                ID: brandID.id,
                Name: brandID.Name,
                RepairList: repairList "id", "Times", "TotalAmount"
            })
*/

getTotalTimesAndAmount = (repairDetails, totalRepairAmount) => {
    try{
        let salesReportperBrand = []
        repairDetails.map(repairDetail => {
            let totalAmount = 0 
            let totalTimes = 0
            let ratio
            if(repairDetail.RepairList.length == 0){
                totalAmount = 0
                totalTimes = 0
                ratio = 0
            }else{
                repairDetail.RepairList.map(instance => {
                    totalAmount += Number(instance.TotalAmount)
                    totalTimes += Number(instance.Times)
                })
                ratio = Math.round((totalAmount/totalRepairAmount) * 100) / 100
            }
            
            // Total Amount, Total Times
            salesReportperBrand.push({
                BrandID: repairDetail.ID,
                Name: repairDetail.Name,
                TotalAmount: totalAmount,
                TotalTimes: totalTimes,
                Ratio: ratio,
            })
        })
        return salesReportperBrand
    }catch(err){
        return null
    }
}


const salesReportController = {
    // [POST]: /salesreport {"month", "year"}
    getbyMonth: async (req, res, next) => {
        try{
            const monthYearReq = {
                month: req.body.month,
                year: req.body.year
            }
            //const repairIDList = await findRepairList(monthYearReq.month, monthYearReq.year)

            let totalTimes = await sumRepairTimes(monthYearReq.month, monthYearReq.year)
            let totalRepairAmount = await sumAmount(monthYearReq.month, monthYearReq.year)

            let totalRepairAmountValue = Number(totalRepairAmount[0].getDataValue("TotalAmount"))
            let repairDetails = await getRepairDetailByBrand(monthYearReq.month, monthYearReq.year)
            let totalTimesAndAmount = getTotalTimesAndAmount(repairDetails, totalRepairAmountValue)

            const salesRepostRes = {
                Month: totalRepairAmount[0].getDataValue('Month'),
                Year: totalRepairAmount[0].getDataValue('Year'),
                TotalAmount: totalRepairAmountValue,
                Detail: totalTimesAndAmount
            }
            return res.status(200).json(salesRepostRes)
        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = salesReportController