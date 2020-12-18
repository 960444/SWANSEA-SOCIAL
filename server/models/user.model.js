import mongoose from 'mongoose'
import crypto from 'crypto'

const Schema = mongoose.Schema

//Define a user model
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Invalid email address provided'],
        required: 'Email is required'
    },
    course: {
        type: String,
        trim: true,
        required: 'Course is required'
    },
    year: {
        type: String,
        required: 'Year of study is required'
    },
    hashed_password: {
        type: String,
        required: 'Passsword is required'
    },
    salt: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})

//Encrypt and set hashed password
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

//Validate password
UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this._password && this._password.length > 64) {
        this.invalidate('password', 'Password must be less than 65 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required.')
    }
    if (this._password.search(/\d/) == -1 
        || this._password.search(/[a-zA-Z]/) == -1) {
        this.invalidate('password', 'Password must be a combination of letters and numbers.')  
    
    }
  }, null)
  
//Create model methods
UserSchema.methods = {
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
      if (!password) return ''
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex')
      } catch (err) {
        return ''
      }
    },
    makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + ''
    }
  }

export default mongoose.model('User', UserSchema)