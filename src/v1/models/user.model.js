const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  hash: String,
  salt: String,
}, {
  timestamps: true,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.validateJWT = function (token) {
  try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded, this._id);
    return decoded.id === this._id;
  } catch (e) {
    return false;
  }
};

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      sub: this._id,
      name: this.name,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    secret
  );
};

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    role: this.role,
    accessToken: this.generateJWT(),
  }
};

module.exports = mongoose.model('User', userSchema);