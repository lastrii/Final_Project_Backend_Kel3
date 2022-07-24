const { Op } = require ("sequelize");
const { users } = require ("../models");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcrypt");
const cloudinary = require("../../cloudinary/cloudinary");
const upload = require("../../cloudinary/multer");
const {kirimEmail} = require("../middleware/emailVerif")

module.exports = {
    async Register(req, res) {
        try {
            const { username, email, password, confPassword } = req.body;

            if(password !== confPassword){
                return res.status(400).json({
                    status: "Failed",
                    msg: "Password and confPassword doesn't match"
                })
            }
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            const existUser = await users.findOne({
                where: {
                    email: email
                }
            })

            if(existUser) {
                return res.status(401).json({
                    status: "Fail",
                    message: "Email is already exists"
                })
            }

        
            await users.create({
                username: username,
                email: email,
                password: hashPassword
            });
            res.status(200).json({
                status: "OK",
                msg: "Register Success"
            })
        } catch (error) {
            console.log(error);
        }

        // verifemail
        // const templateEmail = {
        //     from : 'SecondHand',
        //     to : email,
        //     subject : 'Email Verification',
        //     html : 'Halo! Terimakasih sudah mendaftar di SecondHand! Silahkan klik link dibawah untuk memverifikasi akun anda http://localhost:8000'
        //  }
        //  kirimEmail (templateEmail)
    },

    async Login(req, res) {
        try {
            const user = await users.findOne({
                where: {
                    email: req.body.email
                }
            });
            
            
            if(!user) {
                return res.status(401).json({
                    msg: "Email doesn't exists"
                })
            }
            
            
            const match = bcrypt.compare(user.password, req.body.password);
            if(!match) return res.status(401).json({
                msg: "Wrong Password"
            })

            const id = user.id;
            const username = user.username;
            const email = user.email;
            const address = user.address;
            const phone = user.phone;
            const city = user.city;
            const image = user.image;
            
            const accessToken = jwt.sign({id, username, email, address, phone, city, image}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            const refreshToken = jwt.sign({id, username, email}, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            await users.update({refresh_token: refreshToken},{
                where:{
                    id: id
                }
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                status: "OK",
                msg: "Login success",
                accessToken
            })
        } catch (error) {
            res.status(500).json({
                status: "Fail",
                msg: error.message
            })
        }
    },

    async Logout(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.sendStatus(204);

        const user = await users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user[0]) return res.sendStatus(204);

        const id = user[0].id;
        
        await users.update({refresh_token: null}, {
            where: {
                id: id
            }
        });
        res.clearCookie('refreshToken');
        return re.sendStatus(200)
    },

    async getUser(req, res) {
        try {
            const id = req.id;
            console.log("Req :", req.id);
    
            const user = await users.findOne({
                where: { id: id },
                attributes: ['image', 'username', 'email', 'phone', 'address']
            })
            console.log("user data : ",user);
    
            return res.status(200).json({
                status: "OK",
                msg: "User data retrieved successfully",
                data: user
            })
        } catch (error) {
            console.log(error)
            res.status(402).json({
                status: "Failed",
                msg: "Failed to get user data"
            })
        }
    },

    async updateUser(req, res) {
        const id = req.id;
        try {
            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                username: req.body.username,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                image: result.url ? result.url : initial.image
            }

            const userData = await users.update(data,{where: {id: id}});
            res.status(200).json({
                status:"Success",
                msg: "Update profile success",
                data: data
            });
        } catch(err) {
            res.status(200).json({
                status:"Failure",
                msg: "Update data has been failure",
            });
            console.log(err);
        }
    }
}

