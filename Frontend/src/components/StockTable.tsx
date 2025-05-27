import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { MedicineStock } from '@/types/Pharmacy';

interface StockTableProps {
  stocks: MedicineStock[];
  onEdit: (stock: MedicineStock) => void;
  onDelete: (id: string) => void;
}

export function StockTable({ stocks, onEdit, onDelete }: StockTableProps) {
  const getStockStatus = (stock: MedicineStock) => {
    const today = new Date();
    const expiryDate = new Date(stock.expiryDate);
    
    if (expiryDate < today) {
      return {
        label: 'Expired',
        className: 'bg-red-100 text-red-800'
      };
    }
    
    if (stock.quantity < 20) {
      return {
        label: 'Low Stock',
        className: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    return {
      label: 'In Stock',
      className: 'bg-green-100 text-green-800'
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stocks.map((stock) => {
            const status = getStockStatus(stock);
            return (
              <tr key={stock.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{stock.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.expiryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(stock)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(stock.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}