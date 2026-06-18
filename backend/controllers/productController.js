import mongoose from 'mongoose';
import Product from '../models/Product.js';


const getProducts = async (req, res) => {
  try {
    const { kategorija, pretraga } = req.query;
    const queryObj = {};

   
    if (kategorija) {
      queryObj.kategorija = kategorija;
    }

    
    if (pretraga) {
      queryObj.naziv = { $regex: pretraga, $options: 'i' };
    }

    const products = await Product.find(queryObj);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevalidan format ID-ja proizvoda' });
    }

    const product = await Product.findById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Proizvod nije pronađen' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createProduct = async (req, res) => {
  try {
    const { naziv, opis, cena, kategorija, zalihe, slikaUrl } = req.body;

    
    if (!naziv || cena === undefined || !kategorija) {
      return res.status(400).json({ message: 'Molimo unesite obavezna polja (naziv, cena, kategorija)' });
    }

    const product = new Product({
      naziv,
      opis,
      cena,
      kategorija,
      zalihe: zalihe || 0,
      slikaUrl: slikaUrl || ''
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv, opis, cena, kategorija, zalihe, slikaUrl } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevalidan format ID-ja proizvoda' });
    }

    const product = await Product.findById(id);

    if (product) {
      product.naziv = naziv !== undefined ? naziv : product.naziv;
      product.opis = opis !== undefined ? opis : product.opis;
      product.cena = cena !== undefined ? cena : product.cena;
      product.kategorija = kategorija !== undefined ? kategorija : product.kategorija;
      product.zalihe = zalihe !== undefined ? zalihe : product.zalihe;
      product.slikaUrl = slikaUrl !== undefined ? slikaUrl : product.slikaUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Proizvod nije pronađen' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Provera validnosti ID-ja
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Nevalidan format ID-ja proizvoda' });
    }

    const product = await Product.findById(id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Proizvod je uspešno obrisan' });
    } else {
      res.status(404).json({ message: 'Proizvod nije pronađen' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
