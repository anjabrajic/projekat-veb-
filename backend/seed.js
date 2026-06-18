import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Wishlist from './models/Wishlist.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthy-food-store';

const productsData = [
  {
    naziv: 'Hladno ceđeno kokosovo ulje',
    opis: 'Ekstra devičansko organsko kokosovo ulje, 500ml. Bogato je zasićenim masnim kiselinama srednjeg lanca (MCFA), koje se u organizmu brzo vare i pretvaraju u energiju umesto da se skladište u masno tkivo. Može se koristiti za kuvanje, pečenje ili negu.',
    cena: 750,
    kategorija: 'Ulja',
    zalihe: 25,
    slikaUrl: '/images/kokos_ulje.png'
  },
  {
    naziv: 'Bio Chia Semenke',
    opis: 'Bogate omega-3 masnim kiselinama, 250g. Chia semenke su superhrana bogata vlaknima, proteinima i esencijalnim mineralima. U dodiru sa tečnošću formiraju gel koji produžava osećaj sitosti i pomaže hidrataciju organizma.',
    cena: 320,
    kategorija: 'Semenke',
    zalihe: 100,
    slikaUrl: '/images/chia_semenke.png'
  },
  {
    naziv: 'Ekstra devičansko maslinovo ulje',
    opis: 'Hladno ceđeno u Grčkoj, 1L. Maslinovo ulje vrhunskog kvaliteta dobijeno direktno iz plodova masline isključivo mehaničkim putem. Bogato je mononezasićenim mastima i antioksidansima. Savršeno za salate i kuvanje.',
    cena: 1200,
    kategorija: 'Ulja',
    zalihe: 15,
    slikaUrl: '/images/maslinovo_ulje.png'
  },
  {
    naziv: 'Himalajska roze so',
    opis: 'Fino mlevena, čista i nerafinisana, 500g. Himalajska roze so je nastala isparavanjem pradavnih mora duboko u Himalajima. Sadrži preko 80 minerala u tragovima koji joj daju karakterističnu roze boju i bogatiji ukus.',
    cena: 180,
    kategorija: 'Začini',
    zalihe: 50,
    slikaUrl: '/images/himalajska_so.png'
  },
  {
    naziv: 'Organska kurkuma u prahu',
    opis: 'Zlatni indijski začin, moćan antioksidans, 100g. Kurkuma u prahu ima snažno protivupalno dejstvo i široku primenu u kulinarstvu i tradicionalnoj medicini. Može se koristiti za začinjavanje jela ili pravljenje zlatnog mleka.',
    cena: 450,
    kategorija: 'Začini',
    zalihe: 40,
    slikaUrl: '/images/kurkuma.png'
  },
  {
    naziv: 'Cejlonski cimet u prahu',
    opis: 'Pravi cejlonski cimet izuzetnog mirisa i ukusa, 100g. Cejlonski cimet je poznat po svojim brojnim lekovitim svojstvima. Pomaže u regulaciji šećera u krvi i savršen je dodatak kašama, kolačima i toplim napicima.',
    cena: 380,
    kategorija: 'Začini',
    zalihe: 35,
    slikaUrl: '/images/cimet.png'
  },
  {
    naziv: 'Organsko laneno seme',
    opis: 'Smeđe laneno seme iz organskog uzgoja, 250g. Bogato je vlaknima, lignanima i omega-3 masnim kiselinama. Preporučuje se mlevenje pre konzumacije radi lakše apsorpcije nutrijenata.',
    cena: 150,
    kategorija: 'Semenke',
    zalihe: 60,
    slikaUrl: '/images/laneno_seme.png'
  },
  {
    naziv: 'Oljušteno seme konoplje',
    opis: 'Semenke konoplje izuzetne nutritivne vrednosti, 200g. Sadrže savršen odnos omega-3 i omega-6 masnih kiselina i predstavljaju kompletan izvor proteina sa svim esencijalnim aminokiselinama.',
    cena: 550,
    kategorija: 'Semenke',
    zalihe: 30,
    slikaUrl: '/images/seme_konoplje.png'
  },
  {
    naziv: 'Organski đumbir u prahu',
    opis: 'Fino mleveni sušeni koren đumbira, 100g. Poznat po svom ljutkastom ukusu i zagrevajućem dejstvu. Odličan je za imunitet, protiv mučnine, i kao začin za čajeve i jela.',
    cena: 280,
    kategorija: 'Začini',
    zalihe: 45,
    slikaUrl: '/images/djumbir.png'
  },
  {
    naziv: 'Sirovi indijski orah',
    opis: 'Kvalitetan sirovi indijski orah, 250g. Kremaste teksture i blagog ukusa, bogat je zdravim mastima, proteinima, i mineralima poput magnezijuma i bakra. Idealan za zdrave namaze i sireve.',
    cena: 950,
    kategorija: 'Orašasti plodovi',
    zalihe: 20,
    slikaUrl: '/images/indijski_orah.png'
  },
  {
    naziv: 'Organske urme (datulje)',
    opis: 'Prirodno slatke urme bez dodatih šećera i konzervansa, 250g. Zovu ih "najzdravije voće na planeti" jer su bogate vlaknima, kalijumom i antioksidansima. Savršena prirodna zamena za slatkiše.',
    cena: 420,
    kategorija: 'Sušeno voće',
    zalihe: 25,
    slikaUrl: '/images/urme.png'
  }
];

async function seedDatabase() {
  console.log('--- SEEDING MONGO DB ---');
  console.log(`Povezivanje na: ${MONGO_URI}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Konekcija uspešna.');

    
    console.log('Čišćenje proizvoda, porudžbina i lista želja...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Wishlist.deleteMany({});
    console.log('Stari podaci očišćeni.');

    console.log('Unos novih proizvoda sa slikama...');
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Uspešno dodato ${createdProducts.length} proizvoda u bazu!`);

    console.log('--- SEEDING ZAVRŠEN USPEŠNO! ✅ ---');
  } catch (error) {
    console.error('Greška tokom seeding-a:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Konekcija zatvorena.');
  }
}

seedDatabase();
