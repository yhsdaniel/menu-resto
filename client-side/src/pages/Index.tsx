import { useNavigate } from 'react-router-dom';
import { QrCode, UtensilsCrossed, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">RestoMenu</h1>
        <p className="text-sm text-muted-foreground">
          Sistem menu digital untuk restoran<br/>dengan QR code di setiap meja
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-3"
      >
        <button
          onClick={() => navigate('/table/1')}
          className="w-full flex items-center gap-4 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Demo Menu Pelanggan</p>
            <p className="text-xs opacity-80">Lihat menu sebagai pelanggan (Meja 1)</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-4 bg-card text-card-foreground p-4 rounded-2xl border border-border shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <QrCode className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-left">
            <p className="font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Admin Panel</p>
            <p className="text-xs text-muted-foreground">Kelola menu, meja & QR code</p>
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
