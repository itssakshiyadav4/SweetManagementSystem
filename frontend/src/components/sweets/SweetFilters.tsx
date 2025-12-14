import { useState, useEffect } from 'react';
import { useSweets, Category } from '@/contexts/SweetsContext';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetFiltersProps {
  onSearch: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export function SweetFilters({ onSearch }: SweetFiltersProps) {
  const { categories, fetchCategories } = useSweets();
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({
        name: searchName || undefined,
        category: selectedCategory || undefined,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 100 ? priceRange.max : undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchName, selectedCategory, priceRange, onSearch]);

  const clearFilters = () => {
    setSearchName('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 100 });
  };

  const hasActiveFilters = searchName || selectedCategory || priceRange.min > 0 || priceRange.max < 100;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search sweets by name..."
            className="input-sweet pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2",
            showFilters 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card text-foreground border-border hover:border-primary/50"
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={cn("category-chip", !selectedCategory && "active")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn("category-chip", selectedCategory === category.id && "active")}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="p-5 rounded-2xl bg-card border border-border animate-scale-in">
          <h4 className="font-medium text-foreground mb-4">Price Range</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(p => ({ ...p, min: Number(e.target.value) }))}
                  className="input-sweet pl-7 text-sm"
                  min={0}
                  max={priceRange.max}
                />
              </div>
            </div>
            <span className="text-muted-foreground mt-5">to</span>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(p => ({ ...p, max: Number(e.target.value) }))}
                  className="input-sweet pl-7 text-sm"
                  min={priceRange.min}
                />
              </div>
            </div>
          </div>
          
          {/* Price slider visualization */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all"
              style={{
                marginLeft: `${priceRange.min}%`,
                width: `${priceRange.max - priceRange.min}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
