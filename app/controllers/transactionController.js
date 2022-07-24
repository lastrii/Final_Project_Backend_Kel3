const {transactions, products} = require("../models");
const {Op} = require("sequelize");
const {
    addNotification,
    buyerUpdateNotification,
    sellerUpdateNotification
} = require("./notificationController");

module.exports = {
    async getUserTransaction(req, res) {
        try {
            const id = req.id;
    
            const data = await transactions.findAll({
                where: {
                    [Op.or]: [{sellerId: id}, {buyerId: id}]
                }
            })
            res.status(200).json({
                msg: "Success",
                data: data
            })
        } catch (error) {
            res.status(500).json({
                msg: error.message
            })
        }
    },

    async getTransactionDetail(req, res) {
        try {
            const transaction = await transactions.findByPk(req.params.id);
            if(!transaction) {
                return res.status(422).json({
                    msg: "Transaction not found"
                })
            }

            const product = await products.findOne({where: {id: transaction.productId}})

            res.status(200).json({
                msg: "Success",
                transaction: transaction,
                product: product
            })
        } catch (error) {
            res.status(500).json({
                msg: error.message
            })
        }
    },

    async addTransaction(req, res) {
        try {
          let dataTransaksi;
      
          // Find if product exist
          const product = await products.findOne({where: {id: req.params.id}});
      
          if (!product) {
            res.status(500).json({
              message: "Product not found!",
            });
      
            return;
          }
      
          // Check user id
          const userId = req.id;
      
          if (product.userId === userId) {
            res.status(422).json({
              message: "Cannot buy your own item!",
            });
      
            return;
          }
      
          const dataReq = {
            productId: req.params.id,
            sellerId: product.userId,
            buyerId: userId,
            bidPrice: req.body.bidPrice,
            sellerResponse: false,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Add Transaksi
          await transactions.create(dataReq).then((data) => {
            dataTransaksi = data;
          });
          console.log("biding :", dataTransaksi.bidPrice);
      
          // Send to Notifications
          const notif = await addNotification({
            transactionId: dataTransaksi.id,
            sellerId: dataTransaksi.sellerId,
            buyerId: dataTransaksi.buyerId,
            productName: product.name,
            price: product.price,
            bidPrice: dataTransaksi.bidPrice,
            status: "Penawaran produk"
          })

          res.status(200).json({
            messages: "Success!",
            dataTransaksi: dataTransaksi,
            product: product,
            Notification: notif
          });
        } catch (error) {
          res.status(422).json({
            message: error.message,
          });
        }
    },

    async sellerRejectTransaction(req, res) {
        try {
            const data = {
                sellerResponse: true,
                updatedAt: new Date()
            };

            await transactions.update(data, {
                where: {id: req.params.id}
            });

            const transaction = await transactions.findOne({
                where: {id: req.params.id}
            })

            const requestNotif = {
                status: "Penawaran Produk Ditolak",
                updatedAt: new Date()
            }

            const notif = await sellerUpdateNotification(req, requestNotif, req.params.id, transaction.buyerId)
            res.status(200).json({
                msg: "Success",
                data: data,
                notification: notif
            })
        }catch(error) {
            res.status(422).json({
                msg: error.message
            }) 
        }
    },
    
    async sellerAcceptTransaction(req, res) {
        try {
            const data = {
                isProductAccepted: true,
                updatedAt: new Date()
            }

            await transactions.update(data, {
                where: {id: req.params.id}
            })

            const transaction = await transactions.findOne({
                where: {id: req.params.id}
            })

            const requestNotif = {
                status: "Penawaran Produk Diterima",
                message: "Penjual akan menghubungimu via whatsapp",
                updatedAt: new Date()
            }

            const notif = await sellerUpdateNotification(req, requestNotif, req.params.id, transaction.buyerId)
            
            res.status(200).json({
                msg: "Success",
                data: data,
                notification: notif
            })
        } catch (error) {
            res.status(422).json({
                msg: error.message
            })
        }
    },

    async buyerUpdateTransaction(req, res) {
        try {
            const data = {
                price: req.body.price,
                sellerResponse: false,
                updatedAt: new Date()
            };

            await transactions.update(data, {
                where: {id: req.params.id}
            })

            const transaction = await transactions.findOne({
                where: {id: req.params.id}
            })

            const requestNotif = {
                status: "Penawaran Produk",
                bidPrice: req.body.bidPrice,
                updatedAt: new Date()
            }

            const notif = await buyerUpdateNotification(req, requestNotif, req.params.id, transaction.sellerId)
            res.status(200).json({
                msg: "Success",
                data: data,
                notification: notif
            })
        } catch (error) {
            res.status(422).json({
                msg: error.message
            })
        }
    },

    async finalTransaction(req, res) {
        try {
            const transaction = await transactions.findOne({
                where: {id: req.params.id}
            })

            const product = await products.findOne({where: {id: transaction.productId}});

            if(req.body.transaction === "accepted") {
                const requestNotif = {
                    status: "Produk Berhasil Dijual",
                    message: "Terima kasih telah membeli produk ini",
                    updatedAt: new Date()
                }

                const notif = await sellerUpdateNotification(
                    req, 
                    requestNotif, 
                    req.params.id,
                    transaction.buyerId
                );

                const transactionReq = {
                    isCompleted: true,
                    updatedAt: new Date()
                }

                const transactionUpdate = await transactions.update(transactionReq, {where: {id: req.params.id}})
                
                const reqData = {
                    isSold: true,
                    updatedAt: new Date()
                }

                const productUpdate = await products.update(reqData,{
                    where: {
                        id: product.id
                    }
                })

                res.status(200).json({
                    message: "Transaksi Berhasil",
                    notification: notif,
                    transaction: transactionUpdate,
                    product: productUpdate
                })
            } else {
                const requestNotif = {
                    status: "Transaksi Dibatalkan",
                    message: "Terima kasih telah mencoba untuk membeli produk ini",
                    updatedAt: new Date()
                }

                const notif = await sellerUpdateNotification(req, requestNotif, req.params.id, transaction.buyerId)

                const transactionReq = {
                    isCompleted: true,
                    updatedAt: new Date()
                }

                const transactionUpdate = await transactions.update(transactionReq, {
                    where: {id: req.params.id}
                })

                res.status(200).json({
                    message: "Transaksi Dibatalkan",
                    notification: notif,
                    transaction: transactionUpdate
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: error.message
            })
        }
    }

    
}