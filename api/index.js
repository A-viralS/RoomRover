const express = require('express')
require("dotenv").config()
const cors=require('cors')
const app=express();
const path=require('path')
const User= require('./models/User')
const bcrypt = require('bcryptjs');
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const imageDownloader=require('image-downloader')
const fs=require('fs')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret= "secret"
app.use(cookieParser())

const testPath=__dirname+'/uploads'
console.log(testPath);
app.use(express.static(path.resolve(testPath)));



app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }));
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoFuckingDB connected"))
  app.use(express.json())
  app.get('/test', (req,res)=>{
    res.json('test ok ')
  })
  app.post('/register',async (req,res)=>{
    const{name,email,password}=req.body;
    console.log(name,email,password);
try {
    const userDoc= await User.create({
        name,email,
        password:bcrypt.hashSync(password,bcryptSalt)
    })
    res.json(userDoc);
    
} catch (error) {
    res.status(422).json(error)
    
}
  })

  app.post('/login',async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
   const {email,password}=req.body;
    const userDoc=await User.findOne({email})
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
          jwt.sign({//these are the things that would be send as cookies
            email:userDoc.email,
            id:userDoc._id,
            name:userDoc.name
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json(userDoc);
          });
        } else {
          res.status(422).json('pass not ok');
        }
      } else {
        res.json('not found');
      }
    });

    app.get('/profile',(req,res)=>{
      
    
      const {token}=req.cookies;
      if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const {name,email,_id} = await User.findById(userData.id);
          res.json({name,email,_id});
        });
      } else {
        res.json(null);
      }


    })


    app.post('/logout',(req,res)=>{
      res.cookie('token','').json(true);//sets the cookie as empty
    })


    app.post('/upload-by-link', async (req,res)=>{
      const {link}=req.body
      const newName='photo'+Date.now()+'.jpg'
     await imageDownloader.image({
        url:link,
        dest: testPath+'/'+newName
      })
      res.json(newName)
    });
    
const photoMiddleware=multer({dest:'uploads/'});

    app.post('/upload',photoMiddleware.array('photos',100),(req,res)=>{
      const uploadedFiles =[];
      for (let i = 0; i < req.files.length; i++) {
      const {path, originalname} = req.files[i];
      const parts = originalname.split('.');
      const ext = parts [parts.length- 1];
      const newPath = path + '.' + ext;
      fs.renameSync (path, newPath);
      uploadedFiles.push (newPath.replace('uploads/',''));//replaces uploads in the name of file to empty string
      res.json(uploadedFiles);
      }
    })
PORT=4000
  app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))