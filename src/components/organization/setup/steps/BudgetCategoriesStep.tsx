import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '../../../common/FormField';
import type { BudgetCategory } from '../../../../types/models';
import { generateId } from '../../../../utils/generateId';

interface BudgetCategoriesStepProps {
  data: BudgetCategory[];
  onUpdate: (categories: BudgetCategory[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BudgetCategoriesStep: React.FC<BudgetCategoriesStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack
}) => {
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    onUpdate([
      ...data,
      {
        id: generateId(),
        name: '',
        description: '',
        organizationId: '' // Will be set when organization is created
      }
    ]);
  };

  const handleUpdateCategory = (index: number, updates: Partial<BudgetCategory>) => {
    const newCategories = [...data];
    newCategories[index] = { ...newCategories[index], ...updates };
    onUpdate(newCategories);
  };

  const handleRemoveCategory = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate categories
    if (data.length === 0) {
      setError('At least one budget category is required');
      return;
    }

    if (data.some(cat => !cat.name.trim())) {
      setError('All categories must have a name');
      return;
    }

    // Check for duplicate names
    const names = new Set();
    for (const cat of data) {
      const normalizedName = cat.name.trim().toLowerCase();
      if (names.has(normalizedName)) {
        setError('Category names must be unique');
        return;
      }
      names.add(normalizedName);
    }

    setError('');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Budget Categories</h2>
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {data.map((category, index) => (
            <div key={category.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-4">
                <FormField
                  label="Category Name"
                  type="text"
                  required
                  value={category.name}
                  onChange={(e) => handleUpdateCategory(index, { name: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={category.description}
                    onChange={(e) => handleUpdateCategory(index, { description: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No budget categories added yet</p>
              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first category
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};