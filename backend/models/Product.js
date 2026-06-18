import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: [true, 'Naziv proizvoda je obavezno polje'],
    trim: true
  },
  opis: {
    type: String,
    trim: true
  },
  cena: {
    type: Number,
    required: [true, 'Cena proizvoda je obavezno polje'],
    min: [0, 'Cena ne može biti negativna']
  },
  kategorija: {
    type: String,
    required: [true, 'Kategorija je obavezno polje'],
    trim: true
  },
  zalihe: {
    type: Number,
    required: [true, 'Količina na zalihama je obavezno polje'],
    min: [0, 'Zalihe ne mogu biti negativne'],
    default: 0
  },
  slikaUrl: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
