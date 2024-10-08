import React, { createContext, useContext, useState, ReactNode } from 'react';

type Category = {
  id: string;
  name: string;
  image: string | null;
};

type Item = {
  id: string;
  categoryId: string; // Refers to the Category by its ID
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
};

type ItemsContextType = {
  items: Item[];
  categories: Category[];
  addItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  editItem: (id: string, updatedItem: Partial<Item>) => void;
  addCategory: (category: Category) => void;
  editCategory: (categoryId: string, updatedCategory: Partial<Category>) => void;
  mergeCategories: (categoryId: string, existingCategoryId: string) => void;
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
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Laptops', image: 'https://png.pngtree.com/png-clipart/20191122/original/pngtree-laptop-icon-png-image_5184713.jpg' },
    { id: '2', name: 'Keyboards', image: 'https://png.pngtree.com/png-clipart/20220916/original/pngtree-3d-keyboard-with-wire-color-black-text-white-png-image_8620523.png' },
    { id: '3', name: 'Monitors', image: 'https://png.pngtree.com/png-clipart/20190611/original/pngtree-vector-computer-monitor-png-image_2330278.jpg' },
    { id: '4', name: 'Mouse', image: 'https://png.pngtree.com/png-clipart/20190629/original/pngtree-black-computer-mouse-scroll-internet-png-image_4074897.jpg' },
  ]);

  const [items, setItems] = useState<Item[]>([
    { id: '1', categoryId: '1', itemName: 'Laptop 1', serialNo: 'ABC123', owner: 'John Doe', isServicable: true, isDeployed: false, dateOfPurchase: new Date(), purchasePrice: '1000', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:16', ipAddress: '192.168.1.1', remarks: '' },
    { id: '2', categoryId: '1', itemName: 'Laptop 2', serialNo: 'DEF456', owner: 'Jane Doe', isServicable: true, isDeployed: true, dateOfPurchase: new Date(), purchasePrice: '1200', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:17', ipAddress: '192.168.1.2', remarks: '' },
    { id: '3', categoryId: '2', itemName: 'Keyboard 1', serialNo: 'GHI789', owner: 'John Smith', isServicable: true, isDeployed: true, dateOfPurchase: new Date(), purchasePrice: '100', purchaseFrom: 'Company', macAddress: '00:0a:95:9d:68:18', ipAddress: '192.168.1.3', remarks: '' },
  ]);

  const addItem = (item: Item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const editItem = (id: string, updatedItem: Partial<Item>) => {
    setItems((prevItems) => prevItems.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const addCategory = (category: Category) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };

  const editCategory = (categoryId: string, updatedCategory: Partial<Category>) => {

    
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat.id === categoryId ? { ...cat, ...updatedCategory } : cat))
    );
  
    // If category name is updated, we should also update all items under this category
    if (updatedCategory.name) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.categoryId === categoryId ? { ...item, categoryId } : item // Items still refer to the correct categoryId
        )
      );
    }
  };
  
  const mergeCategories = (categoryId: string, existingCategoryId: string) => {
    // Move all items from the category being merged to the existing category
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.categoryId === categoryId ? { ...item, categoryId: existingCategoryId } : item
      )
    );
  
    // Remove the category being merged
    setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryId));
  };
  
  


  return (
    <ItemsContext.Provider value={{ items, categories, addItem, deleteItem, editItem, addCategory, editCategory, mergeCategories}}>
      {children}
    </ItemsContext.Provider>
  );
};
