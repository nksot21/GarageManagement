const siteController ={
    getHome: (req, res, next) => {
        return res.json("page")
    }
}

module.exports = siteController