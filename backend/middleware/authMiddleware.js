import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const protect = async (req, res, next) => {
  let token;

 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-lozinka');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Autorizacija neuspešna: Korisnik ne postoji u sistemu' });
      }

      next();
    } catch (error) {
      console.error('Greška pri verifikaciji tokena:', error.message);
      return res.status(401).json({ message: 'Autorizacija neuspešna: Token nije ispravan ili je istekao' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Autorizacija neuspešna: Token nije poslat u zaglavlju' });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.uloga === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Pristup zabranjen: Zahtevaju se admin privilegije' });
  }
};

export { protect, admin };
