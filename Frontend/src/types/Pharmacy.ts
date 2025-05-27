export interface MedicineStock {
    id: string;
    name: string;
    quantity: number;
    price: number;
    expiryDate: string;
    manufacturer: string;
    category: string;
  }
  
  export type StockUpdateData = Partial<MedicineStock>;