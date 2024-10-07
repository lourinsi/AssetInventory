// app\(tabs)\_layout.tsx
import { Stack, Tabs } from "expo-router";

const tabs = () => {
  return (
    <Tabs>
      <Tabs.Screen name="items" options={{ headerTitle: 'Items' }} />
      <Tabs.Screen name="inventoryLog" options={{ headerTitle: 'Inventory' }} />
      
    </Tabs>
  );
};

export default tabs;
