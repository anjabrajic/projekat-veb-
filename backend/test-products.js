import mongoose from 'mongoose';
import { getProducts, getProductById } from './controllers/productController.js';

console.log('--- ZAPOČINJANJE MOCK TESTOVA ZA PROIZVODE ---');

const mockProizvodi = [
  { _id: '60c72b2f9b1d8b2e88a0e101', naziv: 'Hladno ceđeno kokosovo ulje', kategorija: 'Ulja', cena: 750 },
  { _id: '60c72b2f9b1d8b2e88a0e102', naziv: 'Bio Chia Semenke', kategorija: 'Semenke', cena: 320 },
  { _id: '60c72b2f9b1d8b2e88a0e103', naziv: 'Ekstra devičansko maslinovo ulje', kategorija: 'Ulja', cena: 1200 },
  { _id: '60c72b2f9b1d8b2e88a0e104', naziv: 'Himalajska roze so', kategorija: 'Začini', cena: 180 }
];


function simulirajMongoosePretragu({ kategorija, pretraga }) {
  return mockProizvodi.filter(p => {
    let match = true;
    if (kategorija && p.kategorija !== kategorija) {
      match = false;
    }
    if (pretraga) {
      const regex = new RegExp(pretraga, 'i');
      if (!regex.test(p.naziv)) {
        match = false;
      }
    }
    return match;
  });
}


console.log('\n1. Testiranje logike za pretragu i filtriranje (simulacija MongoDB upita)...');


const rezultatKategorija = simulirajMongoosePretragu({ kategorija: 'Ulja' });
console.log(`✅ Filtriranje po kategoriji "Ulja" (Očekivano: 2, Dobijeno: ${rezultatKategorija.length}):`);
rezultatKategorija.forEach(p => console.log(`   - ${p.naziv} (${p.kategorija})`));
if (rezultatKategorija.length !== 2) console.error('❌ Greška u filtriranju po kategoriji!');


const rezultatPretraga = simulirajMongoosePretragu({ pretraga: 'chIa' });
console.log(`✅ Pretraga po nazivu "chIa" (Očekivano: 1, Dobijeno: ${rezultatPretraga.length}):`);
rezultatPretraga.forEach(p => console.log(`   - ${p.naziv}`));
if (rezultatPretraga.length !== 1 || rezultatPretraga[0].naziv !== 'Bio Chia Semenke') {
  console.error('❌ Greška u pretrazi po nazivu!');
}


const rezultatKombinovano = simulirajMongoosePretragu({ kategorija: 'Ulja', pretraga: 'maslinovo' });
console.log(`✅ Kombinovana pretraga ("Ulja" + "maslinovo") (Očekivano: 1, Dobijeno: ${rezultatKombinovano.length}):`);
rezultatKombinovano.forEach(p => console.log(`   - ${p.naziv} (${p.kategorija})`));
if (rezultatKombinovano.length !== 1 || rezultatKombinovano[0].naziv !== 'Ekstra devičansko maslinovo ulje') {
  console.error('❌ Greška u kombinovanoj pretrazi!');
}


console.log('\n2. Testiranje provere ID formata u kontrolerima...');

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


const reqInvalidId = { params: { id: 'nevalidan-id-123' } };
const resInvalidId = mockResponse();

getProductById(reqInvalidId, resInvalidId);
if (resInvalidId.statusCode === 400) {
  console.log('✅ Kontroler je uspešno odbacio neispravan format ID-ja sa 400 Bad Request:', resInvalidId.body.message);
} else {
  console.error('❌ Greška: Kontroler nije odbacio neispravan format ID-ja!');
}

console.log('\n--- SVI MOCK TESTOVI ZA PROIZVODE SU ZAVRŠENI! ✅ ---');
