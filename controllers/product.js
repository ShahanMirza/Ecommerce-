const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const { errorHandler } = require("../helpers/dbErrorHandlers")

const fs = require("fs/promises");
const path = require("path");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
      
        const {name, description,price, category, quantity, shipping}= fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            // console.log(name);
            // console.log(description);
            // console.log(price);
            // console.log(category);
            // console.log(quantity);
            //  console.log("Shipping",shipping);
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo && process.env.PHOTO_DIRECTORY) {
            //file size validation
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                })
            }
            // Create the path to upload the file.
            let filepath = path.join(process.env.PHOTO_DIRECTORY, files.photo.originalFilename);

            // Upload the photo to PHOTO_DIRECTORY
            await fs.rename(files.photo.filepath, filepath);

            //console.log("FILES PHOTO: ", files.photo);
            product.photoPath = filepath;
            product.photoName = files.photo.originalFilename;
            product.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.productById= (req,res,next,id)=> {
    Product.findById(id).exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error: "Product Not found"
            })
        }
        req.product= product
        next()
    })
}

exports.read=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product)
}
exports.remove=(req,res)=>{
    let product= req.product
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            deletedProduct,
            message: "Product Deleted Successfully"
        })
    })
}

exports.update=(req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req, async(err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error: "Image could not updated"
            })
        }

        const {name,description, price, category,quantity,shipping}=fields
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                message:" All fields are required"
            })
        }
        let product=req.product
        product=_.extend(product,fields)

        if(files.photo && process.env.PHOTO_DIRECTORY){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                })
            }
            let filepath= path.join(process.env.PHOTO_DIRECTORY, files.photo.originalFilename)
            console.log(filepath)
            await fs.rename(files.photo.filepath, filepath)

            product.photoPath=filepath
            product.photoName= files.photo.originalFilename
            product.contentType= files.photo.mimetype
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}