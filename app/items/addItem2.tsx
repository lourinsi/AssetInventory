// app\(items)\addItem2.tsx

import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const AddItem2 = () => {
  return (
    <View style={styles.container}>
      <Text>Add Item Page</Text>
    </View>
  );
}

export default AddItem2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
