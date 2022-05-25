const { user, password } = require('pg/lib/defaults')
const Car = require('../models/car')
const Receipts = require('../models/receipts')
const Customer=require('../models/customer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const collectmoneyController =
{
    find_collectmoney: async (req,res,next)=>
    {
        try
        {
            let userReq={
                bienso: req.body.bienso,
            }
            if (!userReq.bienso)
            {
                let allReceipts = await Receipts.findAll({raw: true, nest: true})
                let prcReceipts = allReceipts.map(receipt=>
                    {
                        delete receipt["createdAt"]
                        delete receipt["updatedAt"]
                        return receipt
                    })
                res.json(prcReceipts)
                return
            }
            else{
                let allCar= await Car.findOne({
                    where: {LicensePlate: userReq.bienso}})
                let allReceipts=await Receipts.findAll({
                    where: {CarID: allCar["id"]},raw: true, nest: true})
                let procReceipts = allReceipts.map(receipt=>{
                    delete receipt["createdAt"]
                    delete receipt["updatedAt"]
                    return receipt
                })
                res.json(procReceipts)
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
                res.json("Did not enter amount or license plate")
                return
            }
            let allCar = await Car.findOne({ where: { LicensePlate: userReq.bienso } })
            if (!allCar) {
                res.json("Couldn't find license plate")
                return
            }
            if (userReq.sotien > allCar['Debt']) {
                res.json("The payment amount is greater than the amount owed")
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
            console.error(err)
        }
    }
}

module.exports = collectmoneyController