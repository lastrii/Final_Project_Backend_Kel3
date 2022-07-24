const {notifications} = require("../models");
const {Op} = require("sequelize");

module.exports = {
    async addNotification(data) {
        await notifications.create(data);
    },
    
    async buyerUpdateNotification(req, data, transactionId, sellerId) {
        const userId =  req.id;

        await notifications.update(data, {
            where: {
                transactionId: transactionId,
                buyerId: userId,
                sellerId: sellerId
            }
        })
    },

    async sellerUpdateNotification(req, data, transactionId, buyerId) {
        const userId = req.id;

        await notifications.update(data, {
            where: {
                transactionId: transactionId,
                buyerId: buyerId,
                sellerId: userId
            }
        })
    },

    async getUserNotification(req, res) {
        try {
            const userId = req.id;

            const data = await notifications.findAll({
                where: {
                    [Op.or]: [{sellerId: userId}, {buyerId: userId}]
                }
            })
            res.status(200).json({
                msg: "Success",
                data: data
            })
        } catch(error) {
            res.status(500).json({
                msg: error.message
            })
        }
    }
}