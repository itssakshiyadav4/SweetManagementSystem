import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SweetCard } from '@/components/sweets/SweetCard';
import { SweetFilters } from '@/components/sweets/SweetFilters';
import { useSweets, Sweet } from '@/contexts/SweetsContext';
import { Cookie, Package } from 'lucide-react';

export default function Sweets() {
  const { sweets, loading, fetchSweets, searchSweets } = useSweets();
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  useEffect(() => {
    setFilteredSweets(sweets);
  }, [sweets]);

  const handleSearch = useCallback(async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const hasFilters = params.name || params.category || params.minPrice || params.maxPrice;
    
    if (!hasFilters) {
      setFilteredSweets(sweets);
      return;
    }

    setIsSearching(true);
    const results = await searchSweets(params);
    setFilteredSweets(results);
    setIsSearching(false);
  }, [sweets, searchSweets]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            All Sweets
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse our delicious collection of confections
          </p>
        </div>

        {/* Filters */}
        <SweetFilters onSearch={handleSearch} />

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>
            {filteredSweets.length} {filteredSweets.length === 1 ? 'sweet' : 'sweets'} found
          </span>
        </div>

        {/* Grid */}
        {loading || isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredSweets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map((sweet, i) => (
              <div 
                key={sweet.id} 
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                <SweetCard sweet={sweet} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-muted/50 border border-border">
            <Cookie className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No sweets found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
