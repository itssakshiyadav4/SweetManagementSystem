import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { sweetsApi, ApiSweet } from '@/lib/api';
import { toast } from 'sonner';

// Frontend Sweet model (adapted from API model)
export interface Sweet {
  id: string;
  name: string;
  category_id: string | null;
  category_name?: string;
  price: number;
  quantity: number;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
}

interface SweetsContextType {
  sweets: Sweet[];
  categories: Category[];
  loading: boolean;
  fetchSweets: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addSweet: (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateSweet: (id: string, sweet: Partial<Sweet>) => Promise<boolean>;
  deleteSweet: (id: string) => Promise<boolean>;
  purchaseSweet: (id: string, quantity: number, userId: string) => Promise<boolean>;
  restockSweet: (id: string, quantity: number) => Promise<boolean>;
  searchSweets: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => Promise<Sweet[]>;
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined);

// Transform API sweet to frontend sweet
function transformSweet(apiSweet: ApiSweet): Sweet {
  return {
    id: apiSweet._id,
    name: apiSweet.name,
    category_id: apiSweet.category || null,
    category_name: apiSweet.category || 'Uncategorized',
    price: apiSweet.price,
    quantity: apiSweet.quantity,
    image_url: null, // Backend doesn't have image_url
    description: null, // Backend doesn't have description
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function SweetsProvider({ children }: { children: ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    // Extract unique categories from sweets since backend doesn't have categories endpoint
    try {
      const apiSweets = await sweetsApi.getAll();
      const uniqueCategories = [...new Set(apiSweets.map(s => s.category).filter(Boolean))];
      setCategories(uniqueCategories.map((name, index) => ({
        id: name,
        name: name,
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchSweets = useCallback(async () => {
    setLoading(true);
    try {
      const apiSweets = await sweetsApi.getAll();
      const transformedSweets = apiSweets.map(transformSweet);
      setSweets(transformedSweets);
      
      // Also update categories from sweets
      const uniqueCategories = [...new Set(apiSweets.map(s => s.category).filter(Boolean))];
      setCategories(uniqueCategories.map((name) => ({
        id: name,
        name: name,
      })));
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSweets = useCallback(async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      const apiSweets = await sweetsApi.search(params);
      return apiSweets.map(transformSweet);
    } catch (error) {
      console.error('Error searching sweets:', error);
      toast.error('Search failed');
      return [];
    }
  }, []);

  const addSweet = useCallback(async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await sweetsApi.create({
        name: sweet.name,
        category: sweet.category_name || sweet.category_id || 'Uncategorized',
        price: sweet.price,
        quantity: sweet.quantity,
      });

      toast.success('Sweet added successfully!');
      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error adding sweet:', error);
      toast.error('Failed to add sweet');
      return false;
    }
  }, [fetchSweets]);

  const updateSweet = useCallback(async (id: string, sweet: Partial<Sweet>) => {
    try {
      const updateData: Partial<Omit<ApiSweet, '_id'>> = {};
      if (sweet.name !== undefined) updateData.name = sweet.name;
      if (sweet.category_name !== undefined) updateData.category = sweet.category_name;
      if (sweet.category_id !== undefined) updateData.category = sweet.category_id;
      if (sweet.price !== undefined) updateData.price = sweet.price;
      if (sweet.quantity !== undefined) updateData.quantity = sweet.quantity;

      await sweetsApi.update(id, updateData);

      toast.success('Sweet updated successfully!');
      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error updating sweet:', error);
      toast.error('Failed to update sweet');
      return false;
    }
  }, [fetchSweets]);

  const deleteSweet = useCallback(async (id: string) => {
    try {
      await sweetsApi.delete(id);
      
      // Remove from local state immediately
      setSweets(prev => prev.filter(s => s.id !== id));
      
      toast.success('Sweet deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting sweet:', error);
      toast.error('Failed to delete sweet');
      return false;
    }
  }, []);

  const purchaseSweet = useCallback(async (id: string, quantity: number, userId: string) => {
    const sweet = sweets.find(s => s.id === id);
    if (!sweet || sweet.quantity < quantity) {
      toast.error('Not enough stock available');
      return false;
    }

    try {
      // Call purchase endpoint for each unit (since backend decreases by 1)
      for (let i = 0; i < quantity; i++) {
        await sweetsApi.purchase(id);
      }

      toast.success('Purchase successful!');
      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error purchasing:', error);
      toast.error('Purchase failed');
      return false;
    }
  }, [sweets, fetchSweets]);

  const restockSweet = useCallback(async (id: string, quantity: number) => {
    try {
      await sweetsApi.restock(id, quantity);

      toast.success('Restocked successfully!');
      await fetchSweets();
      return true;
    } catch (error) {
      console.error('Error restocking:', error);
      toast.error('Restock failed');
      return false;
    }
  }, [fetchSweets]);

  return (
    <SweetsContext.Provider value={{
      sweets,
      categories,
      loading,
      fetchSweets,
      fetchCategories,
      addSweet,
      updateSweet,
      deleteSweet,
      purchaseSweet,
      restockSweet,
      searchSweets,
    }}>
      {children}
    </SweetsContext.Provider>
  );
}

export function useSweets() {
  const context = useContext(SweetsContext);
  if (context === undefined) {
    throw new Error('useSweets must be used within a SweetsProvider');
  }
  return context;
}
