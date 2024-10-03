import React, { createContext, useContext, useState, ReactNode } from 'react';

type Item = {
  id: string;
  category: string;
  itemName: string;
  serialNo: string;
  owner: string;
  isServicable: boolean;
  isDeployed: boolean;
  dateOfPurchase: Date;
  purchasePrice: string;
  purchaseFrom: string;
  macAddress: string;
  ipAddress: string;
  remarks: string;
  image: string | null;
};

type ItemsContextType = {
  items: Item[];
  addItem: (item: Item) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within a ItemsProvider');
  }
  return context;
};

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', category: 'Laptops', itemName: 'Laptop 1', serialNo: 'ABC123', owner: 'John Doe', isServicable: true, isDeployed: false, dateOfPurchase: new Date(), purchasePrice: '1000', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:16', ipAddress: '192.168.1.1', remarks: '', image: null },
    { id: '2', category: 'Laptops', itemName: 'Laptop 2', serialNo: 'DEF456', owner: 'Jane Doe', isServicable: true, isDeployed: true, dateOfPurchase: new Date(), purchasePrice: '1200', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:17', ipAddress: '192.168.1.2', remarks: '', image: null },
    { id: '3', category: 'Keyboards', itemName: 'Keyboard 1', serialNo: 'GHI789', owner: 'John Smith', isServicable: true, isDeployed: true, dateOfPurchase: new Date(), purchasePrice: '100', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:18', ipAddress: '192.168.1.3', remarks: '', image: null },
  ]);

  const addItem = (item: Item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
};
