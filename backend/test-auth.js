import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { protect, admin } from './middleware/authMiddleware.js';

dotenv.config();


process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_tajni_kljuc_123';

console.log('--- ZAPOČINJANJE MOCK TESTOVA ZA AUTENTIFIKACIJU ---');


const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};


console.log('\n1. Testiranje JWT generisanja i verifikacije...');
try {
  const payload = { id: 'mock_user_id_123', uloga: 'admin' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('✅ Token uspešno kreiran:', token);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token uspešno verifikovan. Sadržaj:', decoded);
  
  if (decoded.id === payload.id && decoded.uloga === payload.uloga) {
    console.log('   -> Sadržaj tokena je ispravan! (ID i Uloga se poklapaju)');
  } else {
    throw new Error('Podaci u tokenu se ne poklapaju sa originalnim payload-om.');
  }
} catch (error) {
  console.error('❌ Greška prilikom testiranja JWT-a:', error.message);
}


console.log('\n2. Testiranje "admin" middleware-a...');


const reqUser = { user: { ime: 'Marko', uloga: 'registered' } };
const resUser = mockResponse();
let nextCalledForUser = false;

admin(reqUser, resUser, () => {
  nextCalledForUser = true;
});

if (!nextCalledForUser && resUser.statusCode === 403) {
  console.log('✅ Uspešno blokiran običan korisnik (Vraćen status 403):', resUser.body.message);
} else {
  console.error('❌ Greška: Običan korisnik je prošao admin proveri ili nije dobio 403!');
}


const reqAdmin = { user: { ime: 'Ana Admin', uloga: 'admin' } };
const resAdmin = mockResponse();
let nextCalledForAdmin = false;

admin(reqAdmin, resAdmin, () => {
  nextCalledForAdmin = true;
});

if (nextCalledForAdmin) {
  console.log('✅ Uspešno odobren pristup za korisnika sa ulogom "admin" (next() pozvan).');
} else {
  console.error('❌ Greška: Adminu je blokiran pristup!');
}


console.log('\n3. Testiranje "protect" middleware-a (bez tokena)...');
const reqNoToken = { headers: {} };
const resNoToken = mockResponse();
let nextCalledNoToken = false;

protect(reqNoToken, resNoToken, () => {
  nextCalledNoToken = true;
});

if (!nextCalledNoToken && resNoToken.statusCode === 401) {
  console.log('✅ Uspešno prepoznat nedostatak tokena (Vraćen status 401):', resNoToken.body.message);
} else {
  console.error('❌ Greška: Prošao zahtev bez tokena!');
}

console.log('\n--- SVI MOCK TESTOVI SU ZAVRŠENI! ✅ ---');
