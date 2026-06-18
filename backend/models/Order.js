import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  proizvod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Proizvod je obavezan deo stavke']
  },
  kolicina: {
    type: Number,
    required: [true, 'Količina je obavezno polje'],
    min: [1, 'Količina mora biti najmanje 1']
  },
  cena: {
    type: Number,
    required: [true, 'Cena stavke je obavezno polje'],
    min: [0, 'Cena ne može biti negativna']
  }
}, { _id: false }); // Onemogućavamo poseban _id za stavke unutar porudžbine radi čistoće baze

const orderSchema = new mongoose.Schema({
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Porudžbina mora biti povezana sa korisnikom']
  },
  stavke: {
    type: [orderItemSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Porudžbina mora imati bar jednu stavku'
    }
  },
  ukupnaCena: {
    type: Number,
    required: [true, 'Ukupna cena je obavezno polje'],
    min: [0, 'Ukupna cena ne može biti negativna']
  },
  statusPlacanja: {
    type: Boolean,
    required: true,
    default: false
  },
  datum: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
