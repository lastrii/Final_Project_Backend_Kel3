const {Op} = require("sequelize");
const {transactions} = require("../models");

module.exports = {
    async checkUserAuth(req, res, next) {
        try {
            const id = req.id;

            const transaction = await transactions.findOne({
                where: {
                    [Op.or]: [{sellerId: id}, {buyerId: id}]
                }
            });

            if(!transaction) {
                res.status(401).json({
                    msg: "Unauthorized!"
                })
            } else {
                next()
            }
        } catch (error) {
            res.status(500).json({
                msg: error.message
            })
        }
    },
    
    // Check transaction auth, buyer only
    async checkTransactionBuyerAuth(req, res, next) {
        try {
            const id = req.id;
        
            const transaction = await transactions.findOne({
                where: {buyerId: id},
            });
        
            if (!transaction) {
                res.status(401).json({
                msg: "Unauthorized!",
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    },

    // Check transaction auth, seller only
    async checkTransactionSellerAuth(req, res, next) {
        try {
            const id = req.id;
        
            const transaction = await transactions.findOne({
                where: {sellerId: id}
            });
        
            if (!transaction) {
                res.status(401).json({
                msg: "Unauthorized!",
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}