const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a valid email'],
    minLength: 3,
    maxLength: 50,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    trim: true,
    minLength: 11,
    maxLength: 11,
    index: true,
    unique: true
  },
  address: {
    type: String,
    lowercase: true
  },
  role: {
    type: String,
    enum: ["super-admin","admin", "user"],
    default: "user",
    required: [true, "Please specify the role of this user"]
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate:{
      validator: function(val) {
        return val === this.password;
      },
      message: "Password and confirm password do not match"
    }
  },
  passwordChangedAt: Date,

},{
  timestamps: true
});

userSchema.pre('save', async function() {
  if(!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.validatePassword = async function(pswd, DBPswd) {
  return await bcrypt.compare(pswd, DBPswd);
};

userSchema.methods.checkPswdChange = function (iat) {
  if(this.passwordChangedAt) {
    const passwordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return iat < passwordChangedAt
  };
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;