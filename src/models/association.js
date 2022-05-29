const Car = require('./car');
const User = require('./user');
const brand = require('./brand');
const receipts = require('./receipts')
const repairInfoSheet = require('./repairInfoSheet');
const detailedRepairInfoSheet = require('./detailedRepairInfoSheet');
const wage = require('./wage');
const accessoriesType = require('./accessoriesType');
const accessories = require('./accessories');
const detailedAccessories = require('./detailedAccessories');
const detailedAccessoriesImportation = require('./detailedAccessoriesImportation');
const accessoriesImportation = require('./accessoriesImportation');
const customer = require('./customer');
const inventoryReport = require('./inventoryReport');
const detailedSalesReport = require('./detailedSalesReport');
const salesReport = require('./salesReport');
const carReceiveSheet = require('./carReceiveSheet');
const car = require('./car');

const association = () => {
    //  CAR - CUSTOMER
    customer.Car = customer.hasMany(Car,{
        as: 'Customer',
        foreignKey: 'CustomerID'
    })
    Car.belongsTo(customer,{
        foreignKey: 'CustomerID'
    });

    // CAR - BRAND
    brand.Car = brand.hasMany(Car, {
        as: 'Brand',
        foreignKey: 'BrandID'
    });
    Car.belongsTo(brand, {
        foreignKey: 'BrandID'
    });

    // RECEIPTS - CAR
    Car.receipts = Car.hasMany(receipts, {
        as: 'CarReceipt',
        foreignKey: 'CarID'
    });
    receipts.belongsTo(Car, {
        foreignKey: 'CarID'
    })
    
    // REPAIRINFOSHEET - CAR
    Car.repairInfoSheet = Car.hasMany(repairInfoSheet, {
        as: 'CarRepair',
       foreignKey: 'CarID'
    });
    repairInfoSheet.belongsTo(Car, {
        foreignKey: 'CarID'
    })

    // REPAIRINFOSHEET_DETAIL - REPAIRINFOSHEET
    repairInfoSheet.hasMany(detailedRepairInfoSheet, {
        as: 'repairInfoSheet',
        foreignKey: 'RepairInfoSheetID'
    })
    detailedRepairInfoSheet.repairInfoSheet = detailedRepairInfoSheet.belongsTo(repairInfoSheet, {
        foreignKey: 'RepairInfoSheetID'
    });


    // REPAIRINFOSHEET_DETAIL - WAGE
    wage.detailedRepairInfoSheet = wage.hasMany(detailedRepairInfoSheet, {
        as: 'Wage',
        foreignKey: 'WageID'
    });
    detailedRepairInfoSheet.belongsTo(wage, {
        foreignKey: 'WageID'
    })

    // ACCESSORIES - ACCESSORIESTYPE
    accessoriesType.accessories = accessoriesType.hasMany(accessories,{
        as: 'AccessoriesType',
        foreignKey: 'AccessoriesTypeID'
    });
    accessories.belongsTo(accessoriesType, {
        foreignKey: 'AccessoriesTypeID'
    })

    // ACCESSORIES_DETAIL - ACCESSORIES
    accessories.hasMany(detailedAccessories, {
        as: 'Accessories',
        foreignKey: 'AccessoriesID'
    })
    detailedAccessories.accessories = detailedAccessories.belongsTo(accessories, {
        foreignKey: 'AccessoriesID'
    });

    // ACCESSORIES_DETAIL - REPAIRINFOSHEET_DETAIL
    detailedRepairInfoSheet.hasMany(detailedAccessories, {
        as: 'detailedRepairInfoSheet',
        foreignKey: 'detailedRepairInfoSheetID'
    })
    detailedAccessories.detailedRepairInfoSheet = detailedAccessories.belongsTo(detailedRepairInfoSheet, {
        foreignKey: 'detailedRepairInfoSheetID'
    });

    // ACCESSORIES_DETAIL - ACCESSORIES
    accessories.detailedAccessoriesImportation = accessories.hasMany(detailedAccessoriesImportation,{
        as: 'Importation',
        foreignKey: 'AccessoriesID'
    });
    detailedAccessoriesImportation.belongsTo(accessories, {
        foreignKey: 'AccessoriesID'
    })

    // ACCESSORIESIMPORTATION_DETAIL - ACCESSORIESIMPORTATION
    accessoriesImportation.hasMany(detailedAccessoriesImportation, {
        as: 'AccessoriesImportation',
        foreignKey: 'AccessoriesImportationID'
    })
    detailedAccessoriesImportation.accessoriesImportation = detailedAccessoriesImportation.belongsTo(accessoriesImportation, {
        foreignKey: 'AccessoriesImportationID'
    });

    // INVENTORYREPORT - ACCESSORIES
    accessories.hasMany(inventoryReport, {
        as: 'AccessoriesInventory',
        foreignKey: 'AccessoriesID'
    })
    inventoryReport.accessories = inventoryReport.belongsTo(accessories, {
        foreignKey: 'AccessoriesID'
    });

    // SALESREPORT - SALESREPORT_DETAIL
    salesReport.hasMany(detailedSalesReport, {
        as: 'SalesReport',
        foreignKey: 'SalesReportID'
    })
    detailedSalesReport.salesReport = detailedSalesReport.belongsTo(salesReport, {
        foreignKey: 'SalesReportID'
    })

    // SALESREPORT_DETAIL - REPAIRINFOSHEET
    repairInfoSheet.hasMany(detailedSalesReport, {
        as: 'RepairInfoSheet',
        foreignKey: 'RepairInfoSheetID'
    })
    detailedSalesReport.repairInfoSheet = detailedSalesReport.belongsTo(repairInfoSheet, {
        foreignKey: 'RepairInfoSheetID'
    })

    // SALESREPORT_DETAIL - BRAND
    brand.hasMany(detailedSalesReport, {
        as: 'BrandSalesReport',
        foreignKey: 'BrandID'
    })
    detailedSalesReport.brand = detailedSalesReport.belongsTo(brand,{
        foreignKey: 'BrandID'
    })

    // CAR_RECEIVE_SHEET - CUSTOMER
    customer.hasMany(carReceiveSheet,{
        foreignKey: 'CustomerID'
    })
    carReceiveSheet.belongsTo(customer,{
        foreignKey: 'CustomerID'
    })

    // CAR_RECEIVE_SHEET - CAR
    car.hasMany(carReceiveSheet, {
        foreignKey: 'CarID'
    })
    carReceiveSheet.belongsTo(car, {
        foreignKey: 'CarID'
    })



}
module.exports = association




