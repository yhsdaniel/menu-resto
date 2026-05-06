import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Printer,
  QrCode,
  ReceiptText,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatRupiah } from '@/data/menuData';
import { createPayment, fetchOrders, type ApiOrder, type OrderStatus, type PaymentMethod } from '@/lib/api';

const paymentOptions: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Banknote;
}> = [
  { id: 'cash', label: 'Tunai', description: 'Hitung uang masuk dan kembalian', icon: Banknote },
  { id: 'qris', label: 'QRIS', description: 'Pembayaran scan barcode', icon: QrCode },
  { id: 'card', label: 'Kartu', description: 'Debit atau kredit di kasir', icon: CreditCard },
];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const getStatusStyles = (status: OrderStatus) => {
  return status === 'paid'
    ? 'bg-accent/10 text-accent'
    : 'bg-warning/15 text-foreground';
};

const Cashier = () => {
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('pending');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmountInput, setPaidAmountInput] = useState('');
  const [search, setSearch] = useState('');
  const [printOrder, setPrintOrder] = useState<ApiOrder | null>(null);

  const { data: orderSummary = [] } = useQuery({
    queryKey: ['orders', 'summary'],
    queryFn: () => fetchOrders(),
  });

  const { data: orders = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['orders', activeStatus],
    queryFn: () => fetchOrders(activeStatus),
  });

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter(order => {
      return order.tableNumber.toString().includes(keyword) || `inv-${order.id}`.includes(keyword);
    });
  }, [orders, search]);

  const selectedOrder = useMemo(
    () => filteredOrders.find(order => order.id === selectedOrderId) ?? filteredOrders[0] ?? null,
    [filteredOrders, selectedOrderId],
  );

  const selectedOrderIdValue = selectedOrder?.id ?? null;
  const selectedOrderTotal = selectedOrder?.totalPrice ?? null;

  useEffect(() => {
    if (!filteredOrders.length) {
      setSelectedOrderId(null);
      return;
    }

    if (!selectedOrderId || !filteredOrders.some(order => order.id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  useEffect(() => {
    if (selectedOrderIdValue == null || selectedOrderTotal == null) {
      setPaidAmountInput('');
      return;
    }

    setPaymentMethod('cash');
    setPaidAmountInput(String(selectedOrderTotal));
  }, [selectedOrderIdValue, selectedOrderTotal]);

  useEffect(() => {
    if (selectedOrderTotal == null) {
      return;
    }

    if (paymentMethod === 'cash') {
      return;
    }

    setPaidAmountInput(String(selectedOrderTotal));
  }, [paymentMethod, selectedOrderTotal]);

  useEffect(() => {
    if (!printOrder) {
      return;
    }

    const handleAfterPrint = () => setPrintOrder(null);

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [printOrder]);

  const paidAmount = Number(paidAmountInput);
  const normalizedPaidAmount = Number.isFinite(paidAmount) ? paidAmount : 0;
  const billedAmount = selectedOrder?.totalPrice ?? 0;
  const changeAmount = paymentMethod === 'cash'
    ? Math.max(normalizedPaidAmount - billedAmount, 0)
    : 0;
  const isPaymentDisabled = !selectedOrder
    || selectedOrder.status === 'paid'
    || normalizedPaidAmount <= 0
    || (paymentMethod === 'cash' && normalizedPaidAmount < billedAmount)
    || ((paymentMethod === 'qris' || paymentMethod === 'card') && normalizedPaidAmount !== billedAmount);

  const settlePaymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: async (payment) => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      setActiveStatus('paid');
      setSelectedOrderId(payment.tableOrder.id);
      toast.success(`Pembayaran INV-${payment.tableOrder.id} berhasil diproses.`);
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Gagal memproses pembayaran.');
    },
  });

  const handleSettlePayment = () => {
    if (!selectedOrder) {
      return;
    }

    settlePaymentMutation.mutate({
      tableOrderId: selectedOrder.id,
      paymentMethod,
      amount: selectedOrder.totalPrice,
      paidAmount: normalizedPaidAmount,
      changeAmount,
      status: 'paid',
    });
  };

  const handlePrint = (order: ApiOrder) => {
    setPrintOrder(order);
    window.setTimeout(() => window.print(), 60);
  };

  const pendingCount = orderSummary.filter(order => order.status === 'pending').length;
  const paidCount = orderSummary.filter(order => order.status === 'paid').length;

  return (
    <>
      <div className="min-h-screen bg-background no-print">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">POS Cashier</h1>
              <p className="text-sm text-muted-foreground">Pantau pesanan masuk, selesaikan pembayaran, dan cetak invoice.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:w-[320px]">
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Paid</p>
                <p className="text-2xl font-bold text-accent">{paidCount}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
            <aside className="rounded-[28px] border border-border/60 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setActiveStatus('pending')}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeStatus === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveStatus('paid')}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeStatus === 'paid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  Paid
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari meja atau INV"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">
                  {activeStatus === 'pending' ? 'Pesanan Belum Dibayar' : 'Riwayat Invoice'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="text-xs font-medium text-primary"
                >
                  {isFetching ? 'Memuat...' : 'Refresh'}
                </button>
              </div>

              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="rounded-2xl border border-border/50 bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                    Memuat daftar order...
                  </div>
                ) : isError ? (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : 'Gagal memuat order.'}
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="rounded-2xl border border-border/50 bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                    Belum ada order dengan status ini.
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const itemCount = order.menus.reduce((total, item) => total + item.quantity, 0);
                    const isSelected = order.id === selectedOrder?.id;

                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 bg-background hover:border-primary/40'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">INV-{order.id}</p>
                            <h2 className="text-lg font-bold text-foreground">Meja {order.tableNumber}</h2>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(order.status)}`}>
                            {order.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{itemCount} item</span>
                          <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                        <p className="mt-3 text-base font-bold text-primary">{formatRupiah(order.totalPrice)}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            <section className="rounded-[32px] border border-border/60 bg-card p-5 shadow-sm">
              {!selectedOrder ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-border bg-background/60 text-center">
                  <div>
                    <ReceiptText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground">Pilih order untuk melihat detail</p>
                    <p className="text-sm text-muted-foreground">Order pending atau paid akan tampil di sini.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
                  <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Invoice</p>
                        <h2 className="text-3xl font-bold text-foreground">INV-{selectedOrder.id}</h2>
                        <p className="text-sm text-muted-foreground mt-1">Meja {selectedOrder.tableNumber} • {formatDateTime(selectedOrder.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyles(selectedOrder.status)}`}>
                          {selectedOrder.status === 'paid' ? 'Pembayaran selesai' : 'Menunggu pembayaran'}
                        </span>
                        {selectedOrder.payment ? (
                          <button
                            onClick={() => handlePrint(selectedOrder)}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/50"
                          >
                            <Printer className="h-4 w-4" />
                            Print
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/50 bg-background p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Detail Pesanan</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedOrder.menus.reduce((total, item) => total + item.quantity, 0)} item
                        </p>
                      </div>

                      <div className="space-y-3">
                        {selectedOrder.menus.map(item => (
                          <div key={item.tableOrderMenuId} className="rounded-2xl border border-border/50 bg-card p-3">
                            <div className="flex items-start gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-16 w-16 rounded-xl object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                                    <p className="text-xs text-muted-foreground">{item.quantity} x {formatRupiah(item.price)}</p>
                                  </div>
                                  <p className="font-bold text-primary">{formatRupiah(item.price * item.quantity)}</p>
                                </div>
                                {item.notes ? (
                                  <p className="mt-2 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                                    Catatan: {item.notes}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-2xl border border-border/50 bg-card p-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Subtotal</span>
                          <span>{formatRupiah(selectedOrder.totalPrice)}</span>
                        </div>
                        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                          <span>Total Tagihan</span>
                          <span className="text-primary">{formatRupiah(selectedOrder.totalPrice)}</span>
                        </div>
                        {selectedOrder.payment ? (
                          <div className="mt-4 rounded-2xl bg-accent/5 p-4 text-sm">
                            <div className="flex items-center gap-2 font-semibold text-accent">
                              <CheckCircle2 className="h-4 w-4" />
                              Pembayaran selesai
                            </div>
                            <div className="mt-3 space-y-2 text-foreground">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Metode</span>
                                <span className="font-medium uppercase">{selectedOrder.payment.paymentMethod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Dibayar</span>
                                <span className="font-medium">{formatRupiah(selectedOrder.payment.paidAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Kembalian</span>
                                <span className="font-medium">{formatRupiah(selectedOrder.payment.changeAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Waktu bayar</span>
                                <span className="font-medium">{formatDateTime(selectedOrder.payment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border/50 bg-background p-4">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground">Panel Pembayaran</p>
                      <p className="text-xs text-muted-foreground">Pilih metode, konfirmasi jumlah bayar, lalu simpan transaksi.</p>
                    </div>

                    <div className="space-y-3">
                      {paymentOptions.map(option => {
                        const Icon = option.icon;
                        const isActive = option.id === paymentMethod;

                        return (
                          <button
                            key={option.id}
                            onClick={() => setPaymentMethod(option.id)}
                            disabled={selectedOrder.status === 'paid'}
                            className={`w-full rounded-2xl border p-4 text-left transition-all disabled:opacity-60 ${isActive ? 'border-primary bg-primary/5' : 'border-border/50 bg-card'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-card-foreground">{option.label}</p>
                                <p className="text-xs text-muted-foreground">{option.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 rounded-2xl border border-border/50 bg-card p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Invoice</span>
                        <span className="font-semibold text-foreground">INV-{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tagihan</span>
                        <span className="font-semibold text-foreground">{formatRupiah(billedAmount)}</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          {paymentMethod === 'cash' ? 'Uang diterima' : 'Nominal dibayar'}
                        </label>
                        <input
                          type="number"
                          min={billedAmount}
                          value={paidAmountInput}
                          disabled={selectedOrder.status === 'paid' || paymentMethod !== 'cash'}
                          onChange={(event) => setPaidAmountInput(event.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
                        />
                        {paymentMethod !== 'cash' ? (
                          <p className="text-xs text-muted-foreground">Untuk {paymentMethod.toUpperCase()}, nominal harus sama dengan total tagihan.</p>
                        ) : null}
                      </div>

                      <div className="rounded-xl bg-secondary/60 p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Metode</span>
                          <span className="font-semibold uppercase text-foreground">{paymentMethod}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="text-muted-foreground">Kembalian</span>
                          <span className="font-semibold text-foreground">{formatRupiah(changeAmount)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSettlePayment}
                        disabled={isPaymentDisabled || settlePaymentMutation.isPending}
                        className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg disabled:opacity-70"
                      >
                        {settlePaymentMutation.isPending ? 'Memproses pembayaran...' : selectedOrder.status === 'paid' ? 'Invoice sudah dibayar' : 'Selesaikan Pembayaran'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {printOrder ? (
        <div className="print-area">
          <div className="mx-auto max-w-2xl px-10 py-12 text-black">
            <div className="border-b border-black pb-4">
              <p className="text-xs uppercase tracking-[0.3em]">RestoMenu</p>
              <h1 className="mt-2 text-3xl font-bold">Invoice INV-{printOrder.id}</h1>
              <p className="mt-2 text-sm">Dicetak pada {formatDateTime(new Date().toISOString())}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Meja</p>
                <p className="mt-1 text-lg font-semibold">Meja {printOrder.tableNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Status</p>
                <p className="mt-1 text-lg font-semibold">{printOrder.status.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Waktu order</p>
                <p className="mt-1 font-medium">{formatDateTime(printOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Metode bayar</p>
                <p className="mt-1 font-medium uppercase">{printOrder.payment?.paymentMethod ?? '-'}</p>
              </div>
            </div>

            <table className="mt-8 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black text-left">
                  <th className="py-3 font-semibold">Menu</th>
                  <th className="py-3 font-semibold">Qty</th>
                  <th className="py-3 font-semibold">Harga</th>
                  <th className="py-3 text-right font-semibold">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {printOrder.menus.map(item => (
                  <tr key={item.tableOrderMenuId} className="border-b border-black/10 align-top">
                    <td className="py-3 pr-3">
                      <p className="font-medium">{item.name}</p>
                      {item.notes ? <p className="mt-1 text-xs text-gray-600">Catatan: {item.notes}</p> : null}
                    </td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">{formatRupiah(item.price)}</td>
                    <td className="py-3 text-right">{formatRupiah(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 ml-auto max-w-sm space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(printOrder.totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-black pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatRupiah(printOrder.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dibayar</span>
                <span>{formatRupiah(printOrder.payment?.paidAmount ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembalian</span>
                <span>{formatRupiah(printOrder.payment?.changeAmount ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Cashier;
