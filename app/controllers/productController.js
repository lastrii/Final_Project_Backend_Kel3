const { products, users, category } = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("../../cloudinary/cloudinary");
const upload = require("../../cloudinary/multer")

module.exports = {
    async createProduct(req, res) {
        const id = req.id;
        console.log("data token :", id)
        
        try {            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                userId: id,
                categoryId: req.body.categoryId,
                image: result.url
            }
            
            console.log("req data :", data)

            const product = await products.create(data);
            console.log(product);

            res.status(200).json({
                status: "OK",
                msg: "Item succefully created",
                data: product,
            })
        } catch(err) {
            res.status(400).json({
                status: "FAIL",
                msg: err,
            });
        }
    },

    async updateProduct(req, res) {
        const id = req.id;
        try {
            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                categoryId: req.body.categoryId,
                user: id,
                image: result.url
            }

            const product = await products.update(data, {where: {id: req.params.id}});
            res.status(200).json({
                status: "OK",
                msg: "Item succefully updated",
                data: product,
            })
        } catch(err) {
            res.status(400).json({
                status: "FAIL",
                msg: err,
            });
        }
    },

    async deleteProduct(req, res) {
        try {
            const id = req.id;
            
            await users.findByPk({where: { id: id }});

            const item = await products.destroy({
                where: { [Op.and]: [{id: req.params.id}, {userId: id}] }
            })

            if(!!item) {
                res.status(404).json({
                    deletedBy: req.result,
                    msg: "Product not found"
                })
            }
            res.json({
                msg: "Product successfully deleted"
            })
        } catch(error) {
            res.status(400).json({
                status: "Fail",
                msg: error.message
            })
        }
    },

    async getAllProduct(req, res) {
        const item = await products.findAll();
        res.status(200).json({
            status: "OK",
            data: item
        }) 
    },

    async getProductCategory(req, res) {
        try {
            const id = req.params.id;
            const item = await products.findAll({where: {categoryId: id}});
            const count = await products.count({where: {categoryId: id}});
    
            res.status(200).json({
                count: count,
                items: item
            })
        } catch (error) {
            res.status(400).json({
                status: "Fail",
                msg: "There is no product in this category"
            })
        }
    },

    async getProductDetail(req, res) {
        const id = req.params.id;
        
        try {
            const item = await products.findByPk(id, {
                include: [
                    {
                        model: users,
                        attributes: ['username', 'image', 'address', 'city', 'phone'],
                    },
                    {
                        model: category,
                        attributes: ['id', 'name']
                    }
                ]

            })
            res.status(200).json({
                msg: "This is your item",
                data: item
            })
        } catch (error) {
            res.status(404).json({
                status:"Fail",
                msg: "Produk doesn't exists!"
            })
        }
    },

    async getAllSellerProduct(req, res) {
        const id = req.id;

        try {
            const user = await users.findAll({ where: { id: id }})

            const product = await products.findAll({ where: { userId: id }});
            const productCount = await products.count({ where: { userId: id }});

            res.status(200).json({
                productCount: productCount,
                product: product
            })
        }catch(error) {
            res.status(400).json({
                status: "Fail",
                msg: "Sorry there is something wrong"
            })
        }
    }
}