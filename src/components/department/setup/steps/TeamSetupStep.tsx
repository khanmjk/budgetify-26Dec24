import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '../../../common/FormField';
import { generateId } from '../../../../utils/generateId';
import type { Team, Manager } from '../../../../types/models';

interface TeamSetupStepProps {
  data: {
    teams: Team[];
    managers: Manager[];
  };
  departmentId: string;
  onUpdate: (data: { teams: Team[]; managers: Manager[] }) => void;
  onNext: () => void;
}

export const TeamSetupStep: React.FC<TeamSetupStepProps> = ({
  data,
  departmentId,
  onUpdate,
  onNext
}) => {
  const [error, setError] = useState('');

  const handleAddTeam = () => {
    const managerId = generateId();
    
    onUpdate({
      managers: [
        ...data.managers,
        {
          id: managerId,
          name: '',
          departmentId
        }
      ],
      teams: [
        ...data.teams,
        {
          id: generateId(),
          name: '',
          managerId
        }
      ]
    });
  };

  const handleUpdateTeam = (index: number, updates: Partial<Team>) => {
    const newTeams = [...data.teams];
    newTeams[index] = { ...newTeams[index], ...updates };
    onUpdate({ ...data, teams: newTeams });
  };

  const handleUpdateManager = (index: number, name: string) => {
    const newManagers = [...data.managers];
    newManagers[index] = { ...newManagers[index], name };
    onUpdate({ ...data, managers: newManagers });
  };

  const handleRemoveTeam = (index: number) => {
    const managerId = data.teams[index].managerId;
    onUpdate({
      teams: data.teams.filter((_, i) => i !== index),
      managers: data.managers.filter(m => m.id !== managerId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data.teams.length === 0) {
      setError('At least one team is required');
      return;
    }

    if (data.teams.some(team => !team.name.trim())) {
      setError('All teams must have a name');
      return;
    }

    if (data.managers.some(manager => !manager.name.trim())) {
      setError('All teams must have a manager');
      return;
    }

    // Check for duplicate team names
    const names = new Set();
    for (const team of data.teams) {
      const normalizedName = team.name.trim().toLowerCase();
      if (names.has(normalizedName)) {
        setError('Team names must be unique');
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
          <h2 className="text-lg font-medium text-gray-900">Teams</h2>
          <button
            type="button"
            onClick={handleAddTeam}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Team
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {data.teams.map((team, index) => (
            <div key={team.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Team Name"
                    type="text"
                    required
                    value={team.name}
                    onChange={(e) => handleUpdateTeam(index, { name: e.target.value })}
                  />
                  <FormField
                    label="Team Manager"
                    type="text"
                    required
                    value={data.managers[index].name}
                    onChange={(e) => handleUpdateManager(index, e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTeam(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {data.teams.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No teams added yet</p>
              <button
                type="button"
                onClick={handleAddTeam}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first team
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
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