import React from 'react';
import { IndianRupee, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import type { MedicineStock } from '@/types/Pharmacy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStatsProps {
  stocks: MedicineStock[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardStats({ stocks }: DashboardStatsProps) {
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
  const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const lowStockItems = stocks.filter(stock => stock.quantity < 100).length;
  
  // Prepare data for category distribution
  const categoryData = stocks.reduce((acc: { name: string; value: number }[], stock) => {
    const existing = acc.find(item => item.name === stock.category);
    if (existing) {
      existing.value += stock.quantity;
    } else {
      acc.push({ name: stock.category, value: stock.quantity });
    }
    return acc;
  }, []);

  // Prepare data for stock value by item
  const stockValueData = stocks.map(stock => ({
    name: stock.name,
    value: stock.price * stock.quantity
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Stats Cards */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <IndianRupee className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Value</p>
            <p className="text-xl font-semibold">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-full">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-xl font-semibold">{totalItems.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
            <p className="text-xl font-semibold">{lowStockItems}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Categories</p>
            <p className="text-xl font-semibold">{categoryData.length}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Top 5 Items by Value</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-full lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}