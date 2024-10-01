import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="inventory" options={{ headerTitle: 'Inventory' }} />
    </Stack>
  );
};

export default RootLayout;
