'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Props = {
  formData: {
    category: string;
  };
  handleChange: (field: 'category', value: string) => void;
};

// Supabase typed row for 'categories' table
type Category = Database['public']['Tables']['categories']['Row'];

export default function CategoryCard({ formData, handleChange }: Props) {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('categories')
      .select('name');

    if (error) {
      console.error('Error fetching categories:', error.message);
      toast.error('Failed to fetch categories');
    } else if (data) {
      setCategoryOptions((data as Category[]).map((item) => item.name));
    }

    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('category', e.target.value);
    setCustomCategory('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    setCustomCategory(newCategory);
    handleChange('category', newCategory);
  };

  const handleAddCustomCategory = async () => {
    const trimmedCategory = customCategory.trim();
    if (!trimmedCategory) {
      toast.error('Please enter a category name.');
      return;
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .eq('name', trimmedCategory)
      .single();

    if (!data && !error) {
      const { error: insertError } = await supabase
        .from('categories')
        .insert([{ name: trimmedCategory }]);

      if (insertError) {
        toast.error('Failed to add new category.');
      } else {
        toast.success('New category added!');
        await fetchCategories(); // Refresh dropdown
        setCustomCategory('');
        handleChange('category', trimmedCategory);
      }
    } else {
      toast('Category already exists.');
    }
  };

  return (
    <div className="border rounded-xl shadow-sm p-5 space-y-4 bg-white">
      <h4 className="text-lg font-bold text-gray-900">Category</h4>

      {/* Dropdown Select */}
      {loadingCategories ? (
        <div className="text-sm text-gray-500">Loading categories...</div>
      ) : (
        <select
          value={categoryOptions.includes(formData.category) ? formData.category : ''}
          onChange={handleSelectChange}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
        >
          <option value="">Select a Category</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {/* Or Custom Input */}
      <div className="pt-2">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Or add a new category:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customCategory}
            onChange={handleInputChange}
            placeholder="e.g., Startups"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
          />
          <button
            type="button"
            onClick={handleAddCustomCategory}
            className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 rounded-lg font-semibold text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
