import { categories } from '@/data/menuData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Props = {
  activeTab: 'food' | 'drink';
  setActiveTab: (tab: 'food' | 'drink') => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
};

const CategoryFilter = ({ activeTab, setActiveTab, activeCategory, setActiveCategory }: Props) => {
  const filtered = categories.filter(category => category.id === 'all' || category.type === activeTab);

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-3 pt-2">
      <div className="flex gap-2 px-4 mb-3">
        {(['food', 'drink'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveCategory('all');
            }}
            className={cn(
              'relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground bg-secondary'
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab === 'food' ? '🍽️ Makanan' : '🥤 Minuman'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
        {filtered.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
