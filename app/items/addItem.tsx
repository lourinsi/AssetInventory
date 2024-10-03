import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ScrollView, Image, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const AddItem = () => {
  const [category, setCategory] = useState(''); // Dropdown or user input
  const [customCategory, setCustomCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [isServicable, setIsServicable] = useState<boolean>(true);
  const [isDeployed, setIsDeployed] = useState<boolean>(true);
  const [owner, setOwner] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseFrom, setPurchaseFrom] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigation = useNavigation();
  const categories = ['Laptops', 'Keyboards', 'Monitors', 'Mouse', 'Enter New Category']; // Dropdown options

  const handleSave = () => {
    const newCategory = customCategory || category;
    if (!itemName || !newCategory || category === '' || category === 'Select Category') {
      Alert.alert('Error', 'Please fill in all required fields and select a valid category.');
      return;
    }

    // Here, you can add the logic to save the item (context or state)
    const newItem = {
      category: newCategory,
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
      image: selectedImage,
    };

    Alert.alert('Success', 'Item saved successfully!');
    navigation.goBack();
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dateOfPurchase;
    setShowDatePicker(false);
    setDateOfPurchase(currentDate);
  };

  const renderCustomCategoryInput = () => {
    if (category === 'Enter New Category') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter custom category"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
          {/* Image upload for custom category */}
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />}
        </>
      );
    }
    return renderCategoryImage();
  };

  const renderCategoryImage = () => {
    if (category && category !== 'Enter New Category') {
      // Placeholder images for different categories
      const categoryImages: { [key: string]: any } = {
        Laptops: 'https://example.com/laptop.png',
        Keyboards: 'https://example.com/keyboard.png',
        Monitors: 'https://example.com/monitor.png',
        Mouse: 'https://example.com/mouse.png',
      };
      return <Image source={{ uri: categoryImages[category] }} style={styles.categoryImage} />;
    }
    return null;
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Error', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      {/* ID (auto-filled) */}
      {/* <Text style={styles.label}>ID</Text>
      <TextInput style={styles.input} value={'Auto-generated ID'} editable={false} /> */}

      {/* Category Name */}
      <View>
        <Text style={styles.label}>Category Name</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="Select Category" />
          {categories.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>

      {renderCustomCategoryInput()}

      {/* Item Name */}
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />

      {/* Serial Number */}
      <Text style={styles.label}>Serial No.</Text>
      <TextInput
        style={styles.input}
        placeholder="Serial Number"
        value={serialNo}
        onChangeText={setSerialNo}
      />

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

      {/* Owner */}
      <Text style={styles.label}>Owner</Text>
      <TextInput
        style={styles.input}
        placeholder="Owner"
        value={owner}
        onChangeText={setOwner}
      />

      {/* Date of Purchase */}
      <Text style={styles.label}>Date of Purchase</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{dateOfPurchase.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfPurchase}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Purchase Price */}
      <Text style={styles.label}>Purchase Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Purchase Price"
        value={purchasePrice}
        keyboardType="numeric"
        onChangeText={setPurchasePrice}
      />

      {/* Purchase From */}
      <Text style={styles.label}>Purchase From</Text>
      <TextInput
        style={styles.input}
        placeholder="Purchase From"
        value={purchaseFrom}
        onChangeText={setPurchaseFrom}
      />

      {/* MAC Address */}
      <Text style={styles.label}>Mac Address</Text>
      <TextInput
        style={styles.input}
        placeholder="MAC Address"
        value={macAddress}
        onChangeText={setMacAddress}
      />

      {/* IP Address */}
      <Text style={styles.label}>Internet Protocol</Text>
      <TextInput
        style={styles.input}
        placeholder="IP Address"
        value={ipAddress}
        onChangeText={setIpAddress}
      />

      {/* Remarks */}
      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        placeholder="Remarks"
        value={remarks}
        onChangeText={setRemarks}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddItem;

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
    color: 'Black',
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 20,
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
