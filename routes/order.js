const express= require("express");
const router=express.Router();
const {requireSignin, isAuth}=require("../controllers/auth")
const {userById, addOrderToUserHistory,isAdmin}=require("../controllers/user")
const Order=require("../controllers/order")
const {decreaseQuantity}=require("../controllers/product")

// router.post('/order/create/:userId',requireSignin,addOrderToUserHistory,isAuth,decreaseQuantity,create)
router.get("/order/list/:userId", isAuth, requireSignin, isAdmin, function(req,res){
Order.listOrders
});
router.post("/order/create/:userId", requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, create);
router.param("userId", userById)
module.exports=router;