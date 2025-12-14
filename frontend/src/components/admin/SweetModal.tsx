import { useState, useEffect } from 'react';
import { Sweet, useSweets } from '@/contexts/SweetsContext';
import { X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweet?: Sweet | null;
  mode: 'add' | 'edit' | 'restock';
}

export function SweetModal({ isOpen, onClose, sweet, mode }: SweetModalProps) {
  const { categories, addSweet, updateSweet, restockSweet, fetchCategories } = useSweets();
  const [loading, setLoading] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (sweet && (mode === 'edit' || mode === 'restock')) {
      setFormData({
        name: sweet.name,
        category: sweet.category_name || '',
        price: sweet.price,
        quantity: sweet.quantity,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
      });
    }
  }, [sweet, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        await addSweet({
          name: formData.name,
          category_id: formData.category || null,
          category_name: formData.category || 'Uncategorized',
          price: formData.price,
          quantity: formData.quantity,
          image_url: null,
          description: null,
        });
      } else if (mode === 'edit' && sweet) {
        await updateSweet(sweet.id, {
          name: formData.name,
          category_name: formData.category,
          price: formData.price,
          quantity: formData.quantity,
        });
      } else if (mode === 'restock' && sweet) {
        await restockSweet(sweet.id, restockQuantity);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const title = mode === 'add' ? 'Add New Sweet' : mode === 'edit' ? 'Edit Sweet' : 'Restock Sweet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-3xl shadow-hover animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {mode === 'restock' ? (
            <div>
              <p className="text-muted-foreground mb-4">
                Current stock for <span className="font-semibold text-foreground">{sweet?.name}</span>: 
                <span className="ml-2 font-bold text-primary">{sweet?.quantity} units</span>
              </p>
              <label className="text-sm font-medium text-foreground block mb-2">
                Quantity to Add
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="input-sweet pl-12"
                  min={1}
                  required
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Sweet Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="input-sweet"
                  placeholder="Enter sweet name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                  className="input-sweet"
                  placeholder="Enter category (e.g., Chocolate, Candy)"
                  list="categories-list"
                />
                <datalist id="categories-list">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(f => ({ ...f, price: Number(e.target.value) }))}
                    className="input-sweet"
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(f => ({ ...f, quantity: Number(e.target.value) }))}
                    className="input-sweet"
                    min={0}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 btn-primary",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? 'Saving...' : mode === 'restock' ? 'Restock' : 'Save Sweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
