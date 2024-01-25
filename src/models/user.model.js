import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      typpe: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      index: true,
    },

    email: {
      typpe: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    fullName: {
      typpe: String,
      required: true,
      trim: true,
    },
    avatar: {
      typpe: String, //cloudinary url
      required: true,
    },

    coverImage: {
      typpe: String, //cloudinary url
    },

    watchHistory: [
      {
        typpe: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      typpe: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      typpe: String,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)

}

userSchema.methods.generateAccessToken = function() {
   return Jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return Jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPRIY
        }
    )
}

export const User = mongoose.model("User", userSchema);
