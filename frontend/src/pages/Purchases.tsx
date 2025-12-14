import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Calendar, IndianRupee, Package } from 'lucide-react';

// Note: Purchase history is not available in the current REST API
// This page shows an empty state since there's no /api/purchases endpoint

export default function Purchases() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading since there's no purchases API
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Purchases
          </h1>
          <p className="text-muted-foreground mt-1">
            View your purchase history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-mint-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Items Purchased</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">₹0.00</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-muted/50 border border-border">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No purchases yet
            </h3>
            <p className="text-muted-foreground">
              Start shopping to see your purchase history here
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
