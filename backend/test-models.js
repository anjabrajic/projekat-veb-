import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Wishlist from './models/Wishlist.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthy-food-store-test';

async function runTests() {
  console.log('--- ZAPOČINJANJE TESTIRANJA MONGOOSE MODELA ---');
  console.log(`Povezivanje na bazu: ${MONGO_URI}`);
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Povezan na MongoDB bazu podataka.');

    
    console.log('\n1. Čišćenje baze...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Wishlist.deleteMany({});
    console.log('Baza je uspešno očišćena.');

   
    console.log('\n2. Kreiranje test korisnika...');
    const testKorisnik = new User({
      ime: 'Marko Marković',
      email: 'marko@example.com',
      lozinka: 'sigurnafraza123',
      uloga: 'registered'
    });
    
    await testKorisnik.save();
    console.log('Korisnik kreiran uspešno!');
    console.log(`- ID Korisnika: ${testKorisnik._id}`);
    console.log(`- Heširana Lozinka: ${testKorisnik.lozinka}`);
    
    
    const tacnaLozinka = await testKorisnik.comparePassword('sigurnafraza123');
    const pogresnaLozinka = await testKorisnik.comparePassword('netacnasifra');
    console.log(`- Provera lozinke (tačna): ${tacnaLozinka ? 'USPEŠNA ✅' : 'NEUSPEŠNA ❌'}`);
    console.log(`- Provera lozinke (pogrešna): ${!pogresnaLozinka ? 'USPEŠNA (odbijena) ✅' : 'NEUSPEŠNA (prihvaćena) ❌'}`);

  
    console.log('\n3. Kreiranje test proizvoda...');
    const proizvod1 = await Product.create({
      naziv: 'Hladno ceđeno kokosovo ulje',
      opis: 'Ekstra devičansko organsko kokosovo ulje, 500ml',
      cena: 750,
      kategorija: 'Ulja',
      zalihe: 25,
      slikaUrl: 'https://example.com/kokos-ulje.jpg'
    });

    const proizvod2 = await Product.create({
      naziv: 'Bio Chia Semenke',
      opis: 'Bogate omega-3 masnim kiselinama, 250g',
      cena: 320,
      kategorija: 'Semenke',
      zalihe: 100,
      slikaUrl: 'https://example.com/chia-semenke.jpg'
    });

    console.log(`Proizvodi kreirani:`);
    console.log(`- Proizvod 1: ${proizvod1.naziv} (${proizvod1.cena} RSD)`);
    console.log(`- Proizvod 2: ${proizvod2.naziv} (${proizvod2.cena} RSD)`);

    
    console.log('\n4. Kreiranje test porudžbine...');
    const testPorudzbina = await Order.create({
      korisnik: testKorisnik._id,
      stavke: [
        { proizvod: proizvod1._id, kolicina: 2, cena: proizvod1.cena },
        { proizvod: proizvod2._id, kolicina: 1, cena: proizvod2.cena }
      ],
      ukupnaCena: (proizvod1.cena * 2) + proizvod2.cena,
      statusPlacanja: true
    });

    console.log('Porudžbina kreirana uspešno!');
    console.log(`- Ukupna cena: ${testPorudzbina.ukupnaCena} RSD`);
    console.log(`- Status plaćanja: ${testPorudzbina.statusPlacanja ? 'Plaćeno' : 'Nije plaćeno'}`);
    console.log(`- Broj stavki: ${testPorudzbina.stavke.length}`);

   
    const ucitanaPorudzbina = await Order.findById(testPorudzbina._id)
      .populate('korisnik', 'ime email')
      .populate('stavke.proizvod', 'naziv cena');
    
    console.log('\nProvera popunjavanja (populate) referenci u porudžbini:');
    console.log(`- Kupac: ${ucitanaPorudzbina.korisnik.ime} (${ucitanaPorudzbina.korisnik.email})`);
    ucitanaPorudzbina.stavke.forEach((stavka, index) => {
      console.log(`  * Stavka ${index + 1}: ${stavka.proizvod.naziv} - Količina: ${stavka.kolicina}, Cena po komadu: ${stavka.cena} RSD`);
    });

    
    console.log('\n5. Kreiranje test liste želja...');
    const testListaZelja = await Wishlist.create({
      korisnik: testKorisnik._id,
      proizvodi: [proizvod1._id, proizvod2._id]
    });

    console.log('Lista želja kreirana uspešno!');
    
    const ucitanaListaZelja = await Wishlist.findOne({ korisnik: testKorisnik._id })
      .populate('proizvodi', 'naziv cena');

    console.log(`- Korisnik: ${testKorisnik.ime}`);
    console.log('- Proizvodi u listi želja:');
    ucitanaListaZelja.proizvodi.forEach(proizvod => {
      console.log(`  * ${proizvod.naziv} (${proizvod.cena} RSD)`);
    });

    console.log('\n--- SVE PROVERE SU USPEŠNO ZAVRŠENE! ✅ ---');
  } catch (error) {
    console.error('\n❌ Greška prilikom testiranja modela:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nKonekcija sa bazom je zatvorena.');
  }
}

runTests();
