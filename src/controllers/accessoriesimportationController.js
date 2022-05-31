const accessoriesimportation = require('../models/accessoriesImportation')
const accessoriesImportation_detail = require('../models/detailedAccessoriesImportation')
const accessories = require('../models/accessories')

const accessoriesimportationController =
{
    importspareparts: async (req, res, next) => {
        const list_Req = req.body
        let summoney = 0
        list_Req.map(Req => {
            if (!Req.MaVTPT || !Req.Soluong || !Req.Dongia) {
                summoney += 0
            }
            else {
                summoney += (Req.Soluong * Req.Dongia)
            }
        })
        console.log(summoney)
        const newaccessoriesimportation = await accessoriesimportation.create({
            TotalAmount: summoney
        })
        // console.log(newaccessoriesimportation.id)
        const result = list_Req.map(async Req => {
            if (!Req.MaVTPT || !Req.Soluong || !Req.Dongia) {
                return "error"
            }
            else {
                await accessoriesImportation_detail.create({
                    Quantity: Req.Dongia * Req.Soluong,
                    UnitPrice: Req.Dongia,
                    Amount: Req.Soluong,
                    AccessoriesID: Req.MaVTPT,
                    AccessoriesImportationID: newaccessoriesimportation.id,
                })
                var accessories_old = await accessories.findOne(
                    {
                        where: {
                            id: Req.MaVTPT
                        }
                    }
                )
                // console.log(accessories_old)
                await accessories.update({
                    UnitPrice: Req.Dongia,
                    Quantity: accessories_old['Quantity'] + Req.Soluong
                }, {
                    where: {
                        id: Req.MaVTPT
                    }
                })
                return "accept"

            }
        })

        console.log(result)
        res.json("Thank")
    }
}
module.exports = accessoriesimportationController