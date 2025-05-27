import React, { useState } from 'react';
import { PlusCircle, Pill } from 'lucide-react';
import type { MedicineStock } from '@/types/Pharmacy';
import { StockTable } from '@/components/StockTable';
import { StockForm } from '@/components/StockForm';
import { DashboardStats } from '@/components/DashboardStats';

// Sample initial data
const initialStocks: MedicineStock[] = [
  {
    id: '1',
    name: 'Paracetamol',
    quantity: 500,
    price: 299.99,
    expiryDate: '2025-12-31',
    manufacturer: 'PharmaCorp',
    category: 'Painkillers'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    quantity: 200,
    price: 899.99,
    expiryDate: '2025-06-30',
    manufacturer: 'MediLabs',
    category: 'Antibiotics'
  },
  {
    id: '3',
    name: 'Vitamin D3',
    quantity: 1000,
    price: 499.99,
    expiryDate: '2025-08-30',
    manufacturer: 'HealthVit',
    category: 'Vitamins'
  },
  {
    id: '4',
    name: 'Bandages',
    quantity: 750,
    price: 149.99,
    expiryDate: '2026-01-15',
    manufacturer: 'MedCare',
    category: 'First Aid'
  },
  {
    id: '5',
    name: 'Insulin',
    quantity: 150,
    price: 1299.99,
    expiryDate: '2025-04-30',
    manufacturer: 'DiaCare',
    category: 'Chronic'
  }
];

function App() {
  const [stocks, setStocks] = useState<MedicineStock[]>(initialStocks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<MedicineStock | undefined>();

  const handleAddStock = (data: Partial<MedicineStock>) => {
    const newStock: MedicineStock = {
      ...data,
      id: Date.now().toString(),
    } as MedicineStock;
    
    setStocks([...stocks, newStock]);
    setIsFormOpen(false);
  };

  const handleUpdateStock = (data: Partial<MedicineStock>) => {
    if (!editingStock) return;
    
    setStocks(stocks.map(stock => 
      stock.id === editingStock.id ? { ...stock, ...data } : stock
    ));
    
    setEditingStock(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setStocks(stocks.filter(stock => stock.id !== id));
    }
  };

  const handleEdit = (stock: MedicineStock) => {
    setEditingStock(stock);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: 'url(https://wallpaper.dog/large/20378251.jpg)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-white bg-opacity-90 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Pharmacy Stock Management</h1>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Stock
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="px-4 sm:px-6">
          <DashboardStats stocks={stocks} />
        </div>

        {/* Main Content */}
        <div className="mt-8">
          {(isFormOpen || editingStock) ? (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 bg-opacity-95">
              <h2 className="text-lg font-medium mb-4">
                {editingStock ? 'Edit Stock' : 'Add New Stock'}
              </h2>
              <StockForm
                stock={editingStock}
                onSubmit={editingStock ? handleUpdateStock : handleAddStock}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingStock(undefined);
                }}
              />
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg bg-opacity-95">
              <StockTable
                stocks={stocks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;