const car = require('../../models/car')
const customer = require('../../models/customer')
const carReceiveSheet = require('../../models/carReceiveSheet')
const parameters = require('../../models/parameters')
const parameter = require('../../models/parameters')
const sequelize = require('../../pkg/database/sequelize')
const { contentDisposition } = require('express/lib/utils')

// PHIEU TIEP NHAN SUA CHUA
// BM 1

// FIND CUSTOMER BY PHONE NUMBER
findCustomerByPN = async (customerPN) => {
    try{
        console.log(customerPN)
        const customerDB = await customer.findOne({where: {PhoneNumber: customerPN}})
        if(!customerDB){
            return null
        }
        return customerDB
    }catch(err){
        return err
    }
}

findCustomerByID = async (customerID) => {
    try{
        const customerDB = await customer.findByPk(customerID)
        if(!customerDB){
            return null
        }
        return customerDB
    }catch(err){
        return err
    }
}

// FIND CAR BY LICENSE PLATE
findCarByLP = async (licensePlate) =>{
    try{
        const carDB = await car.findOne({where: {LicensePlate: licensePlate}})
        if(!carDB){
            return null
        }else{
            return carDB
        }
    }catch(err){
        return err
    }
}

// CREATE CAR RECEIVE SHEET RESPONSE

// CHECK CARRECEIVED PER DAY
checkCarReceivedNumber = async () => {
    const op = sequelize.op
    const today = new Date();
    const { count, rows } = await car.findAndCountAll({
        where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', sequelize.fn('date', sequelize.fn('NOW')))
    })
    console.log("now: ", sequelize.fn('NOW'))
    console.log("quantity: ", count, "rows ", rows)
    const limitNumber = await parameters.findOne({
        order: [['createdAt', 'DESC']]
    })
    console.log("limitNumber: ", limitNumber.CarReceivedperDay)
    if(count >= limitNumber.CarReceivedperDay){
        return false
    }
    return true
}


const carReceiveSheetController = {
    create: async (req, res, next) => {
        // tạo một phiếu tiếp nhận (ID, CustomerID, CarID, ngày tiếp nhận)
        // CHECK THE NIUMBER OF CARS RECEIVED N DAY (30 get from THAMSO_TABLE =)))) 
        try{
            if(! await checkCarReceivedNumber()){
                return res.status(400).json("exceed the allowed amount")
            }
            const carReceiveReq = {
                customerName: req.body.customerName,
                customerAddress: req.body.customerAddress,
                customerPhoneNumber: req.body.customerPhoneNumber,
                receivedDate: req.body.receivedDate,
                licensePlate: req.body.licensePlate,
                brand: req.body.brand
            }

            console.log(carReceiveReq)
            // FIND CUSTOMER
            const customerDB = await findCustomerByPN(carReceiveReq.customerPhoneNumber)
            if(!customerDB){
                // CREATE NEW CUSTOMER
                let newCustomer = await customer.create({
                    Name: carReceiveReq.customerName,
                    Address: carReceiveReq.customerAddress,
                    PhoneNumber: carReceiveReq.customerPhoneNumber
                })
                
                // CREATE NEW CAR
                let carDB = await findCarByLP(carReceiveReq.licensePlate)
                if(!carDB){
                    let newCar = await car.create({
                        LicensePlate: carReceiveReq.licensePlate,
                        BrandID: carReceiveReq.brand,
                        CustomerID: newCustomer.id
                    })

                    // CREATE NEW CAR RECEIVE SHEET
                    let newCarReceiveSheet = await carReceiveSheet.create({
                        CustomerID: newCustomer.id,
                        CarID: newCar.id,
                        receivedDate: carReceiveReq.receivedDate
                    })
                    
                    return res.status(200).json({
                        ReceiveSheet: newCarReceiveSheet,
                        Customer: newCustomer,
                        Car: newCar
                    })
                }else{
                    // CREATE NEW CAR RECEIVE SHEET
                    let newCarReceiveSheet = await carReceiveSheet.create({
                        CustomerID: newCustomer.id,
                        CarID: carDB.id,
                        receivedDate: carReceiveReq.receivedDate
                    })
                    
                    return res.status(200).json({
                        ReceiveSheet: newCarReceiveSheet,
                        Customer: newCustomer,
                        Car: carDB
                    })
                }
                
            }else{
                // CREATE NEW CAR
                let carDB = await findCarByLP(carReceiveReq.licensePlate)
                if(!carDB){
                    let newCar = await car.create({
                        LicensePlate: carReceiveReq.licensePlate,
                        BrandID: carReceiveReq.brand,
                        CustomerID: customerDB.id
                    })
                    
                    // CREATE NEW CAR RECEIVE SHEET
                    let newCarReceiveSheet = await carReceiveSheet.create({
                        CustomerID: customerDB.id,
                        CarID: newCar.id,
                        receivedDate: carReceiveReq.receivedDate
                    })
                    
                    return res.status(200).json({
                        ReceiveSheet: newCarReceiveSheet,
                        Customer: customerDB,
                        Car: newCar
                    })

                }else{
                    // CREATE NEW CAR RECEIVE SHEET
                    let newCarReceiveSheet = await carReceiveSheet.create({
                        CustomerID: customerDB.id,
                        CarID: carDB.id,
                        receivedDate: carReceiveReq.receivedDate
                    })
                    
                    return res.status(200).json({
                        ReceiveSheet: newCarReceiveSheet,
                        Customer: customerDB,
                        Car: carDB
                    })
                }
            }
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getAll: async (req, res, next) =>{
        // FIND ALL RECEIVED_CAR_SHEET BY CUSTOMER_PN OR CUSTOMER_EMAIL
        // Mỗi xe có một phiếu tiếp nhận xe
        try{
            let {count, rows} = await carReceiveSheet.findAndCountAll({
                attributes: ["id", "ReceivedDate", "CustomerID", "CarID"],
                include: [
                    { model: customer, attributes: ["Name", "Address", "PhoneNumber", "Email"]},
                    { model: car, attributes: ["LicensePlate", "ReceivedDate", "Debt", "BrandID"]}
                ]
            })
            return res.status(200).json({
                Total: count,
                ReceivedList: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    getByCustomerPN: async (req, res, next) => {
        try{
            const customerIDReq = req.params.customerID
            const customerDB = await findCustomerByID(customerIDReq)
            if(!customerDB){
                return res.status(400).json("customer ID error")
            }

            console.log(customerDB)
            let {count, rows} = await carReceiveSheet.findAndCountAll({include: car, where:{CustomerID: customerDB.id}})
            return res.status(200).json({
                Total: count,
                Customer: customerDB,
                ReceivedList: rows
            })
        }catch(err){
            return res.status(400).json(err)
        }
    },

    // Không hỗ trợ update (thông tin sai => Xóa tạo lại)
    update: async (req, res, next) =>{
        try{

        }catch(err){
            
        }
    },
    
    // sửa thành tạo trường deletedAt
    delete: async (req, res, next) => {
        try{
            const idReq = req.params.id
            if(!idReq){
                return res.status(400).json("error")
            }
            await carReceiveSheet.destroy({where:{id: idReq}})
            return res.status(200).json("deleted")
        }catch(err){
            return res.status(400).json(err)
        }
    }
}




module.exports = carReceiveSheetController
