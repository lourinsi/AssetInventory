import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useItems } from '../items/itemsContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

type EditCategoryRouteParams = {
  params: {
    categoryId: string;
  };
};

const EditCategory = () => {
  const route = useRoute<RouteProp<EditCategoryRouteParams, 'params'>>();
  const { categoryId } = route.params; // Category ID from route params
  const { categories, editCategory } = useItems();

  const [categoryName, setCategoryName] = useState<string>(''); // To store category name
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  // Fetch the list of categories for the picker
  const categoryList = categories.map(category => category.name);

  useEffect(() => {
    // Find the category based on the categoryId passed in route params
    const currentCategory = categories.find(cat => cat.id === categoryId);
    if (currentCategory) {
      setCategoryName(currentCategory.name); // Set the category name
      setSelectedImage(currentCategory.image || null); // Set category image, default to null if no image
    }
  }, [categoryId, categories]);

  const handleSave = () => {
    const selectedCategoryName = isCreatingNewCategory ? newCategoryName : selectedCategory;
    if (!selectedCategoryName) {
      Alert.alert('Error', 'Please select or enter a category name.');
      return;
    }

    // Update the category
    editCategory(categoryId, { name: selectedCategoryName, image: selectedImage });

    Alert.alert('Success', 'Category updated.');
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Render Category Image or Default
  const renderCategoryImage = () => {
    const currentCategory = categories.find((cat) => cat.id === categoryId);
    // const imageUri = selectedCategory === 'Enter New Category'
    //   ? selectedImage || 'https://reactnative.dev/img/tiny_logo.png'
    //   : currentCategory?.image || 'https://reactnative.dev/img/tiny_logo.png'; // Default image

    const imageUri = currentCategory?.image || 'https://reactnative.dev/img/tiny_logo.png'; // Default image

    return <Image source={{ uri: imageUri }} style={styles.image} />;
  };

  // const renderCategoryImage = () => {
  //   const category = categories.find((cat) => cat.id === categoryId);
  //   const imageUri = category?.image || 'https://reactnative.dev/img/tiny_logo.png'; // Default image if none

  //   if (categoryId === 'Enter New Category') {
  //     const imageUri = selectedImage || 'https://reactnative.dev/img/tiny_logo.png';
  //     return <Image source={{ uri: imageUri }} style={styles.image} />;
  //   }
  //   return <Image source={{ uri: imageUri }} style={styles.image} />;
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>

      {/* Display current category */}
      <Text style={styles.label}>Change "{categoryName}" to:</Text>

      {/* Category Picker */}
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => {
          setSelectedCategory(itemValue);
          setIsCreatingNewCategory(itemValue === 'Enter New Category');
        }}
        style={styles.picker}
      >
        {categoryList.map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
        <Picker.Item label="Enter New Category" value="Enter New Category" />
      </Picker>

      {/* Render category image */}
      {renderCategoryImage()}

      {isCreatingNewCategory && (
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Enter new category name"
          style={styles.input}
        />
      )}

      {/* Image Upload Button */}
      <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditCategory;
