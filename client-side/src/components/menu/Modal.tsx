import { Trash2, X } from 'lucide-react'
import React from 'react'

export function ModalAddEdit({ isMenuModalOpen, setIsMenuModalOpen, handleSaveMenu, formData, setFormData, categories, editingMenu }: any) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border/50 shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <h2 className="text-lg font-bold text-foreground">
                        {editingMenu ? 'Edit Menu' : 'Tambah Menu'}
                    </h2>
                    <button
                        onClick={() => setIsMenuModalOpen(false)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    <form id="menu-form" onSubmit={handleSaveMenu} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Nama Menu</label>
                            <input
                                required
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                placeholder="Masukkan nama menu"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Kategori</label>
                            <select
                                value={formData.categoryId || ''}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Harga (Rp)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.price || ''}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                placeholder="Contoh: 25000"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">URL Gambar</label>
                            <input
                                type="text"
                                value={formData.image || ''}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Deskripsi</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                                placeholder="Deskripsi singkat menu"
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable ?? true}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Tersedia</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular ?? false}
                                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-foreground">Menu Populer</span>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-border/50 flex justify-end gap-2 bg-secondary/30">
                    <button
                        type="button"
                        onClick={() => setIsMenuModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="menu-form"
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}


export function ModalDelete({ isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteMenu, editingMenu }: any) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-2">Hapus Menu?</h2>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus <strong>{editingMenu?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                <div className="p-4 flex gap-2 border-t border-border/50 bg-secondary/30">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDeleteMenu}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    )
}