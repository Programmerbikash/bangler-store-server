const express = require('express')
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const cors = require('cors');
require('dotenv').config();
const { Schema } = mongoose;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded ({ extended: true }));

// create schema
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// create banner model
const Banner = mongoose.model("bannerimgs", bannerSchema);

// create schema
const signUpSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    // trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  }
});

// create banner model
const SignUp = mongoose.model("signupinfos", signUpSchema);

// create schema
const categorySchema = new mongoose.Schema({
  category_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// create banner model
const Category = mongoose.model("categories", categorySchema);

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('strictQuery', true);
    const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.ik3p7tj.mongodb.net/?retryWrites=true`
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("db is connected")
  } catch (error) {
    console.log("db is not connected");
    console.log(error)
  }
}

app.post('/banners', async (req, res) => {
    try {
        // get data from request body
        const title = req.body.title;
        const subTitle = req.body.subTitle;
        const url = req.body.url;
        // res.status(201).send({ title, subTitle, url });

        const newProduct = new Banner({
            title,
            subTitle,
            url
        })
      const productData = await newProduct.save();
      // const productData2 = await newProduct.insertMany([
      // {
      //     title: "title name",
      //   url: "image"
      // },
      // {
      //     title: "title name",
      //   url: "image"
      // }
      // ]);

        res.status(201).send(productData);

    } catch (error) {
        // res.status(500).send({ message: error.message });
    }
})

app.post('/users', async (req, res) => {
  try {
        // get data from request body
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
      
        // res.status(201).send({ title, price, description });

        const userInfos = new SignUp({
            firstName,
            lastName,
            email,
            password: hash
        })
      
        const productData = await userInfos.save();

        res.status(201).send(productData);

  } catch (error) {
    // console.log(error)
        res.status(500).send({ message: error.message });
    }
})

app.post("/signIn", async (req, res) => {
  try {
    const email = await SignUp.findOne({ email: req.body.email });
      // console.log(email);
      if (email) {
        const cmp = await bcrypt.compare(req.body.password, email.password);
        if (cmp) {
          //   ..... further code to maintain authentication like jwt or sessions
          res.json("Auth Successful");
        } else {
          res.send("Wrong email or password.");
        }
      } else {
        res.send("Wrong email or password.");
      }

    // const email = req.body.email;
    // const password = req.body.password;
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(password, salt);
    // const useremail = await SignUp.findOne({ email: email })
    // const result = bcrypt.compareSync(password, hash);
    //   if (result){
    //     // console.log(password);
    //     return res.json("success");
    //   } else {
    //     return res.send("Bad request. Password don't match ");
    //   }
      
    // if (useremail.password === password) {
    //   res.status(201).send("index");
    // } else {
    //   res.send("password are not matching");
    // }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
  
});

app.post('/category', async (req, res) => {
  try {
    const category_id = req.body.category_id;
    const title = req.body.title;
    const url = req.body.url;
    const categoriesData = new SignUp({
      category_id,
      title,
      url
    })
    // console.log(categoriesData)
      const productData = await Category.insertMany([
        {
          category_id: 1,
          title: "Mens new style Winter Casual Outwear Jackets 2022 Arika",
          url: "http://i.ibb.co/jD3Grtp/image.png"
      },
      {
          category_id: 2,
          title: "Men's Slim Fit Casual One-Button Suit Coat Jacket Formal Business Blazers",
          url: "http://i.ibb.co/7V33p8c/image.png"
      },
      {
          category_id: 3,
          title: "Stylish Denim Jeans Pant For Men",
          url: "http://i.ibb.co/RP4VgcV/image.png"
      },
      {
          category_id: 4,
          title: "Stylish Long Sleeve Casual Shirt For Man - Shirt For Men - Shirt",
          url: "http://i.ibb.co/ZXWzZDR/image.png"
      },
      {
          category_id: 5,
          title: "Maroon Jacquard Fashion Design Front-Open Sweater for Women",
          url: "https://i.ibb.co/3vDjgKV/image.png"
      }
        ]);

      res.status(201).send(productData);
      // console.log(productData);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

app.get("/banners", async (req, res) => {
    try {
        const banner = await Banner.find();
        if (banner) {
            res.status(200).send(banner);
        } else {
            res.status(404).send({
                message: "name not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

app.get("/category", async (req, res) => {
    try {
        const categoriesData = await Category.find();
        if (categoriesData) {
            res.status(200).send(categoriesData);
        } else {
            res.status(404).send({
                message: "Products not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

app.get('/', (req, res) => {
  res.send('Bangler Big Store is running!')
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await connectDB();
})