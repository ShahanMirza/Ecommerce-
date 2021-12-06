
const express=require("express")
const mongoose=require('mongoose')
const morgan= require('morgan')
const bodyParser=require('body-parser')
const cookieParser= require('cookie-parser')
const expressValidator=require('express-validator')
require('dotenv').config()
//import routes
const authRoutes=require('./routes/auth')
const userRoutes=require("./routes/user")
const categoryRouter=require("./routes/category")
const productRouter=require("./routes/product")
//app
const app=express()
//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true
    // useCreateIndex: true
}).then(()=>console.log('Database Connected'));
//middleware
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
//router middleware
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRouter)
app.use("/api", productRouter)

 const port=process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`App running on port ${port}`)
});