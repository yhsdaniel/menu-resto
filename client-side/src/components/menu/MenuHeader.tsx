import { Search } from 'lucide-react';

type Props = {
  tableNumber: number;
  search: string;
  setSearch: (s: string) => void;
};

const MenuHeader = ({ tableNumber, search, setSearch }: Props) => {
  return (
    <div className="px-4 pt-6 pb-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Meja #{tableNumber}</p>
          <h1 className="text-2xl font-bold text-foreground">Menu Kami</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg">🍽️</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Pilih makanan & minuman favoritmu</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
};

export default MenuHeader;
