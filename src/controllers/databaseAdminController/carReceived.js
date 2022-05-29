const carReceiveSheet = require("../../models/carReceiveSheet")

const carReceivedSheet = {
    delete: async (req, res, next) => {
        try{
            const id = req.params.id;
            await carReceiveSheet.destroy({where: {id: id}, force: true})
    
            res.status(200).json("hard-deletion complete")
        }catch(err){
            res.status(400).json(err)
        }
    } 
}

module.exports = carReceivedSheet