const express=require('express');
const { models } = require('mongoose');
const router=express();
const {userById,read,update}=require("../controllers/user")
const {requireSignin,isAuth, isAdmin}=require("../controllers/auth");
router.get('/secret/:userId',requireSignin, isAuth,isAdmin, (req,res) => {
    res.json({
        user: req.profile
    });
})
router.get('/user/:userId',requireSignin, isAuth, isAdmin,read)
router.put('/user/:userId',requireSignin,isAdmin,isAuth,update)
router.param('userId',userById);
module.exports=router;