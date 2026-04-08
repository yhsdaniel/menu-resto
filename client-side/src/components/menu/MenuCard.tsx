import { MenuItem, formatRupiah } from '@/data/menuData';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 bg-card rounded-2xl p-3 shadow-sm border border-border/50"
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        {item.isPopular && (
          <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-current" /> Popular
          </span>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-background/70 rounded-xl flex items-center justify-center">
            <span className="text-xs font-semibold text-destructive">Habis</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-sm text-card-foreground leading-tight truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {item.name}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        </div>

        <div className="flex items-center justify-between mt-2 gap-1.5">
          <span className="text-sm font-bold text-primary">{formatRupiah(item.price)}</span>

          {item.isAvailable && (
            <div className="flex items-center gap-1.5">
              {cartItem ? (
                <>
                  <button
                    onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center text-foreground">{cartItem.quantity}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => addItem(item)}
                  className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
