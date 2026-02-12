import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  onSelectCategory: (category: Category) => void;
  onExploreMore: () => void;
}

const categories = [
  { id: Category.CLOTHES, name: 'Clothes', icon: '/assets/clothes.jfif', color: 'from-pink-100 to-red-100', border: 'border-red-400' },
  { id: Category.JEWELLERY, name: 'Jewellery', icon: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', color: 'from-yellow-100 to-amber-100', border: 'border-yellow-400' },
  { id: Category.FLOWER_TEA, name: 'Flower Tea', icon: '/assets/flower-tea.jpeg', color: 'from-purple-100 to-pink-100', border: 'border-purple-400' },
  { id: Category.HOME_DECOR, name: 'Home Decor', icon: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', color: 'from-green-100 to-teal-100', border: 'border-green-400' }
];

const Categories: React.FC<CategoriesProps> = (props: CategoriesProps) => {
  const { onSelectCategory, onExploreMore } = props;

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-amber-950 mb-4 tracking-wider">EXPLORE CATEGORIES</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-amber-700"></div>
            <p className="text-amber-700 text-lg font-light">Discover our curated collection</p>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-amber-700"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as Category)}
              className={`group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 ${cat.border} bg-gradient-to-br ${cat.color}`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id={`pattern-${cat.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="#92400e" />
                      <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="#92400e" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#pattern-${cat.id})`} />
                </svg>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4 group-hover:gap-2 transition-all">
                <img 
                  src={cat.icon} 
                  alt={cat.name}
                  className="w-32 h-32 object-cover rounded-lg mb-4 group-hover:scale-125 transition-transform duration-300 shadow-md"
                />
                <h3 className="text-2xl font-bold text-amber-950">{cat.name}</h3>
                <p className="text-sm text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity">Click to explore</p>
              </div>
            </button>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="flex justify-center">
          <button
            onClick={onExploreMore}
            className="px-12 py-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 tracking-widest uppercase"
          >
            Explore All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
