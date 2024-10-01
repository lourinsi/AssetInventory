import { StyleSheet, Text, View, FlatList, Button, TextInput, TouchableOpacity, Alert, Modal, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

type Equipment = {
  id: string;
  name: string;
  type: string;
  description: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

const Inventory = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Validate inputs
  const validateForm = () => {
    if (!name || !type || !description || !quantity || !price) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }

    if (isNaN(Number(quantity)) || parseInt(quantity) <= 0) {
      Alert.alert('Validation Error', 'Quantity must be a positive integer');
      return false;
    }

    if (isNaN(Number(price)) || parseFloat(price) <= 0) {
      Alert.alert('Validation Error', 'Price must be a positive number');
      return false;
    }

    return true;
  };

  // Add or update equipment
  const handleSubmit = () => {
    if (!validateForm()) return; // Validate and stop submission if validation fails

    if (isEditing && editingId) {
      const updatedEquipments = equipments.map((equipment) =>
        equipment.id === editingId
          ? {
              ...equipment,
              name,
              type,
              description,
              quantity: parseInt(quantity),
              price: parseFloat(price),
              totalPrice: parseInt(quantity) * parseFloat(price),
            }
          : equipment
      );
      setEquipments(updatedEquipments);
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newEquipment: Equipment = {
        id: Math.random().toString(),
        name,
        type,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        totalPrice: parseInt(quantity) * parseFloat(price),
      };
      setEquipments([...equipments, newEquipment]);
    }

    resetForm();
    setModalVisible(false);
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setType('');
    setDescription('');
    setQuantity('');
    setPrice('');
    setIsEditing(false);
    setEditingId(null);
  };

  // Delete equipment
  const deleteEquipment = (id: string) => {
    console.log('Alert function called');
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this equipment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedEquipments = equipments.filter((item) => item.id !== id);
            setEquipments(updatedEquipments);
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Edit equipment
  const editEquipment = (id: string) => {
    const equipmentToEdit = equipments.find((item) => item.id === id);
    if (equipmentToEdit) {
      setName(equipmentToEdit.name);
      setType(equipmentToEdit.type);
      setDescription(equipmentToEdit.description);
      setQuantity(equipmentToEdit.quantity.toString());
      setPrice(equipmentToEdit.price.toString());
      setIsEditing(true);
      setEditingId(id);
      setModalVisible(true);
    }
  };

  // Handle closing the modal
  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipment List</Text>

      {/* Button to open modal for adding new equipment */}
      <Button title="Add New Equipment" onPress={() => setModalVisible(true)} />

      {/* Equipment List */}
      <FlatList
        data={equipments}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Name: {item.name}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
            <Text>Total Price: ${item.totalPrice.toFixed(2)}</Text>

            {/* Edit Button */}
            <TouchableOpacity onPress={() => editEquipment(item.id)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity onPress={() => deleteEquipment(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Modal for Add/Edit Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Equipment' : 'Add a New Equipment'}</Text>

          {/* Equipment Name Input */}
          <Text>Equipment Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Equipment Name"
            value={name}
            onChangeText={setName}
          />

          {/* Equipment Type Input */}
          <Text>Equipment Type:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Equipment Type"
            value={type}
            onChangeText={setType}
          />

          {/* Description Input */}
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            value={description}
            onChangeText={setDescription}
          />

          {/* Quantity Input */}
          <Text>Quantity:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          {/* Price Input */}
          <Text>Price:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Add/Update Button */}
          <Button title={isEditing ? "Update Equipment" : "Add New Equipment"} onPress={handleSubmit} />

          {/* Close Modal Button */}
          <TouchableOpacity onPress={() => closeModal()} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});
