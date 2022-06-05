const repairInfoSheet = require('../../models/repairInfoSheet')
const repairInfoSheetDetail = require('../../models/detailedRepairInfoSheet')
const accessoriesDetail = require('../../models/detailedAccessories')
const accessories = require('../../models/accessories')
const car = require('../../models/car')
const wage = require('../../models/wage')
const customer = require('../../models/car')


// kiem tra ton tai phieu tiep nhan truoc khi tao phieu sua chua
// tao phieu sua chua tu thong tin phieu tiep nhan
// nguoi dung get list phieu tiep nhan
// tao phieu sua chua tu phieu tiep nhan da chon
// REPAIRINFOSHEET => REPAIRINFOSHEET_DETAIL => ACCESSORIES_DETAIL

// MỖI PHIẾU SỬA CHỮA CÓ 1 CHI TIẾT PHIẾU SỮA CHỮA HAY CÓ NHIỀU CT PHIẾU SỬA CHỮA


// GET UNIT PRICE from DB

// UPDATE DEBT = DEBT + REPAIRINFOSHEET.AMOUNT

// quantity trong Accessories -= repairInfoSheet
const repairInfoSheetController = {
    create: async (req, res, next) => {
        try{
            const repairInfoReq = {
                licensePlate: req.body.licensePlate,
                date: req.body.date, 
                content: req.body.content, // array
                // mang cac object {"accessoriesID" + "quantity" + "unitPrice"}
                accessories: req.body.accessories, // array
                wage: req.body.wage, // array
                times: req.body.times // array
            }

            console.log(repairInfoReq)
            //FIND CAR
            const carDB = await car.findOne({
                where: {LicensePlate: repairInfoReq.licensePlate}
            })
            if(!carDB){
                return res.status(400).json({Error: 1})
            }

            // CREATE REPAIR INFO SHEET
            const newRepair = await repairInfoSheet.create({
                CarID: carDB.id,
            })

            const newRepairID = newRepair.id

            // CREATE REPAIR INFO SHEET _ DETAIL
            let updateRepairAmount = 0
            for(let i=0; i<repairInfoReq.accessories.length; i++){

                console.log(repairInfoReq.accessories[i].name)
                let accessoriesDB = await accessories.findOne(
                    { where: {Name: repairInfoReq.accessories[i].name}}
                )
                // CHECK VALID QUANTITY
                let newQuantity = accessoriesDB.Quantity - repairInfoReq.accessories[i].quantity
                if(newQuantity < 0){
                    return res.status(400).json("not enough Quantity")
                }
                // UPDATE QUANTITY IN ACCESSORIES.
                await accessoriesDB.update({Quantity: newQuantity })

                //GET WAGE
                const wageDB = await wage.findOne({
                    where:{Name: repairInfoReq.wage},
                    attributes:["id"]
                })

                // CREATE ACCESSORIES_DETAIL (QUANTITY)
                console.log("hellooooooooooooooooooooo", newRepairID)
                let newRepairDetail = await repairInfoSheetDetail.create({
                    RepairInfoSheetID: newRepairID,
                    Content: repairInfoReq.content[i],
                    //WageID: repairInfoReq.wageID[i],
                    Times: repairInfoReq.times[i],
                    WageID: wageDB.id
                })

                // UNITPRICE
                const unitPrice = await accessories.findByPk(accessoriesDB.id, {
                    attributes: ["UnitPrice"]
                })

                console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiii", newRepairDetail.id)
                // CREATE ACCESSORIES DETAIL
                // get UnitPrice from Accessories
                let accessoryTotalAmount = Number(repairInfoReq.accessories[i].quantity) * unitPrice.UnitPrice
                let newAccessoriesDetail = await accessoriesDetail.create({
                    detailedRepairInfoSheetID: newRepairDetail.id,
                    AccessoriesID: repairInfoReq.accessories[i].id,
                    Quantity: repairInfoReq.accessories[i].quantity,
                    UnitPrice: unitPrice.UnitPrice,
                    TotalAmount: accessoryTotalAmount
                })

                // UPDATE REPAIRINFOSHEET_DETAIL
                const wageValue = await wage.findByPk(wageDB.id, {
                    attributes: ["Value"]
                })

                console.log("wage value: ", wageValue)
                let updateWageTotal = wageValue.Value * repairInfoReq.times[i]
                let updateTotalAmount = updateWageTotal + accessoryTotalAmount
                await newRepairDetail.update({
                    WageTotal: updateWageTotal,
                    TotalAmount: updateTotalAmount
                })

                updateRepairAmount += updateTotalAmount
            }
            // duyet mang accessories => tao detailedAccessories 
            // => Tao detailsRepairInfo/detailedAccessorries

            await newRepair.update({
                Amount: updateRepairAmount
            })

            // UPDATE CAR.DEBT+= UPDATEREPAIRAMOUNT
            console.log("Car Debt: ", carDB)
            await carDB.increment("Debt", {by: updateRepairAmount})

            return res.status(200).json({
            })
        }catch(err){
            console.log("err ", err )
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) => {
        try{
            const {count, rows} = await repairInfoSheet.findAndCountAll({
                attributes: ["id", "Date", "CarID", "Amount"]
            })
            return res.status(200).json({
                Total: count,
                RepairInfo: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAllDetail: async (req, res, next) => {
        try{
            const {count, rows} = await repairInfoSheet.findAndCountAll({
                attributes: ["id", "Date", "CarID", "Amount"],
                include: [{model: car, attributes: ["id", "LicensePlate", "ReceivedDate", "Debt", "CustomerID", "BrandID"]}]
            })

            let repairInfoList = []

            for(let i=0; i<count; i++){
                let repairInfoID = rows[i].id
                console.log(repairInfoID)
                let repairInfoDetails = await repairInfoSheetDetail.findAll({where:{RepairInfoSheetID: repairInfoID}})
                repairInfoList.push({
                    repairInfo: rows[i],
                    repairInfodDetails: repairInfoDetails
                })
            }

            return res.status(200).json({
                Total: count,
                RepairInfo: repairInfoList
            })
        }catch(err){
            return res.status(400).json(err)
        }   
    },

    //License Plate
    // K CÓ XE CÓ LICENSE => TRẢ VỀ ERR
    // 
    getByLP: async (req, res, next) => {
        try{
            const licensePlate = req.params.license
            const {count, rows} = await repairInfoSheet.findAndCountAll({
                attributes: ["id", "Date", "CarID", "Amount"],
                include: {
                    model: car,
                    attributes: ["LicensePlate"],
                    where:{
                        LicensePlate: licensePlate
                    }
                }
            })

            /*const {count, rows} = await repairInfoSheet.findAndCountAll({
                include: {all: true}
            })*/

            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

            let carRepairsRes = {
                Car: licensePlate,
                RepairList: []
            }
            
            for(let i=0; i<count; i++){
                let repairdetail = await rows[i].getRepairInfoSheet()

                let repairdetailsRes = {
                    id: rows[i].id,
                    Date: rows[i].Date,
                    repairDetailList: []
                }

                for(let j=0; j<repairdetail.length; j++){
                    let accessoriesDetail = await repairdetail[j].getDetailedRepairInfoSheet()
                    let accessoriesDetailRes = {
                        Content: repairdetail[j].Content,
                        WageTotal: repairdetail[j].WageTotal,
                        TotalAmount: repairdetail[j].TotalAmount,
                        Times: repairdetail[j].Times,
                        Accessories: []
                    }

                        for(let k=0; k<accessoriesDetail.length; k++){
                            let accessory = await accessories.findByPk(accessoriesDetail[k].AccessoriesID)

                            //console.log("accessories: ", accessoriesDetail[k])
                            let accessoryDetail = {
                                AccessoryID: accessory.id,
                                Accessory: accessory.Name,
                                //Quantity: accessoriesDetail[k].Quantity
                            }
                            accessoriesDetailRes.Accessories.push(accessoryDetail)
                            console.log(accessoryDetail)
                        }
                    
                        repairdetailsRes.repairDetailList.push(accessoriesDetailRes)

                }

                carRepairsRes.RepairList.push(repairdetailsRes)

            }

            


            /*let repairDetailList = []
            for(let i=0; i<count; i++){
                let detail = await repairInfoSheetDetail.findAll({where: {RepairInfoSheetID: rows[i].id}})

                let detailRes = {
                    Content: detail.Content,
                    AccessoriesID: detail.AccessoriesID,
                }
                repairDetailList.push({
                    
                })
            }*/


             //await repairInfoSheetDetail.findAll({where:{carID: }})

            res.status(200).json(carRepairsRes)
        }catch(err){
            res.status(400).json(err)
        }
    },

    update: async (req, res, next) => {

    },

    // CREATE deletedAt
    delete: async (req, res, next) => {
        try{
            const idReq = req.params.id
            if(!idReq){
                return res.status(400).json("url error")
            }

            await repairInfoSheet.destroy({where:{id: idReq} })

            let repairInfoDetails = await repairInfoSheetDetail.findAll({
                attributes: ["id"],
                where: {RepairInfoSheetID: idReq}
            })

            console.log(repairInfoDetails)
            repairInfoDetails.forEach(async detail => {
                console.log("id: ", detail.id)
                await accessoriesDetail.destroy({where: {detailedRepairInfoSheetID: detail.id}})
            })

            await repairInfoSheetDetail.destroy({where: {RepairInfoSheetID: idReq}})
            return res.status(200).json("deleted")

        }catch(err){
            return res.status(400).json(err)
        }
    }
}

module.exports = repairInfoSheetController