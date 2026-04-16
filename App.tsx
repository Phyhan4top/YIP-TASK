import { StatusBar } from "expo-status-bar";

import { ProductProvider } from "./src/context/ProductContext";
import { ProductUploadScreen } from "./src/screens/ProductUploadScreen";

export default function App() {
  return (
    <ProductProvider>
      <StatusBar style="dark" />
      <ProductUploadScreen />
    </ProductProvider>
  );
}
