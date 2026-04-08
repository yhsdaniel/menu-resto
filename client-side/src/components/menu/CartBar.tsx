import { useCart } from '@/contexts/CartContext';
import { formatRupiah } from '@/data/menuData';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartBar = () => {
  const { totalItems, totalPrice, tableNumber } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 max-w-md mx-auto"
      >
        <button
          onClick={() => navigate(`/table/${tableNumber}/cart`)}
          className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-background text-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <span className="font-semibold text-sm">Lihat Keranjang</span>
          </div>
          <span className="font-bold">{formatRupiah(totalPrice)}</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartBar;
