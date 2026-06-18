import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lista želja mora biti povezana sa korisnikom'],
    unique: true 
  },
  proizvodi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
