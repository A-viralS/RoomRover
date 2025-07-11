const express = require('express')
require("dotenv").config()
const cors=require('cors')
const app=express();
const path=require('path')
const User= require('./models/User')
const Place=require('./models/Place')
const Booking=require('./models/Booking')
const bcrypt = require('bcryptjs');
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const imageDownloader=require('image-downloader')
const {S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs=require('fs')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret= "secret"
const mime=require('mime-types')

const bucket = 'room-rover-new';

app.use(cookieParser())
const testPath=__dirname+'/uploads'
console.log(testPath);
app.use(express.static(path.resolve(testPath)));

app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'  // ✅ replace with your real frontend domain
  ]
}));
  
  app.use(express.json())
  app.get('/test', (req,res)=>{
    mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
    res.json('test ok ')
  })
  app.post('/api/register',async (req,res)=>{
    mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
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

  app.post('/api/login',async (req,res)=>{
    mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))

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

    app.get('/api/profile',(req,res)=>{
      
    
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


    app.post('/api/logout',(req,res)=>{
      mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
      res.cookie('token','').json(true);//sets the cookie as empty
    })


    app.post('/api/upload-by-link', async (req,res)=>{
      mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
      const {link}=req.body
      const newName='photo'+Date.now()+'.jpg'
     await imageDownloader.image({
        url:link,
        dest: '/tmp/'+newName
      })
      const url= await uploadToS3('/tmp/'+newName,newName,mime.lookup('/tmp'+newName))
      res.json(url)
    });




//UPALOD TO S3 

function getRegionFromArn(arn) {
  
  const arnParts = arn.split(":");
  if (arnParts.length >= 4) {
    return arnParts[3];
  }
  return null; // Unable to determine the region
}

const arn = "arn:aws:iam::202593618591:user/room-rover";
const region = getRegionFromArn(arn);

console.log(region);

async function uploadToS3(path, originalname, mimetype) {
  try {
    const client = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;

    const data = await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
  //  ACL: 'public-read'
    }));

    console.log("S3 Upload Success:", data);
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
    // return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw err; // propagate error to caller
  }
}

const photoMiddleware=multer({dest:'/tmp'});

   app.post('/api/upload', photoMiddleware.array('photos', 100), async (req, res) => {
  try {
 mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))

    const uploadedFiles = [];
    console.log("req.files", req.files);

    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
    }

    res.json(uploadedFiles);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});


    app.post('/api/places', (req,res) => {
      mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
      
      const {token} = req.cookies;
      const {
        title,address,addedPhotos,description,price,
        perks,extraInfo,checkIn,checkOut,maxGuests,
      } = req.body;
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
          owner:userData.id,
          price,title,address,
          photos:addedPhotos,
          description,perks,extraInfo,checkIn,checkOut,maxGuests,
        });
        res.json(placeDoc);
      });
    });

app.get('/api/user-places', async (req,res)=>{
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  const {token}=req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) =>  {
    if (err) throw err;
    const {id}=userData
    const places = await Place.find({owner:id});
    res.json(places);

  })
})

app.get('/api/places/:id',async(req,res)=>{
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  const {id}=req.params;
  res.json(await Place.findById(id))

})

app.put('/api/places', async (req,res) => {

  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/api/places',async(req,res)=>{
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  const places=await Place.find()
  res.json(places)
})

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}
app.post('/api/bookings', async (req, res) => {
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

// app.get('/bookings', async (req, res) => {
//   mongoose.connect(process.env.MONGO_URL);
//   const userData = await getUserDataFromReq(req);
//   const bookings = await Booking.find({user:userData.id});
//   res.json(bookings);
// })
app.get('/api/bookings', async (req,res) => {
  mongoose
  .connect(process.env.MONGO_URL)
  .then(e=>console.log("mongoDB connected"))
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

PORT= process.env.PORT || 4000
  app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))