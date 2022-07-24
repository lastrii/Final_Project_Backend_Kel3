const { users } = require("../models");
const jwt = require("jsonwebtoken");
const {sequelize} = require("sequelize");

module.exports = {
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if(!refreshToken) return res.sendStatus(401);

            const user = await users.findAll({
                Where: {
                    refresh_token: refreshToken
                }
            });

            if(!user[0]) return res.sendStatus(403);

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                const id = user[0].id;
                const name = user[0].username;
                const email = user[0].email;
                const accessToken = jwt.sign({ id, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1h'
                });
                res.json({ accessToken });
            });
        }catch (error) {
            console.log(error);
        }
    }
}