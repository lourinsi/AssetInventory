// app\_layout.tsx
import { Stack } from "expo-router";
import { ItemsProvider } from "./items/itemsContext";

const RootLayout = () => {
  return (
    <ItemsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="items/addItem" options={{ headerTitle: 'Add Item' }} />
        <Stack.Screen name="items/editCategory" options={{ headerTitle: 'Edit Category' }} />
        <Stack.Screen name="items/editLog" options={{ headerTitle: 'Edit Item' }} />
      </Stack>
    </ItemsProvider>

  );
};

export default RootLayout;
