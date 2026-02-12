import React from 'react';
import { Category } from './types';

interface CategorySectionProps {
  onSelectCategory: (category: Category) => void;
  onExploreMore: () => void;
}

const categories = [
  { 
    id: Category.CLOTHES, 
    title: 'Clothes', 
    img: '/assets/clothes.jfif',
    desc: 'Timeless Bandhani & Poshaks' 
  },
  { 
    id: Category.JEWELLERY, 
    title: 'Jewellery', 
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    desc: 'Kundan & Meenakari Jewels' 
  },
  { 
    id: Category.FLOWER_TEA, 
    title: 'Flower Tea', 
    // Using local flower tea image
    img: '/assets/flower-tea.jpeg',
    desc: 'Indian Floral Tea: "Where Nature Meets Wellness"' 
  },
  { 
    id: Category.HOME_DECOR, 
    title: 'Home Decor', 
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    desc: 'Artisanal Blue Pottery & More' 
  }
];

const CategorySection: React.FC<CategorySectionProps> = (props: CategorySectionProps) => {
  const { onSelectCategory, onExploreMore } = props;
  return (
    <section id="categories" className="py-24 bg-white relative">
      {/* Rajasthani Border Motifs */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-6xl font-bold text-rose-950 mb-6 royal-font">The Royal Collections</h2>
          <div className="w-24 h-1 bg-rose-800 mx-auto mb-6"></div>
          <p className="text-rose-800 max-w-2xl mx-auto text-lg font-light italic">
            "Discover the essence of Rajasthan's vibrant heritage through our curated selection of artisanal treasures."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="group relative h-[500px] overflow-hidden rounded-[2rem] shadow-2xl cursor-pointer transition-all duration-700 hover:-translate-y-4"
              onClick={() => onSelectCategory(cat.id)}
            >
              <img 
                src={cat.img} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-950/30 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-rose-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Rajasthan Heritage</span>
                <h3 className="text-4xl font-bold mb-3 royal-font">{cat.title}</h3>
                <p className="text-sm text-rose-100 font-light opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 delay-100">
                  {cat.desc}
                </p>
                <div className="mt-6 w-0 h-0.5 bg-rose-400 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={onExploreMore}
            className="group inline-flex items-center space-x-6 px-16 py-6 bg-rose-950 text-rose-50 rounded-full hover:bg-white hover:text-rose-950 border-2 border-rose-950 transition-all duration-500 text-xl font-bold tracking-[0.2em] shadow-2xl"
          >
            <span>EXPLORE MORE</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:translate-x-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;