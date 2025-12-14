import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSweetCard } from '@/components/admin/AdminSweetCard';
import { SweetModal } from '@/components/admin/SweetModal';
import { useSweets, Sweet } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Admin() {
  const { sweets, loading, fetchSweets } = useSweets();
  const { isAdmin, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'restock'>('add');
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAdd = () => {
    setSelectedSweet(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setModalMode('restock');
    setModalOpen(true);
  };

  const lowStockSweets = sweets.filter(s => s.quantity > 0 && s.quantity <= 5);
  const outOfStockSweets = sweets.filter(s => s.quantity === 0);
  const inStockSweets = sweets.filter(s => s.quantity > 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your inventory and products
            </p>
          </div>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add New Sweet
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-mint/20 border border-mint/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint/40 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-mint-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-mint-foreground">{inStockSweets.length}</p>
              <p className="text-sm text-mint-foreground/70">In Stock</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-accent/20 border border-accent/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-accent-foreground">{lowStockSweets.length}</p>
              <p className="text-sm text-accent-foreground/70">Low Stock</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-destructive">{outOfStockSweets.length}</p>
              <p className="text-sm text-destructive/70">Out of Stock</p>
            </div>
          </div>
        </div>

        {/* Out of stock section */}
        {outOfStockSweets.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Out of Stock ({outOfStockSweets.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {outOfStockSweets.map((sweet) => (
                <AdminSweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={handleEdit}
                  onRestock={handleRestock}
                />
              ))}
            </div>
          </div>
        )}

        {/* Low stock section */}
        {lowStockSweets.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-accent-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Low Stock ({lowStockSweets.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lowStockSweets.map((sweet) => (
                <AdminSweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={handleEdit}
                  onRestock={handleRestock}
                />
              ))}
            </div>
          </div>
        )}

        {/* All sweets */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            All Products ({sweets.length})
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : sweets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sweets.map((sweet, i) => (
                <div
                  key={sweet.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}
                >
                  <AdminSweetCard
                    sweet={sweet}
                    onEdit={handleEdit}
                    onRestock={handleRestock}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-muted/50 border border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first sweet to the inventory
              </p>
              <button onClick={handleAdd} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Your First Sweet
              </button>
            </div>
          )}
        </div>
      </div>

      <SweetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sweet={selectedSweet}
        mode={modalMode}
      />
    </DashboardLayout>
  );
}
