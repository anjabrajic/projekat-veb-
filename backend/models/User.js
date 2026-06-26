import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  ime: {
    type: String,
    required: [true, 'Ime je obavezno polje'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email je obavezno polje'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Molimo unesite validnu email adresu']
  },
  lozinka: {
    type: String,
    required: [true, 'Lozinka je obavezno polje'],
    minlength: [6, 'Lozinka mora imati najmanje 6 karaktera']
  },
  uloga: {
    type: String,
    enum: {
      values: ['guest', 'registered', 'admin'],
      message: 'Uloga može biti samo guest, registered ili admin'
    },
    default: 'registered'
  }
}, {
  timestamps: true
});


userSchema.pre('save', async function(next) {
 
  if (!this.isModified('lozinka')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.lozinka = await bcrypt.hash(this.lozinka, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.lozinka);
};

const User = mongoose.model('User', userSchema);

export default User;
