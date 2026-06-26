import Order from '../models/Order.js';
import Product from '../models/Product.js';


const createOrder = async (req, res) => {
  const { stavke, ukupnaCena, statusPlacanja } = req.body;

  try {
    
    if (!stavke || stavke.length === 0) {
      return res.status(400).json({ message: 'Porudžbina mora imati bar jednu stavku' });
    }

   
    for (const item of stavke) {
      const product = await Product.findById(item.proizvod);
      
      if (!product) {
        return res.status(404).json({ message: `Proizvod nije pronađen` });
      }

      if (product.zalihe < item.kolicina) {
        return res.status(400).json({
          message: `Nema dovoljno zaliha za proizvod "${product.naziv}". Na stanju je: ${product.zalihe} kom, a vi želite: ${item.kolicina} kom.`
        });
      }
    }

    
    const order = new Order({
      korisnik: req.user._id, 
      stavke,
      ukupnaCena,
      statusPlacanja: statusPlacanja || false
    });

    const createdOrder = await order.save();

    
    for (const item of stavke) {
      await Product.findByIdAndUpdate(item.proizvod, {
        $inc: { zalihe: -item.kolicina } 
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// za admina da vidi sve porudzbine
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('korisnik', 'ime email')
      .populate('stavke.proizvod', 'naziv cena')
      .sort({ datum: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, getOrders };
