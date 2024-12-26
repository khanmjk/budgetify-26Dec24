import React from 'react';
import { FormField } from '../../../common/FormField';
import type { Organization } from '../../../../types/models';

interface BasicInfoStepProps {
  data: Partial<Organization>;
  onUpdate: (data: Partial<Organization>) => void;
  onNext: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Organization Information</h2>
        
        <div className="space-y-4">
          <FormField
            label="Organization Name"
            type="text"
            required
            value={data.name || ''}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
          />

          <FormField
            label="Leader Name"
            type="text"
            required
            value={data.leaderName || ''}
            onChange={(e) => onUpdate({ ...data, leaderName: e.target.value })}
          />

          <FormField
            label="Total Budget"
            type="number"
            min="0"
            step="0.01"
            required
            value={data.totalBudget || ''}
            onChange={(e) => onUpdate({ ...data, totalBudget: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};