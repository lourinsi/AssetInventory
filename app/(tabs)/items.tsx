//app\(tabs)\items.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

type Item = {
  id: string;
  category: string;
  itemName: string;
  serialNo: string;
  owner: string;
};

const Items = () => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', category: 'Laptops', itemName: 'Laptop 1', serialNo: 'ABC123', owner: 'John Doe' },
    { id: '2', category: 'Laptops', itemName: 'Laptop 2', serialNo: 'DEF456', owner: 'Jane Doe' },
    { id: '3', category: 'Keyboards', itemName: 'Keyboard 1', serialNo: 'GHI789', owner: 'John Smith' },
  ]);

  // Calculate the count of items per category
  const groupedItems = items.reduce((acc: { [category: string]: number }, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const renderCategoryItem = ({ item }: { item: string }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item} ({groupedItems[item]})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>

      {/* List of categories with counts */}
      <FlatList
        data={Object.keys(groupedItems)}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
      />

      <Link href="/items/addItem" style={styles.addButton}>
        {/* <TouchableOpacity style={styles.addButton}> */}
          <Text style={styles.addButtonText}>+ Add Item</Text>
        {/* </TouchableOpacity> */}
      </Link>
    </View>
  );
};

export default Items;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
