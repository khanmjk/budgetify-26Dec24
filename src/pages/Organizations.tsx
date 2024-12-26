import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBudgetStore } from '../store/budgetStore';
import { Building2, ChevronRight, DollarSign, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BudgetCategoryModal } from '../components/organization/BudgetCategoryModal';

export const Organizations: React.FC = () => {
  const store = useBudgetStore();
  const [selectedOrgId, setSelectedOrgId] = useState(store.organizations[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const selectedOrg = store.organizations.find(org => org.id === selectedOrgId);
  if (!selectedOrg) return null;

  const departments = store.departments.filter(d => d.organizationId === selectedOrgId);
  const stats = store.getOrganizationBudgetInfo(selectedOrgId);
  const categories = selectedOrg.budgetCategories;

  // Prepare data for category utilization chart
  const prepareCategoryData = () => {
    if (selectedCategory === 'all') {
      return categories.map(category => {
        const data: any = {
          name: category.name,
        };

        departments.forEach(dept => {
          const deptSpending = store.budgetItems
            .filter(item => {
              const team = store.teams.find(t => t.budget?.id === item.budgetId);
              const manager = team ? store.managers.find(m => m.id === team.managerId) : null;
              return manager?.departmentId === dept.id && item.budgetCategoryId === category.id;
            })
            .reduce((sum, item) => sum + (item.spent || 0), 0);

          data[dept.name] = deptSpending;
        });

        return data;
      });
    } else {
      const category = categories.find(c => c.id === selectedCategory);
      if (!category) return [];

      return [{
        name: category.name,
        ...departments.reduce((acc, dept) => {
          const deptSpending = store.budgetItems
            .filter(item => {
              const team = store.teams.find(t => t.budget?.id === item.budgetId);
              const manager = team ? store.managers.find(m => m.id === team.managerId) : null;
              return manager?.departmentId === dept.id && item.budgetCategoryId === category.id;
            })
            .reduce((sum, item) => sum + (item.spent || 0), 0);

          acc[dept.name] = deptSpending;
          return acc;
        }, {})
      }];
    }
  };

  const chartData = prepareCategoryData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {store.organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <span className="text-gray-500 text-sm">Leader: {selectedOrg.leaderName}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Categories
          </button>
          <Link
            to="/organization/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Organization
          </Link>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-900">Total Budget</h3>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ${selectedOrg.totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-900">Allocated</h3>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            ${stats.allocated.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-900">Spent</h3>
          </div>
          <p className="text-2xl font-semibold text-blue-600">
            ${stats.spent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-medium text-gray-900">Remaining</h3>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            ${stats.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget Category Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Budget Category Utilization</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              {departments.map((dept, index) => (
                <Bar
                  key={dept.id}
                  dataKey={dept.name}
                  stackId="a"
                  fill={`hsl(${index * (360 / departments.length)}, 70%, 60%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Department Summary</h3>
        <div className="space-y-4">
          {departments.map(dept => {
            const stats = store.getDepartmentBudgetInfo(dept.id);
            return (
              <Link
                key={dept.id}
                to={`/department/${dept.id}`}
                className="block p-4 rounded-lg border hover:border-indigo-500 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-500">Head: {dept.departmentHeadName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Allocated</p>
                      <p className="text-sm font-medium text-indigo-600">
                        ${stats.allocated.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Spent</p>
                      <p className="text-sm font-medium text-blue-600">
                        ${stats.spent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="text-sm font-medium text-green-600">
                        ${stats.remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {showCategoryModal && (
        <BudgetCategoryModal
          organizationId={selectedOrgId}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};