const express = require("express");
const { refreshToken } = require("../controllers/refreshToken");
const { verifyToken } = require("../middleware/verifyToken");
const cloudinary = require("../../cloudinary/cloudinary");
const  upload = require("../../cloudinary/multer");

const { 
    Register, 
    Login, 
    Logout, 
    getUser, 
    updateUser, 
    emailVerif
} = require("../controllers/userController");

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getProductCategory,
    getProductDetail,
    getAllSellerProduct
} = require("../controllers/productController")

const {
    getUserTransaction,
    getTransactionDetail,
    addTransaction,
    buyerUpdateTransaction,
    sellerRejectTransaction,
    sellerAcceptTransaction,
    finalTransaction,
} = require("../controllers/transactionController");

const { 
    checkUserAuth, 
    checkTransactionBuyerAuth, 
    checkTransactionSellerAuth 
} = require("../middleware/transaction");

const { getUserNotification } = require("../controllers/notificationController");

function apply(app) {
    app.post("/api/user/register", Register);
    app.post("/api/user/login", Login);
    app.get("/api/user/token", refreshToken);
    app.delete("/api/user/logout", Logout);
    app.get("/api/user", verifyToken, getUser);
    app.put("/api/user/data", verifyToken, upload.single("image"), updateUser);

    // Product
    app.post("/api/product/create", verifyToken, upload.single("image"), createProduct);
    app.put("/api/product/:id", verifyToken, upload.single("image"), updateProduct);
    app.delete("/api/product/:id", verifyToken, deleteProduct);
    app.get("/api/product/findall", getAllProduct);
    app.get("/api/product/category/:id", getProductCategory);
    app.get("/api/product/detail/:id", getProductDetail);
    app.get("/api/product/sellerproduct", verifyToken, getAllSellerProduct);

    // Transaction
    app.get("/api/transaction/user-transaction", [verifyToken, checkUserAuth], getUserTransaction)
    app.get("api/transaction/transaction-detail/:id", verifyToken, checkUserAuth, getTransactionDetail);
    app.post("/api/transaction/add-transaction/:id", verifyToken, addTransaction);
    app.put("/api/transaction/updateBuyer/:id", [verifyToken, checkTransactionBuyerAuth], buyerUpdateTransaction);
    app.put("/api/transaction/seller-reject/:id", [verifyToken, checkTransactionSellerAuth], sellerRejectTransaction);
    app.put("/api/transaction/seller-accept/:id", [verifyToken, checkTransactionSellerAuth], sellerAcceptTransaction);
    app.put("/api/transaction/final-transaction/:id", [verifyToken, checkTransactionSellerAuth], finalTransaction)
    
    // Notification
    app.get("/api/notification", verifyToken, checkUserAuth, getUserNotification);
    
    return app;
}

module.exports = { apply };