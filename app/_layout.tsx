// app\_layout.tsx
import { Stack } from "expo-router";
import { ItemsProvider } from "./items/itemsContext";

const RootLayout = () => {
  return (
    <ItemsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="items/addItem" options={{ headerTitle: 'Add Item' }} />
      </Stack>
    </ItemsProvider>

  );
};

export default RootLayout;
