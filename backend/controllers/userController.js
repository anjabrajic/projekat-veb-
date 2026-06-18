import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateToken = (id, uloga) => {
  return jwt.sign({ id, uloga }, process.env.JWT_SECRET, {
    expiresIn: '30d' 
  });
};


const registerUser = async (req, res) => {
  const { ime, email, lozinka, uloga } = req.body;

  try {
    
    if (!ime || !email || !lozinka) {
      return res.status(400).json({ message: 'Molimo unesite sva obavezna polja (ime, email, lozinka)' });
    }

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Korisnik sa ovim email-om već postoji' });
    }

    
    const user = await User.create({
      ime,
      email,
      lozinka,
      uloga: uloga || 'registered' 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        ime: user.ime,
        email: user.email,
        uloga: user.uloga,
        token: generateToken(user._id, user.uloga)
      });
    } else {
      res.status(400).json({ message: 'Neispravni podaci o korisniku' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const authUser = async (req, res) => {
  const { email, lozinka } = req.body;

  try {
    
    if (!email || !lozinka) {
      return res.status(400).json({ message: 'Molimo unesite email i lozinku' });
    }

    
    const user = await User.findOne({ email });

    
    if (user && (await user.comparePassword(lozinka))) {
      res.json({
        _id: user._id,
        ime: user.ime,
        email: user.email,
        uloga: user.uloga,
        token: generateToken(user._id, user.uloga)
      });
    } else {
      res.status(401).json({ message: 'Neispravan email ili lozinka' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, authUser, getUserProfile };
