import { useState } from 'react';
import { Sweet } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSweets } from '@/contexts/SweetsContext';
import { ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetCardProps {
  sweet: Sweet;
  onEdit?: (sweet: Sweet) => void;
  showAdminActions?: boolean;
}

export function SweetCard({ sweet, onEdit, showAdminActions }: SweetCardProps) {
  const { user } = useAuth();
  const { purchaseSweet } = useSweets();
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const stockStatus = sweet.quantity === 0 
    ? 'out-of-stock' 
    : sweet.quantity <= 5 
    ? 'low-stock' 
    : 'in-stock';

  const stockLabel = stockStatus === 'out-of-stock' 
    ? 'Out of Stock' 
    : stockStatus === 'low-stock' 
    ? `Only ${sweet.quantity} left` 
    : `${sweet.quantity} in stock`;

  const handlePurchase = async () => {
    if (!user || sweet.quantity < quantity) return;
    setIsPurchasing(true);
    await purchaseSweet(sweet.id, quantity, user.id);
    setIsPurchasing(false);
    setQuantity(1);
  };

  return (
    <div className="sweet-card group">
      {/* Header with badges */}
      <div className="p-4 pb-0 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
          {sweet.category_name}
        </span>
        <span className={cn("badge-stock", stockStatus)}>
          <Package className="w-3 h-3 mr-1" />
          {stockLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground line-clamp-1">
            {sweet.name}
          </h3>
          <span className="px-3 py-1 rounded-xl text-lg font-bold bg-primary text-primary-foreground">
            ₹{sweet.price.toFixed(2)}
          </span>
        </div>

        {/* Purchase controls */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(sweet.quantity, q + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                disabled={quantity >= sweet.quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0 || isPurchasing}
              className={cn(
                "flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed",
                isPurchasing && "animate-pulse-soft"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isPurchasing ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}

        {showAdminActions && onEdit && (
          <button
            onClick={() => onEdit(sweet)}
            className="w-full mt-3 btn-secondary"
          >
            Edit Sweet
          </button>
        )}
      </div>
    </div>
  );
}
