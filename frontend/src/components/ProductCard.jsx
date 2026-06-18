import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, added, isInWishlist, onToggleWishlist, isLoggedIn }) => {
  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col h-full">
      
      <div className="relative h-48 overflow-hidden bg-gray-50 dark:bg-gray-800">
        {product.slikaUrl ? (
          <img
            src={product.slikaUrl}
            alt={product.naziv}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {product.kategorija === 'Ulja' ? '🥥' : product.kategorija === 'Semenke' ? '🌾' : product.kategorija === 'Začini' ? '🌶️' : product.kategorija === 'Orašasti plodovi' ? '🌰' : '🍇'}
          </div>
        )}

       
        <span className="absolute top-3 left-3 bg-white/80 dark:bg-gray-900/85 backdrop-blur-md text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
          {product.kategorija}
        </span>

        
        {isLoggedIn && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/85 backdrop-blur-md shadow-sm hover:bg-white dark:hover:bg-gray-850 hover:scale-110 transition-all duration-300 border border-white/20"
            title={isInWishlist ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        )}
      </div>

      
      <div className="p-5 flex flex-col flex-grow text-left">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.naziv}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {product.opis}
        </p>

        
        <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-50 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 dark:text-gray-500">Cena</span>
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-400">
              {product.cena} RSD
            </span>
          </div>
          
          <Link
            to={`/product/${product._id}`}
            state={{ product }}
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-350 transition-colors duration-200"
          >
            Detaljnije →
          </Link>
        </div>

        
        {isLoggedIn ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            disabled={product.zalihe === 0}
            className={`w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${
              product.zalihe === 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white shadow-green-100 dark:shadow-none'
                : 'bg-emerald-800 hover:bg-emerald-600 text-white shadow-emerald-50 dark:shadow-none hover:shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check size={18} />
                <span>Dodato!</span>
              </>
            ) : product.zalihe === 0 ? (
              <span>Nema na stanju</span>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Dodaj u korpu</span>
              </>
            )}
          </button>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-850/50 rounded-2xl p-2.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800/40">
            🔑 Prijavite se za kupovinu
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
