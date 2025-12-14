import { useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { SweetCard } from '@/components/sweets/SweetCard';
import { useSweets } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  IndianRupee, 
  ShoppingBag, 
  AlertTriangle,
  TrendingUp,
  Cookie
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { sweets, categories, loading, fetchSweets, fetchCategories } = useSweets();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchSweets();
    fetchCategories();
  }, [fetchSweets, fetchCategories]);

  const stats = useMemo(() => {
    const totalSweets = sweets.length;
    const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    const lowStock = sweets.filter(s => s.quantity > 0 && s.quantity <= 5).length;
    const outOfStock = sweets.filter(s => s.quantity === 0).length;
    const totalCategories = categories.length;

    return { totalSweets, totalValue, lowStock, outOfStock, totalCategories };
  }, [sweets, categories]);

  const topSweets = useMemo(() => 
    sweets.slice(0, 4), 
    [sweets]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back! 🍪
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your sweet shop today.
            </p>
          </div>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="btn-primary"
            >
              <Package className="w-4 h-4" />
              Manage Inventory
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={stats.totalSweets}
            subtitle={`Across ${stats.totalCategories} categories`}
            icon={Package}
            variant="default"
          />
          <StatCard
            title="Inventory Value"
            value={`₹${stats.totalValue.toFixed(0)}`}
            subtitle="Total stock value"
            icon={IndianRupee}
            variant="primary"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            subtitle="Need attention soon"
            icon={AlertTriangle}
            variant="accent"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            subtitle="Requires restock"
            icon={ShoppingBag}
            variant={stats.outOfStock > 0 ? 'default' : 'secondary'}
          />
        </div>

        {/* Quick Actions for Admin */}
        {isAdmin && (
          <div className="p-6 rounded-2xl bg-gradient-mint border border-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-mint-foreground" />
              <h3 className="font-display text-lg font-semibold text-mint-foreground">
                Quick Actions
              </h3>
            </div>
            <p className="text-mint-foreground/70 mb-4">
              As an admin, you have full control over inventory management.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin" className="btn-secondary bg-card text-foreground">
                <Package className="w-4 h-4" />
                Add New Sweet
              </Link>
              <Link to="/sweets" className="btn-secondary bg-card text-foreground">
                <Cookie className="w-4 h-4" />
                View All Sweets
              </Link>
            </div>
          </div>
        )}

        {/* Recent Sweets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Featured Sweets
            </h2>
            <Link 
              to="/sweets" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-muted h-80 animate-pulse" />
              ))}
            </div>
          ) : topSweets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSweets.map((sweet, i) => (
                <div key={sweet.id} className={`animate-slide-up stagger-${i + 1}`}>
                  <SweetCard sweet={sweet} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-muted/50 border border-border">
              <Cookie className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sweets available yet.</p>
              {isAdmin && (
                <Link to="/admin" className="btn-primary mt-4 inline-flex">
                  Add Your First Sweet
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
