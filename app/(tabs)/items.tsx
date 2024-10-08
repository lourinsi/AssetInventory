import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { Link, useNavigation, useRouter } from 'expo-router';
import { useItems } from '../items/itemsContext';

const Items = () => {
  const { items, categories, deleteItem } = useItems();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Group items by categoryId and link them with their corresponding category image and name
  const groupedItems = items.reduce((acc: { [categoryId: string]: { count: number, image: string | null, name: string } }, item) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    if (category) {
      if (!acc[item.categoryId]) {
        acc[item.categoryId] = { count: 0, image: category.image, name: category.name };
      }
      acc[item.categoryId].count += 1;
    }
    return acc;
  }, {});

  const renderCategoryItem = ({ item }: { item: string }) => (
    <View style={styles.categoryItem}>
      {/* Category Image on the left */}
      <Image
        source={groupedItems[item].image ? { uri: groupedItems[item].image! } : { uri: 'https://png.pngtree.com/png-clipart/20191122/original/pngtree-laptop-icon-png-image_5184713.jpg' }} // Default image if no image available
        style={styles.categoryImage}
      />

      {/* Category Name and Count */}
      <Text style={styles.categoryText}>{groupedItems[item].name} ({groupedItems[item].count})</Text>

      {/* Three dots on the right */}
      <TouchableOpacity onPress={() => openOptions(item)} style={styles.optionsButton}>
        <Text style={styles.optionsText}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  const openOptions = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setModalVisible(true);
  };

  const handleDelete = () => {
    console.log('Deleted ');
    items.filter(item => item.categoryId === selectedCategoryId).forEach(item => deleteItem(item.id));
    setModalVisible(false);
  };

  const router = useRouter();

  const handleEdit = () => {
    console.log('Edit is opened');
    setModalVisible(false); // Close the modal before navigating
    router.push(`/items/editCategory?categoryId=${selectedCategoryId}`); // Navigate to the EditCategory screen
  };

  const ItemsScreen = () => {
    const { categories, items } = useItems(); // Example data fetching from context
  
    if (!categories.length || !items.length) {
      return <Text>Loading...</Text>; // Display this while data is loading
    };
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>

      {/* List of categories with item counts */}
      <FlatList
        data={Object.keys(groupedItems)}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
      />

      {/* Add button at the bottom */}
      <Link href="/items/addItem" style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add</Text>
      </Link>

      {/* Modal for Edit/Delete options */}
      <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleEdit} style={styles.modalOption}>
          
            <Text style={styles.modalOptionText}>Edit</Text>

          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalOption}>
            <Text style={styles.modalOptionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  categoryText: {
    flex: 1, // Allow the text to grow and push the options button to the right
    fontSize: 18,
  },
  optionsButton: {
    paddingHorizontal: 10,
  },
  optionsText: {
    fontSize: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 200,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Items;
