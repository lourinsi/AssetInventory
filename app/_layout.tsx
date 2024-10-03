// app\_layout.tsx
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      {/* <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="inventory" options={{ headerTitle: 'Inventory' }} />
      <Stack.Screen name="profile" options={{ headerTitle: 'Profile' }} /> */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(items)" /> */}
      {/* <Stack.Screen name="(items)/addItem2" options={{ headerTitle: 'Add Item2' }} /> */}
      <Stack.Screen name="items/addItem" options={{ headerTitle: 'Add Item' }} />
    </Stack>
  );
};

export default RootLayout;
