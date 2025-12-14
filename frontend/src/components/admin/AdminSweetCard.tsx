import { Sweet } from '@/contexts/SweetsContext';
import { useSweets } from '@/contexts/SweetsContext';
import { Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onRestock: (sweet: Sweet) => void;
}

export function AdminSweetCard({ sweet, onEdit, onRestock }: AdminSweetCardProps) {
  const { deleteSweet } = useSweets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const stockStatus = sweet.quantity === 0 
    ? 'out-of-stock' 
    : sweet.quantity <= 5 
    ? 'low-stock' 
    : 'in-stock';

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSweet(sweet.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-card">
      <div className="flex">

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
                {sweet.name}
              </h3>
              <span className="text-lg font-bold text-primary">₹{sweet.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{sweet.category_name}</p>
            <div className="flex items-center gap-2">
              <span className={cn("badge-stock", stockStatus)}>
                <Package className="w-3 h-3 mr-1" />
                {sweet.quantity} in stock
              </span>
              {sweet.quantity <= 5 && sweet.quantity > 0 && (
                <span className="text-xs text-accent flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Low stock
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onRestock(sweet)}
              className="flex-1 px-3 py-2 rounded-lg bg-mint text-mint-foreground text-sm font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Restock
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">Delete this sweet?</p>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
