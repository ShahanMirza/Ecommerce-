const Product= require("../models/product")
const formidable=require("formidable")
const _ = require("lodash")
const fs=require('fs')
const {errorHandler}=require("../helpers/dbErrorHandlers")

// exports.create=(req,res)=>{
//     let form= new formidable.IncomingForm();
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//         if(err){
//             return res.status(400).json({
//                 error:"Image could not be uploaded "
//             })
//         }
//         let product = new Product(fields);
//          console.log(files.originalFilename)
//         if (files.photo){
//             product.photo.data = fs.readFileSync(files.photo.);
//             product.photo.contentType = files.photo.type;
//             // product.photo.data = fs.readFileSync(files);
//             // product.photo.contentType = files;
//         }
//         product.save((result)=>{
//             if(err){
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 })
//             }
//             res.json(result);
//         })
//     })
// }


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { name, description, price, category, quantity, shipping } = fields;

        // if (!name || !description || !price || !category || !quantity || !shipping) {
        //     return res.status(400).json({
        //         error: 'All fields are required'
        //     });
        // }

        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
             console.log("FILES PHOTO: ", files.photo);
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
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
