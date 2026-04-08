import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatRupiah } from '@/data/menuData';
import { ArrowLeft, QrCode, Building2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentMethod = 'qris' | 'va' | null;
type VABank = 'bca' | 'bni' | 'bri' | 'mandiri' | null;

const bankLogos: Record<string, { name: string; color: string }> = {
  bca: { name: 'BCA', color: 'hsl(210, 100%, 35%)' },
  bni: { name: 'BNI', color: 'hsl(15, 85%, 50%)' },
  bri: { name: 'BRI', color: 'hsl(210, 80%, 40%)' },
  mandiri: { name: 'Mandiri', color: 'hsl(210, 70%, 30%)' },
};

const Payment = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { totalPrice, clearCart, tableNumber } = useCart();
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [selectedBank, setSelectedBank] = useState<VABank>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handlePay = () => {
    setIsPaid(true);
    setTimeout(() => {
      clearCart();
      navigate(`/table/${tableId}/success`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>Pembayaran</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Order summary */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Meja #{tableNumber}</p>
          <div className="flex justify-between">
            <span className="font-bold text-foreground">Total Pembayaran</span>
            <span className="font-bold text-primary text-xl">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Payment methods */}
        <h2 className="text-sm font-bold text-foreground">Pilih Metode Pembayaran</h2>

        <button
          onClick={() => { setMethod('qris'); setSelectedBank(null); }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
            method === 'qris' ? 'border-primary bg-primary/5' : 'border-border bg-card'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <QrCode className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-card-foreground">QRIS</p>
            <p className="text-[11px] text-muted-foreground">Scan QR untuk bayar dari e-wallet atau m-banking</p>
          </div>
        </button>

        <button
          onClick={() => setMethod('va')}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
            method === 'va' ? 'border-primary bg-primary/5' : 'border-border bg-card'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-card-foreground">Virtual Account</p>
            <p className="text-[11px] text-muted-foreground">Transfer via ATM, m-banking, atau internet banking</p>
          </div>
        </button>

        {/* QRIS Display */}
        <AnimatePresence>
          {method === 'qris' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col items-center">
                <p className="text-sm font-semibold text-card-foreground mb-4">Scan QRIS di bawah ini</p>
                <div className="w-48 h-48 bg-secondary rounded-2xl flex items-center justify-center mb-3 border-2 border-dashed border-border">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-[10px] text-muted-foreground">QR Code akan muncul<br/>setelah integrasi payment</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-primary">{formatRupiah(grandTotal)}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Berlaku 15 menit</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VA Bank Selection */}
        <AnimatePresence>
          {method === 'va' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2"
            >
              <p className="text-sm font-semibold text-foreground">Pilih Bank</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(bankLogos).map(([key, bank]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBank(key as VABank)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedBank === key ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: bank.color }}>
                      <span className="text-white text-[10px] font-bold">{bank.name.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">{bank.name}</p>
                  </button>
                ))}
              </div>

              {selectedBank && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl p-4 border border-border/50 mt-3"
                >
                  <p className="text-xs text-muted-foreground mb-1">Nomor Virtual Account {bankLogos[selectedBank].name}</p>
                  <p className="text-lg font-mono font-bold text-foreground tracking-wider">8801 0812 3456 7890</p>
                  <p className="text-xs text-muted-foreground mt-2">Transfer sejumlah</p>
                  <p className="text-xl font-bold text-primary">{formatRupiah(grandTotal)}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pay button */}
      {(method === 'qris' || (method === 'va' && selectedBank)) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto">
          <button
            onClick={handlePay}
            disabled={isPaid}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                Memproses...
              </>
            ) : (
              `Konfirmasi Pembayaran`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
