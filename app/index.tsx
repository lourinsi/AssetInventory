import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    
    <View style={styles.container}>
      <Text>Asset Inventory</Text>
      <StatusBar style="auto" />
      <Link href="/inventory" style={{ color: 'blue' }}>
        Go to Inventory
      </Link>
      <Link href="/(tabs)/inventoryLog" style={{ color: 'blue' }}>
        Go to Inventory Logs
      </Link>
      <Link href="/(tabs)/items" style={{ color: 'blue' }}>
        Go to Items
      </Link>
      <Link href="/items/addItem" style={{ color: 'blue' }}>
        Add Item
      </Link>
      <Link href="/profile" style={{ color: 'blue', marginTop: 10 }}>
        Go to Profile
      </Link>
    </View>
  );

  // return <Redirect href="/items"></Redirect>
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
