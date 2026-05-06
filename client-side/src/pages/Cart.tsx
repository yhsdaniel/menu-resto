import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Minus, Plus, SendHorizonal, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { formatRupiah } from '@/data/menuData';
import { createOrder, createPayment, paymentOrder } from '@/lib/api';

type MidtransSnapWindow = Window & {
  snap?: {
    pay: (
      token: string,
      callbacks: {
        onSuccess: () => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }
    ) => void;
  };
};

const Cart = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    updateNotes,
    totalPrice,
    clearCart,
    totalItems,
    tableNumber,
  } = useCart();
  const [editingNotes, setEditingNotes] = useState<number | null>(null);

  const payOrderMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (payment) => {
      clearCart();
      navigate(`/table/${tableId}/success`, {
        state: {
          orderId: payment.tableOrder.id,
          tableNumber: payment.tableOrder.tableNumber,
        },
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Gagal menyelesaikan pembayaran.');
    },
  });

  const submitOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (order) => {
      try {
        await loadMidtransSnap();

        const response = await paymentOrder({
          id: order.id,
          product: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          priceTotal: order.totalPrice,
        });

        const token = response.token || response.redirect_url;

        if (!token) {
          throw new Error('Token pembayaran tidak diterima dari server.');
        }

        const snap = (window as MidtransSnapWindow).snap;

        if (!snap) {
          throw new Error('Midtrans Snap belum tersedia.');
        }

        snap.pay(token, {
          onSuccess: async () => {
            await payOrderMutation.mutateAsync({
              tableOrderId: order.id,
              paymentMethod: 'card',
              amount: order.totalPrice,
              paidAmount: order.totalPrice,
              changeAmount: 0,
              status: 'paid',
            });
          },
          onError: (result: unknown) => {
            console.error('Midtrans error', result);
            toast.error('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: () => {
            toast('Pembayaran ditutup. Pesanan tersimpan sebagai pending.');
          },
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Gagal memproses pembayaran.');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim pesanan.');
    },
  });

  const loadMidtransSnap = async () => {
    if ((window as MidtransSnapWindow).snap) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.'));
      document.body.appendChild(script);
    });
  };

  const handleSubmitOrder = () => {
    if (!tableNumber && !tableId) {
      toast.error('Nomor meja tidak ditemukan.');
      return;
    }

    submitOrderMutation.mutate({
      tableNumber: tableNumber ?? Number(tableId),
      status: 'pending',
      items: items.map(item => ({
        menuId: item.id,
        quantity: item.quantity,
        notes: item.notes,
      })),
    });
  };

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
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>Keranjang</h1>
          <p className="text-xs text-muted-foreground">Meja #{tableNumber ?? tableId}</p>
        </div>
      </div>

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
                  onChange={event => updateNotes(item.id, event.target.value)}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jumlah item</span>
            <span className="text-foreground font-medium">{totalItems} item</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-foreground">Total Tagihan</span>
            <span className="font-bold text-primary text-lg">{formatRupiah(totalPrice)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Pesanan akan dikirim ke sistem kasir, lalu pembayaran diselesaikan di meja kasir.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto">
        <button
          onClick={handleSubmitOrder}
          disabled={submitOrderMutation.isPending || payOrderMutation.isPending}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <SendHorizonal className="w-4 h-4" />
          {submitOrderMutation.isPending ? 'Mengirim pesanan...' : `Kirim Pesanan • ${formatRupiah(totalPrice)}`}
        </button>
      </div>
    </div>
  );
};

export default Cart;
