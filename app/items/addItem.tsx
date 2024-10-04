import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useItems } from './itemsContext';

const AddItem = () => {
  const { addItem, categories, addCategory } = useItems();
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [isServicable, setIsServicable] = useState(true);
  const [isDeployed, setIsDeployed] = useState(true);
  const [owner, setOwner] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseFrom, setPurchaseFrom] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

  // Handle Save Item
  const handleSave = () => {
    if (!itemName || (!categoryId && !customCategory)) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const newItem = {
      id: Math.random().toString(),
      categoryId: customCategory ? Math.random().toString() : categoryId,
      itemName,
      serialNo,
      isServicable,
      isDeployed,
      owner,
      dateOfPurchase,
      purchasePrice,
      purchaseFrom,
      macAddress,
      ipAddress,
      remarks,
      image: selectedImage || 'https://reactnative.dev/img/tiny_logo.png', // Use default image if none selected
    };

    addItem(newItem);
    if (customCategory) {
      addCategory({ id: newItem.categoryId, name: customCategory, image: selectedImage || 'https://reactnative.dev/img/tiny_logo.png' });
    }
    Alert.alert('Success', 'Item saved successfully!');
    navigation.goBack();
  };

  // Handle Image Upload
  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handle Date Picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfPurchase(selectedDate);
    }
  };

  // Render Category Image or Default
  const renderCategoryImage = () => {
    if (categoryId && categoryId !== 'Enter New Category') {
      const category = categories.find((cat) => cat.id === categoryId);
      const imageUri = category?.image || 'https://reactnative.dev/img/tiny_logo.png';
      return <Image source={{ uri: imageUri }} style={styles.image} />;
    }

    if (categoryId === 'Enter New Category') {
      const imageUri = selectedImage || 'https://reactnative.dev/img/tiny_logo.png';
      return <Image source={{ uri: imageUri }} style={styles.image} />;
    }

    return null;
  };

  // Automatically display the category image on load
  useEffect(() => {
    if (categoryId && categoryId !== 'Enter New Category') {
      renderCategoryImage();
    }
  }, [categoryId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      {/* Category Picker */}
      <Text style={styles.label}>Category Name</Text>
      <Picker selectedValue={categoryId} onValueChange={(itemValue) => setCategoryId(itemValue)} style={styles.picker}>
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
        <Picker.Item label="Enter New Category" value="Enter New Category" />
      </Picker>

      {categoryId === 'Enter New Category' && (
        <TextInput style={styles.input} placeholder="Enter New Category" value={customCategory} onChangeText={setCustomCategory} />
      )}

      {renderCategoryImage()}

      {categoryId === 'Enter New Category' && (
        <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
          <Text style={styles.imageUploadText}>Upload Image</Text>
        </TouchableOpacity>
      )}

      {/* Item Details */}
      <Text style={styles.label}>Item Name</Text>
      <TextInput style={styles.input} value={itemName} onChangeText={setItemName} placeholder="Enter item name" />

      <Text style={styles.label}>Serial No</Text>
      <TextInput style={styles.input} value={serialNo} onChangeText={setSerialNo} placeholder="Enter serial number" />

      {/* Servicable */}
      <Text style={styles.label}>Servicable</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isServicable === true && styles.activeToggle]}
          onPress={() => setIsServicable(true)}
        >
          <Text style={styles.toggleText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, isServicable === false && styles.activeToggle]}
          onPress={() => setIsServicable(false)}
        >
          <Text style={styles.toggleText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Deployed */}
      <Text style={styles.label}>Deployed</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isDeployed === true && styles.activeToggle]}
          onPress={() => setIsDeployed(true)}
        >
          <Text style={styles.toggleText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, isDeployed === false && styles.activeToggle]}
          onPress={() => setIsDeployed(false)}
        >
          <Text style={styles.toggleText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Fields */}
      <Text style={styles.label}>Owner</Text>
      <TextInput style={styles.input} value={owner} onChangeText={setOwner} placeholder="Enter owner name" />

      <Text style={styles.label}>Date of Purchase</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{dateOfPurchase.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={dateOfPurchase} mode="date" display="default" onChange={handleDateChange} />}

      <Text style={styles.label}>Purchase Price</Text>
      <TextInput style={styles.input} value={purchasePrice} onChangeText={setPurchasePrice} placeholder="Enter purchase price" />

      <Text style={styles.label}>Purchase From</Text>
      <TextInput style={styles.input} value={purchaseFrom} onChangeText={setPurchaseFrom} placeholder="Enter source" />

      <Text style={styles.label}>MAC Address</Text>
      <TextInput style={styles.input} value={macAddress} onChangeText={setMacAddress} placeholder="Enter MAC address" />

      <Text style={styles.label}>Internet Protocol</Text>
      <TextInput style={styles.input} value={ipAddress} onChangeText={setIpAddress} placeholder="Enter IP address" />

      <Text style={styles.label}>Remarks</Text>
      <TextInput style={styles.input} value={remarks} onChangeText={setRemarks} placeholder="Enter any remarks" />
      
      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  imageUpload: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  imageUploadText: {
    color: '#007bff',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddItem;
