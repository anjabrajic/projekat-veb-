import express from 'express';
import { registerUser, authUser, getUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', registerUser);


router.post('/login', authUser);


router.get('/profile', protect, getUserProfile);


router.get('/admin-only', protect, admin, (req, res) => {
  res.json({
    message: 'Dobrodošli u admin panel! Uspešno ste prošli verifikaciju uloge.',
    adminKorisnik: {
      id: req.user._id,
      ime: req.user.ime,
      email: req.user.email,
      uloga: req.user.uloga
    }
  });
});

export default router;
