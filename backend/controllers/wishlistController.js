import Wishlist from '../models/Wishlist.js';


const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ korisnik: req.user._id }).populate('proizvodi');
    
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        korisnik: req.user._id,
        proizvodi: []
      });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addToWishlist = async (req, res) => {
  const { proizvodId } = req.body;

  if (!proizvodId) {
    return res.status(400).json({ message: 'Molimo prosledite ID proizvoda' });
  }

  try {
    let wishlist = await Wishlist.findOne({ korisnik: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        korisnik: req.user._id,
        proizvodi: []
      });
    }

    
    if (wishlist.proizvodi.includes(proizvodId)) {
      return res.status(400).json({ message: 'Proizvod je već u listi želja' });
    }

    wishlist.proizvodi.push(proizvodId);
    await wishlist.save();

    
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('proizvodi');
    res.status(201).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ korisnik: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Lista želja nije pronađena' });
    }

    
    wishlist.proizvodi = wishlist.proizvodi.filter(id => id.toString() !== productId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('proizvodi');
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
