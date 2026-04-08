import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatRupiah, menuItems } from '@/data/menuData';
import { ArrowLeft, Minus, Plus, Trash2, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const API_SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const Cart = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, updateNotes, totalPrice, clearCart, totalItems } = useCart();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const serviceFee = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee;

  const orderItem = {
    id: tableId + Date.now(),
    product: items.map(item => {
      return {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        priceTotal: item.price * item.quantity,
      }
    }),
    priceTotal: grandTotal,
  }

  const checkOut = async () => {
    const response = await fetch(`${API_SERVER_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderItem),
    });
    const data = await response.json();
    window.snap.pay(data.token, {
      onSuccess: () => {
        clearCart()
        navigate(`/table/${tableId}/success`)
      },
      onPending: () => {
        toast.error('Pembayaran Gagal.')
      },
      onError: () => {
        toast.error('Ada kesalahan. Hubungi Karyawan Kami')
      },
    })
  }

  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js'
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    const script = document.createElement('script')
    script.src = snapScript
    script.async = true
    script.setAttribute('data-client-key', clientKey)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center px-4">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-lg font-bold text-foreground mb-1">Keranjang Kosong</h2>
        <p className="text-sm text-muted-foreground mb-6">Yuk pilih menu favoritmu!</p>
        <button
          onClick={() => navigate(`/table/${tableId}`)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm"
        >
          Lihat Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>Keranjang</h1>
      </div>

      {/* Items */}
      <div className="px-4 mt-4 space-y-3">
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            className="bg-card rounded-2xl p-3 border border-border/50"
          >
            <div className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm text-card-foreground truncate pr-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-primary mt-1">{formatRupiah(item.price)}</p>

                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => setEditingNotes(editingNotes === item.id ? null : item.id)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {item.notes ? 'Edit catatan' : 'Tambah catatan'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5 text-secondary-foreground" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {editingNotes === item.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-2 overflow-hidden">
                <input
                  type="text"
                  placeholder="Contoh: tidak pedas, tanpa bawang..."
                  value={item.notes || ''}
                  onChange={e => updateNotes(item.id, e.target.value)}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">{formatRupiah(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya layanan (5%)</span>
            <span className="text-foreground font-medium">{formatRupiah(serviceFee)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-primary text-lg">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto">
        <button
          onClick={() => checkOut()}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl"
        >
          Bayar — {formatRupiah(grandTotal)}
        </button>
      </div>
    </div>
  );
};

export default Cart;
