import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { menuItems, categories } from '@/data/menuData';
import { useCart } from '@/contexts/CartContext';
import MenuHeader from '@/components/menu/MenuHeader';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuCard from '@/components/menu/MenuCard';
import CartBar from '@/components/menu/CartBar';

const TableMenu = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const tableNumber = parseInt(tableId || '1', 10);
  const { setTableNumber } = useCart();

  const [activeTab, setActiveTab] = useState<'food' | 'drink'>('food');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTableNumber(tableNumber);
  }, [tableNumber, setTableNumber]);

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const cat = categories.find(c => c.id === item.categoryId);
      if (!cat) return false;
      const matchesTab = cat.type === activeTab;
      const matchesCat = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesCat && matchesSearch;
    });
  }, [activeTab, activeCategory, search]);

  // Popular items for the current tab
  const popular = useMemo(() => {
    return menuItems.filter(item => {
      const cat = categories.find(c => c.id === item.categoryId);
      return cat?.type === activeTab && item.isPopular;
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-24">
      <MenuHeader tableNumber={tableNumber} search={search} setSearch={setSearch} />
      <CategoryFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Popular section */}
      {activeCategory === 'all' && !search && popular.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-base font-bold text-foreground mb-2">⭐ Populer</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {popular.map(item => (
              <div key={item.id} className="max-w-[350px]">
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu list */}
      <div className="px-4 space-y-3">
        <h2 className="text-base font-bold text-foreground">
          {activeCategory === 'all' ? 'Semua Menu' : categories.find(c => c.id === activeCategory)?.name}
        </h2>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="text-sm">Menu tidak ditemukan</p>
          </div>
        ) : (
          filtered.map(item => <MenuCard key={item.id} item={item} />)
        )}
      </div>

      <CartBar />
    </div>
  );
};

export default TableMenu;
