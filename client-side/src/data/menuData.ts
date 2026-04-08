export type Category = {
  id: string;
  name: string;
  icon: string;
  type: 'food' | 'drink';
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isPopular?: boolean;
  isAvailable: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
};

export type TableInfo = {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
};

export const categories: Category[] = [
  { id: 'all', name: 'Semua', icon: '🍽️', type: 'food' },
  { id: 'appetizer', name: 'Appetizer', icon: '🥗', type: 'food' },
  { id: 'main-course', name: 'Main Course', icon: '🍛', type: 'food' },
  { id: 'dessert', name: 'Dessert', icon: '🍰', type: 'food' },
  { id: 'snack', name: 'Snack', icon: '🍟', type: 'food' },
  { id: 'coffee', name: 'Coffee', icon: '☕', type: 'drink' },
  { id: 'tea', name: 'Tea', icon: '🍵', type: 'drink' },
  { id: 'juice', name: 'Juice', icon: '🧃', type: 'drink' },
  { id: 'smoothie', name: 'Smoothie', icon: '🥤', type: 'drink' },
  { id: 'soft-drink', name: 'Soft Drink', icon: '🥤', type: 'drink' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1', name: 'Nasi Goreng Spesial', description: 'Nasi goreng dengan telur, ayam, udang, dan sayuran segar',
    price: 35000, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    categoryId: 'main-course', isPopular: true, isAvailable: true,
  },
  {
    id: '2', name: 'Mie Goreng Seafood', description: 'Mie goreng dengan udang, cumi, dan sayuran',
    price: 38000, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    categoryId: 'main-course', isAvailable: true,
  },
  {
    id: '3', name: 'Ayam Bakar Madu', description: 'Ayam bakar dengan saus madu spesial dan lalapan',
    price: 42000, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    categoryId: 'main-course', isPopular: true, isAvailable: true,
  },
  {
    id: '4', name: 'Sate Ayam', description: '10 tusuk sate ayam dengan bumbu kacang',
    price: 30000, image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop',
    categoryId: 'main-course', isAvailable: true,
  },
  {
    id: '5', name: 'Gado-gado Jakarta', description: 'Sayuran segar dengan bumbu kacang khas Jakarta',
    price: 25000, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    categoryId: 'appetizer', isAvailable: true,
  },
  {
    id: '6', name: 'Lumpia Goreng', description: 'Lumpia isi sayuran dan ayam, 5 pcs',
    price: 20000, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
    categoryId: 'appetizer', isAvailable: true,
  },
  {
    id: '7', name: 'Sop Buntut', description: 'Sup buntut sapi dengan rempah pilihan',
    price: 55000, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    categoryId: 'appetizer', isPopular: true, isAvailable: true,
  },
  {
    id: '8', name: 'Kentang Goreng', description: 'Kentang goreng crispy dengan saus sambal',
    price: 18000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    categoryId: 'snack', isAvailable: true,
  },
  {
    id: '9', name: 'Pisang Goreng Keju', description: 'Pisang goreng crispy dengan topping keju',
    price: 15000, image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&h=300&fit=crop',
    categoryId: 'snack', isAvailable: true,
  },
  {
    id: '10', name: 'Es Kopi Susu', description: 'Espresso dengan susu segar dan gula aren',
    price: 22000, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    categoryId: 'coffee', isPopular: true, isAvailable: true,
  },
  {
    id: '11', name: 'Americano', description: 'Double shot espresso dengan air panas',
    price: 20000, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop',
    categoryId: 'coffee', isAvailable: true,
  },
  {
    id: '12', name: 'Matcha Latte', description: 'Matcha premium dengan susu segar',
    price: 28000, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop',
    categoryId: 'tea', isAvailable: true,
  },
  {
    id: '13', name: 'Es Teh Manis', description: 'Teh manis segar dengan es batu',
    price: 8000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    categoryId: 'tea', isAvailable: true,
  },
  {
    id: '14', name: 'Jus Alpukat', description: 'Jus alpukat segar dengan susu coklat',
    price: 22000, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
    categoryId: 'juice', isAvailable: true,
  },
  {
    id: '15', name: 'Jus Jeruk', description: 'Jus jeruk segar tanpa gula tambahan',
    price: 18000, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    categoryId: 'juice', isAvailable: true,
  },
  {
    id: '16', name: 'Mango Smoothie', description: 'Smoothie mangga segar dengan yogurt',
    price: 25000, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
    categoryId: 'smoothie', isPopular: true, isAvailable: true,
  },
  {
    id: '17', name: 'Es Teler', description: 'Minuman segar dengan alpukat, kelapa, dan cincau',
    price: 20000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    categoryId: 'soft-drink', isAvailable: true,
  },
  {
    id: '18', name: 'Brownies Coklat', description: 'Brownies coklat premium dengan ice cream vanilla',
    price: 28000, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    categoryId: 'dessert', isAvailable: true,
  },
  {
    id: '19', name: 'Pancake Maple', description: 'Pancake fluffy dengan maple syrup dan buah segar',
    price: 32000, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    categoryId: 'dessert', isPopular: true, isAvailable: true,
  },
  {
    id: '20', name: 'Es Krim Tiga Rasa', description: 'Vanilla, coklat, dan strawberry dengan topping',
    price: 25000, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    categoryId: 'dessert', isAvailable: true,
  },
];

export const tables: TableInfo[] = Array.from({ length: 20 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: i + 1,
  capacity: i < 8 ? 2 : i < 14 ? 4 : 6,
  status: 'available' as const,
}));

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
