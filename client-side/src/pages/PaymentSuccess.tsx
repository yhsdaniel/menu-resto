import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-14 h-14 text-accent" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Pembayaran Berhasil!</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Pesanan kamu sedang diproses.<br />Silakan tunggu di meja kamu ya! 🎉
        </p>

        <button
          onClick={() => navigate(`/table/${tableId}`)}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm"
        >
          Pesan Lagi
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
