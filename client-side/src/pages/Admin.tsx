import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Pencil, Plus, Table2, Trash2, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { categories, formatRupiah, tables, type MenuItem } from '@/data/menuData';
import { ModalAddEdit, ModalDelete } from '@/components/menu/Modal';
import { createMenu, deleteMenu, fetchMenus, mapMenuToClient, updateMenu } from '@/lib/api';

type Tab = 'tables' | 'menu';

type MenuFormState = {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
};

const defaultFormState: MenuFormState = {
  name: '',
  description: '',
  price: 0,
  image: '',
  categoryId: categories.find(category => category.id !== 'all')?.id || 'main-course',
  isAvailable: true,
  isPopular: false,
};

const Admin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('tables');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuFormState>(defaultFormState);

  const { data: menuResponse = [], isLoading, isError, error } = useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
  });

  const menus = useMemo(() => menuResponse.map(mapMenuToClient), [menuResponse]);
  const menuCategories = useMemo(
    () => categories.filter(category => category.id !== 'all'),
    [],
  );

  const invalidateMenus = async () => {
    await queryClient.invalidateQueries({ queryKey: ['menus'] });
  };

  const createMenuMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: async () => {
      await invalidateMenus();
      setIsMenuModalOpen(false);
      setFormData(defaultFormState);
      toast.success('Menu berhasil ditambahkan.');
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Gagal menambahkan menu.');
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateMenu>[1] }) =>
      updateMenu(id, payload),
    onSuccess: async () => {
      await invalidateMenus();
      setIsMenuModalOpen(false);
      setEditingMenu(null);
      toast.success('Menu berhasil diperbarui.');
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Gagal memperbarui menu.');
    },
  });

  const deleteMenuMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: async () => {
      await invalidateMenus();
      setIsDeleteModalOpen(false);
      setEditingMenu(null);
      toast.success('Menu berhasil dihapus.');
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Gagal menghapus menu.');
    },
  });

  const baseUrl = window.location.origin || import.meta.env.VITE_PUBLIC_URL;

  const handleOpenAddModal = () => {
    setEditingMenu(null);
    setFormData(defaultFormState);
    setIsMenuModalOpen(true);
  };

  const handleOpenEditModal = (menu: MenuItem) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      image: menu.image,
      categoryId: menu.categoryId,
      isAvailable: menu.isAvailable,
      isPopular: Boolean(menu.isPopular),
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenDeleteModal = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const handleSaveMenu = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      imageUrl: formData.image,
      categoryId: formData.categoryId,
      isAvailable: formData.isAvailable,
      isPopular: formData.isPopular,
    };

    if (editingMenu) {
      updateMenuMutation.mutate({ id: editingMenu.id, payload });
      return;
    }

    createMenuMutation.mutate(payload);
  };

  const handleDeleteMenu = () => {
    if (!editingMenu) {
      return;
    }

    deleteMenuMutation.mutate(editingMenu.id);
  };

  const isSaving = createMenuMutation.isPending || updateMenuMutation.isPending;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Kelola meja, menu, dan QR code</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'tables' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
          >
            <Table2 className="w-4 h-4" /> Meja & QR
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'menu' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Menu
          </button>
        </div>

        {activeTab === 'tables' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Daftar Meja</h2>
              <span className="text-sm text-muted-foreground">{tables.length} meja</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map(table => {
                const url = `${baseUrl}/table/${table.number}`;
                return (
                  <div
                    key={table.id}
                    className="bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center"
                  >
                    <div className="bg-background p-2 rounded-xl mb-3">
                      <QRCodeSVG value={url} size={100} level="M" />
                    </div>
                    <h3 className="font-bold text-card-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>Meja {table.number}</h3>
                    <p className="text-xs text-muted-foreground">{table.capacity} orang</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">{url}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Daftar Menu</h2>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Menu
              </button>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-border/50 bg-card px-4 py-10 text-center text-sm text-muted-foreground">
                Memuat daftar menu...
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-10 text-center text-sm text-destructive">
                {error instanceof Error ? error.message : 'Gagal memuat menu.'}
              </div>
            ) : menus.length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-card px-4 py-10 text-center text-sm text-muted-foreground">
                Belum ada menu. Tambahkan menu pertama untuk mulai menerima pesanan.
              </div>
            ) : (
              <div className="space-y-3">
                {menus.map(item => {
                  const category = categories.find(cat => cat.id === item.categoryId);
                  return (
                    <div key={item.id} className="bg-card rounded-2xl p-3 border border-border/50 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-card-foreground truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{category?.icon} {category?.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${item.isAvailable
                            ? 'bg-accent/10 text-accent'
                            : 'bg-destructive/10 text-destructive'
                            }`}>
                            {item.isAvailable ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-primary mt-1">{formatRupiah(item.price)}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {isMenuModalOpen && (
        <ModalAddEdit
          isMenuModalOpen={isMenuModalOpen}
          setIsMenuModalOpen={setIsMenuModalOpen}
          handleSaveMenu={handleSaveMenu}
          formData={formData}
          setFormData={setFormData}
          categories={menuCategories}
          editingMenu={editingMenu}
          isSubmitting={isSaving}
        />
      )}

      {isDeleteModalOpen && (
        <ModalDelete
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          handleDeleteMenu={handleDeleteMenu}
          editingMenu={editingMenu}
          isDeleting={deleteMenuMutation.isPending}
        />
      )}
    </div>
  );
};

export default Admin;
