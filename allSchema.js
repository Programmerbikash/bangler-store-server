import mongoose from "mongoose";
const { Schema } = mongoose;

export const bannerSchema = new mongoose.Schema({
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

export const Banner = mongoose.model("bannerimgs", bannerSchema);

export const signUpSchema = new mongoose.Schema({
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