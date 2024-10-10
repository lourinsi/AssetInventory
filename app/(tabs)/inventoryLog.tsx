import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image, Platform, Modal } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // for icons
import { useItems } from '../items/itemsContext'; // Import the items context
import { Link, router } from 'expo-router';

const InventoryLog = () => {
  const { items, categories } = useItems(); // Fetch items and categories from the context

  const addLog = () => {
    // Logic for adding a new log (could open a form)
    Alert.alert('Add New Log', 'This will trigger the add log form.');
    
  };

  const editLog = (id: string) => {
    // Logic to edit a log
    
    Alert.alert('Edit Log', `Editing log with id: ${id}`);
    setShowModal(false);
    router.push({ pathname: '../items/editLog', params: { id } }); // Navigate to the EditCategory screen
  };
  

  const deleteLog = (id: string) => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this log entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            // Logic to delete log (if necessary)
            Alert.alert('Log Deleted', `Log with id: ${id} was deleted.`);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const viewRef = (id: string) => {
    // Logic to view item reference (id)
    Alert.alert('View Reference', `Item ID: ${id}`);
  };

  const renderLogItem = ({ item }: { item: any }) => {
    // Find the category for this item by its categoryId
    const category = categories.find((cat) => cat.id === item.categoryId);

    // Safely check if category exists, then access its properties
    return (
      <View style={styles.logItemContainer}>
        <Image
          source={{ uri: category?.image || 'https://via.placeholder.com/150' }}
          style={styles.itemImage}
        />
        <View style={styles.logInfo}>
        <Text style={styles.categoryName}>{item.itemName}</Text>
          <Text style={styles.details}>{category?.name || 'Unknown Category'}</Text>
          
          <Text style={styles.details}>{item.owner}</Text>
          <Text style={styles.details}>{item.dateOfPurchase.toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity style={styles.dotsMenu} onPress={() => showLogMenu(item.id)}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const showLogMenu = (id: string) => {
    // Simulate a menu with options
    if (Platform.OS === 'web') {
      setSelectedId(id);
      setShowModal(true);
    } else {
      Alert.alert(
        'Log Options',
        '',
        [
          { text: 'Edit', onPress: () => editLog(id) },
          { text: 'Delete', onPress: () => deleteLog(id), style: 'destructive' },
          { text: 'View Ref', onPress: () => viewRef(id) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }

  };

  const LogOptionsModal = () => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Log Options</Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => editLog(selectedId)}>
          <Text style={styles.modalButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={() => deleteLog(selectedId)}>
          <Text style={styles.modalButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={() => viewRef(selectedId)}>
          <Text style={styles.modalButtonText}>View Ref</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Log</Text>

      {/* Logs List */}
      <FlatList
        data={items} // Use items from context
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
      />

      {/* Sticky Add Button */}
      {/* <TouchableOpacity style={styles.addButton} onPress={addLog}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity> */}
      <Link href="/items/addItem" style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add</Text>
      </Link>

      <Modal visible={showModal} animationType="slide">
        <LogOptionsModal />
      </Modal>

    </View>
  );
};

export default InventoryLog;

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
  logItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  logInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
  dotsMenu: {
    padding: 5,
  },  addButton: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
