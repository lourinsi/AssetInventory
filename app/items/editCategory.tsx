import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useItems } from '../items/itemsContext';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

type EditCategoryRouteParams = {
  params: {
    categoryId: string;
  };
};

const EditCategory = () => {
  const route = useRoute<RouteProp<EditCategoryRouteParams, 'params'>>();
  const { categoryId } = route.params; // Category ID from route params
  const { categories, items, editCategory, mergeCategories, addCategory } = useItems();

  const [categoryName, setCategoryName] = useState<string>(''); // To store category name
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [isImageManuallyChanged, setIsImageManuallyChanged] = useState(false); // New flag to track manual image change

  const navigation = useNavigation();
  
  // When the component mounts or categoryId changes, set initial values
  useEffect(() => {
    const currentCategory = categories.find(cat => cat.id === categoryId);
    if (currentCategory) {
      setCategoryName(currentCategory.name);
      setSelectedCategory(currentCategory.id);
      setSelectedImage(currentCategory.image || null);
      setIsImageManuallyChanged(false); // Reset this when loading a new category
    }
  }, [categoryId, categories]);

  // This effect runs when the selected category changes
  useEffect(() => {
    if (!isImageManuallyChanged) {
      const currentCategory = categories.find(cat => cat.id === selectedCategory);
      if (currentCategory) {
        setSelectedImage(currentCategory.image || 'https://reactnative.dev/img/tiny_logo.png');
      } else if (selectedCategory === 'Enter New Category') {
        setSelectedImage(null); // Allow new category to have a custom image
      }
    }
  }, [selectedCategory, categories, isImageManuallyChanged]);

  const handleSave = () => {
    alert("Saved");
    const selectedCategoryName = isCreatingNewCategory ? newCategoryName : categories.find(cat => cat.id === selectedCategory)?.name;
    
    // alert(`Selected Category: ${selectedCategory}, Category Name: ${categoryName}`);

    if (!selectedCategoryName) {
      Alert.alert('Error', 'Please select or enter a category name.');
      return;
    }

    // Check for duplicate categories
    const duplicateCategory = categories.find(
      cat => cat.name.toLowerCase() === selectedCategoryName.toLowerCase() && cat.id !== categoryId
      
    );
    
    if(selectedCategoryName === categoryName){
        alert("Same Category, no changes should apply");
    }else if(selectedCategory === 'Enter New Category' && duplicateCategory){
        alert('Error, Category already exists');
        return;
    }else if (duplicateCategory) {
        // If a duplicate category exists, merge the categories and update the image
        alert("Duplicate found. Is now merging....");

        // Update the image of the duplicate category if a new image was selected
        if (isImageManuallyChanged) {
          editCategory(duplicateCategory.id, { name: duplicateCategory.name, image: selectedImage });
          alert(`Image for ${duplicateCategory.name} updated`);
        }

        mergeCategories(categoryId, duplicateCategory.id);
        Alert.alert('Success', `Category merged with "${duplicateCategory.name}".`);
    } else {
      if (!isCreatingNewCategory) {

                // Update the existing category with the new image and name
                editCategory(categoryId, { name: selectedCategoryName, image: selectedImage });
                Alert.alert('Success', 'Category updated.');

        // Add the new category
        addCategory({ id: Math.random().toString(), name: selectedCategoryName, image: selectedImage });
        alert(`Image: ${selectedImage}`);
        Alert.alert('Success', 'Category added.');
      } else {
        // Update the existing category with the new image and name
        editCategory(categoryId, { name: selectedCategoryName, image: selectedImage });
        
        Alert.alert('Success', 'Category updated.');
      }
      
    }
    navigation.goBack();
  };

  // const handleSave = () => {
  //   const selectedCategoryName = isCreatingNewCategory ? newCategoryName : categories.find(cat => cat.id === selectedCategory)?.name;
  
  //   if (!selectedCategoryName) {
  //     Alert.alert('Error', 'Please select or enter a category name.');
  //     return;
  //   }
  
  //   // Check for duplicate categories
  //   const duplicateCategory = categories.find(
  //     cat => cat.name.toLowerCase() === selectedCategoryName.toLowerCase() && cat.id !== categoryId
  //   );
  
  //   if (duplicateCategory) {
  //     // If a duplicate category exists, merge the categories and apply the image
  //     mergeCategories(categoryId, duplicateCategory.id);
  //     editCategory(duplicateCategory.id, { name: duplicateCategory.name, image: selectedImage }); // Update image
  //     Alert.alert('Success', `Category merged with "${duplicateCategory.name}". Image updated.`);
  //   } else {
  //     if (isCreatingNewCategory) {
  //       // Add the new category with the uploaded/changed image
  //       addCategory({ id: Math.random().toString(), name: selectedCategoryName, image: selectedImage });
  //       Alert.alert('Success', 'New category added with image.');
  //     } else {
  //       // Update the existing category with the new name and image
  //       editCategory(categoryId, { name: selectedCategoryName, image: selectedImage });
  //       Alert.alert('Success', 'Category updated with new image.');
  //     }
  //   }
  // };

  
  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setIsImageManuallyChanged(true); // Set this flag to true when the image is manually uploaded
    }
  };

  const renderCategoryImage = () => (
    <Image
      source={{ uri: selectedImage || 'https://reactnative.dev/img/tiny_logo.png' }} // Default image if none
      style={styles.image}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>
      <Text style={styles.label}>Change "{categoryName}" to:</Text>

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => {
          setSelectedCategory(itemValue);
          setIsCreatingNewCategory(itemValue === 'Enter New Category');
          setIsImageManuallyChanged(false); // Reset image change flag on category change
        }}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
        ))}
        <Picker.Item label="Enter New Category" value="Enter New Category" />
      </Picker>

      {renderCategoryImage()}

      {isCreatingNewCategory && (
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Enter new category name"
          style={styles.input}
        />
      )}

      <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>
          {isCreatingNewCategory ? 'Upload Image' : 'Change Image'}
        </Text>
      </TouchableOpacity>

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
