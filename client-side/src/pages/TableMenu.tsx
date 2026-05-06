import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categories } from '@/data/menuData';
import { useCart } from '@/contexts/CartContext';
import { fetchMenus, mapMenuToClient } from '@/lib/api';
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

  const { data: menuResponse = [], isLoading, isError, error } = useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
  });

  const menuItems = useMemo(() => menuResponse.map(mapMenuToClient), [menuResponse]);

  useEffect(() => {
    setTableNumber(tableNumber);
  }, [tableNumber, setTableNumber]);

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const category = categories.find(cat => cat.id === item.categoryId);
      if (!category) {
        return false;
      }

      const matchesTab = category.type === activeTab;
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [activeTab, activeCategory, menuItems, search]);

  const popular = useMemo(() => {
    return menuItems.filter(item => {
      const category = categories.find(cat => cat.id === item.categoryId);
      return category?.type === activeTab && item.isPopular;
    });
  }, [activeTab, menuItems]);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-24">
      <MenuHeader tableNumber={tableNumber} search={search} setSearch={setSearch} />
      <CategoryFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

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

      <div className="px-4 space-y-3">
        <h2 className="text-base font-bold text-foreground">
          {activeCategory === 'all' ? 'Semua Menu' : categories.find(cat => cat.id === activeCategory)?.name}
        </h2>

        {isLoading ? (
          <div className="rounded-2xl border border-border/50 bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            Memuat menu restoran...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : 'Gagal memuat menu.'}
          </div>
        ) : filtered.length === 0 ? (
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
