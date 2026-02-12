import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { getCulturalInsight, generateProductDescription } from './geminiservice';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = (props: ProductDetailProps) => {
  const { product, onBack, onAddToCart } = props;
  const [insight, setInsight] = useState<string>('');
  const [longDesc, setLongDesc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [i, d] = await Promise.all([
        getCulturalInsight(product.category, product.name),
        generateProductDescription(product.name)
      ]);
      setInsight(i || '');
      setLongDesc(d || product.description);
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 fade-in">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-rose-950 hover:text-rose-700 font-medium group transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery Section */}
        <div className="space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-stone-50 border border-rose-50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="px-4 py-1 bg-rose-100 text-rose-950 text-xs font-bold uppercase tracking-widest rounded-full">
              {product.category}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-rose-950 royal-font mb-6 leading-tight">{product.name}</h1>
          <p className="text-3xl font-light text-rose-700 mb-8">₹{product.price}</p>
          
          <div className="prose prose-rose max-w-none text-stone-600 mb-8 leading-relaxed">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-stone-100 rounded w-3/4"></div>
                <div className="h-4 bg-stone-100 rounded w-full"></div>
                <div className="h-4 bg-stone-100 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="whitespace-pre-line">{longDesc}</div>
            )}
          </div>

          {!loading && insight && (
            <div className="mb-10 p-6 bg-rose-50/50 rounded-2xl border border-rose-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="#800000">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-rose-800 mb-2 flex items-center">
                <span className="mr-2">✨</span> Royal Heritage Insight
              </h4>
              <p className="italic text-rose-950 text-lg leading-relaxed royal-font">
                "{insight}"
              </p>
            </div>
          )}

          <div className="mt-auto space-y-6">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full py-5 bg-rose-950 text-white rounded-2xl text-xl font-bold tracking-widest hover:bg-rose-900 transition-all transform hover:scale-[1.02] shadow-xl"
            >
              ADD TO ROYAL BAG
            </button>
            
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-rose-100 text-center">
              <div>
                <p className="text-xs font-bold text-rose-950 uppercase mb-1">Authentic</p>
                <p className="text-[10px] text-stone-500 tracking-tighter">Certified Craft</p>
              </div>
              <div className="border-x border-rose-50">
                <p className="text-xs font-bold text-rose-950 uppercase mb-1">Handmade</p>
                <p className="text-[10px] text-stone-500 tracking-tighter">Artisan Crafted</p>
              </div>
              <div>
                <p className="text-xs font-bold text-rose-950 uppercase mb-1">Heritage</p>
                <p className="text-[10px] text-stone-500 tracking-tighter">Generational Art</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;