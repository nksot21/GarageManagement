const Car = require('../../models/car')
const Brand = require('../../models/brand')
const Customer = require('../../models/customer')

function check(userReq,car)
{
    if(car["LicensePlate"]==userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&car["BRAND_NAME"]==userReq.hieuxe&&userReq.tienno==car["Debt"])
    {
        return true
    }
    if(car["LicensePlate"]==userReq.bienso&&!userReq.chuxe&&!userReq.hieuxe&&!userReq.tienno)
    {return true;}
    if(!userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&!userReq.hieuxe&&!userReq.tienno)
    {return true}
    if(!userReq.bienso&&!userReq.chuxe&&car["BRAND_NAME"]==userReq.hieuxe&&!userReq.tienno)
    {return true}
    if(!userReq.bienso&&!userReq.chuxe&&!userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    if(car["LicensePlate"]==userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&!userReq.hieuxe&&!userReq.tienno)
    {return true;}
    if(car["LicensePlate"]==userReq.bienso&&!userReq.chuxe&&car["BRAND_NAME"]==userReq.hieuxe&&!userReq.tienno)
    {return true;}
    if(car["LicensePlate"]==userReq.bienso&&!userReq.chuxe&&!userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true;}
    if(!userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&car["BRAND_NAME"]==userReq.hieuxe&&!userReq.tienno)
    {return true}
    if(!userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&!userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    if(!userReq.bienso&&!userReq.chuxe&&car["BRAND_NAME"]==userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    if(car["LicensePlate"]==userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&car["BRAND_NAME"]==userReq.hieuxe&&!userReq.tienno)
    {return true}
    if(car["LicensePlate"]==userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&!userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    if(!userReq.bienso&&userReq.chuxe==car["CUSTOMER_NAME"]&&car["BRAND_NAME"]==userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    if(car["LicensePlate"]==userReq.bienso&&!userReq.chuxe&&car["BRAND_NAME"]==userReq.hieuxe&&userReq.tienno==car["Debt"])
    {return true}
    return false

}
searchcarController =
{
    getseach: async (req, res, next) => {
        try {
            var userReq = {
                bienso: req.body.bienso,
                hieuxe: req.body.hieuxe,
                chuxe: req.body.chuxe,
                tienno: req.body.tienno
            }
            var allCar = await Car.findAll({
                attributes: ["LicensePlate", "Debt"],
                include: [Brand, Customer], raw: true, nest: true
            })
            let procCar = allCar.map(car => {
                let tmp = car["BRAND"]
                car["BRAND_NAME"] = tmp['name']

                tmp = car["CUSTOMER"]
                car["CUSTOMER_NAME"] = tmp["Name"]

                delete car["BRAND"]
                delete car["CUSTOMER"]
                // delete car["id"]
                // delete car["BrandID"]
                // delete car["CustomerID"]
                // delete car["updatedAt"]
                // delete car["createdAt"]
                // delete car["ReceivedDate"]
                return car
            });
            if (!userReq.bienso && !userReq.hieuxe && !userReq.chuxe && !userReq.tienno) {
                // var allcar =await sequelize.query("SELECT * FROM qltt.car join qltt.brand on qltt.brand.id = qltt.car.BrandID"
                res.json(procCar);
            }
            else {
                console.log(userReq)
                procCar = procCar.map(car => {
                    if (check(userReq, car)) {

                        return car
                    }
                })
                procCar = procCar.filter(car => car != null);
                res.json(procCar)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}
module.exports = searchcarController