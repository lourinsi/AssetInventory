// app\(tabs)\_layout.tsx
import { Stack, Tabs } from "expo-router";

const tabs = () => {
  return (
    <Tabs>
      <Tabs.Screen name="items" options={{ headerTitle: 'Items', tabBarLabel: 'Items' }} />
      <Tabs.Screen name="inventoryLog" options={{ headerTitle: 'Inventory', tabBarLabel: 'Inventory Logs' }} />
    </Tabs>
  );
};

export default tabs;
