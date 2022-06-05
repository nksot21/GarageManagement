const Car = require('../../models/car')
const Receipts = require('../../models/receipts')
const Customer=require('../../models/customer')
const { sequelize } = require('../../models/car')
const collectmoneyController =
{
    getAll: async (req, res, next) =>{
        try{
            const {count, rows} = await Receipts.findAndCountAll({
                attributes:["Date", "Amount", "CarID"],
                include: [{
                    model: Car,
                    attributes: ["LicensePlate"],
                    where:{
                        id: sequelize.col('RECEIPTS.CarID')
                    },
                    include:{
                        model: Customer,
                        attributes: ["Name"],
                        where:{
                            id: sequelize.col('CAR.CustomerID')
                        }
                    }
                }]
            })

            return res.status(200).json({
                Total: count,
                Receipts: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },
    find_collectmoney: async (req,res,next)=>
    {
        try
        {
            let userReq={
                bienso: req.body.bienso,
            }
            if (userReq.bienso)
            {
                let {count, rows} = await Receipts.findAndCountAll({
                    attributes:["Date", "Amount", "CarID"],
                    include: [{
                        model: Car,
                        attributes: ["LicensePlate"],
                        where:{
                           id: sequelize.col('RECEIPTS.CarID'),
                           LicensePlate: userReq.bienso
                        },
                        include:{
                            model: Customer,
                            attributes: ["Name"],
                            where:{
                                id: sequelize.col('CAR.CustomerID')
                            }
                        }
                    }]
                })
                /*let prcReceipts = allReceipts.map(receipt=>
                    {
                        delete receipt["createdAt"]
                        delete receipt["updatedAt"]
                        return receipt
                    })*/
                res.json({
                    Total: count,
                    Receipts: rows
                })
                return 
            }
        }
        catch(err)
        {
            res.json(err)
        }

    },
    collectmoney: async (req, res, next) => {
        try {
            let userReq = {
                bienso: req.body.bienso,
                sotien: req.body.sotien,
            }
            console.log(userReq)
            if (!userReq.bienso || !userReq.sotien) {
                res.status(400).json("Did not enter amount or license plate")
                return
            }
            let allCar = await Car.findOne({ where: { LicensePlate: userReq.bienso } })
            if (!allCar) {
                res.status(400).json("Couldn't find license plate")
                return
            }
            if (userReq.sotien > allCar['Debt']) {
                res.status(400).json("The payment amount is greater than the amount owed")
                return
            }
            let newReceipts = await Receipts.create({
                Amount: userReq.sotien,
                CarID: allCar['id'],
            })
            await Car.update({
                Debt: allCar['Debt']-userReq.sotien,
            },
            {
                where: {LicensePlate: userReq.bienso}
            })
            let newCusses = await Customer.findOne({where: {id: allCar['CustomerID']}})
            let newres={
                Chuxe: newCusses['Name'],
                Bienso:userReq.bienso,
                Numberphone:newCusses['PhoneNumber'],
                Email:newCusses['Email'],
                Ngaythutien:newReceipts['Date'],
                Sotienthu:userReq.sotien
            }
            res.json( newres)
            //res.json(newReceipts.toJSON())

        }
        catch (err) {
            return res.status(400).json(err)
        }
    }
}

module.exports = collectmoneyController