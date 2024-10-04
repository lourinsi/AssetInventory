import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ItemsProvider } from './items/itemsContext';

export default function App() {
  return (
    <ItemsProvider>
      <Redirect href="/items" />
    </ItemsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
