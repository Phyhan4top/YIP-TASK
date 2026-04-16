import AsyncStorage from "@react-native-async-storage/async-storage";

import { PRODUCT_STORAGE_KEY } from "../constants/app";
import { Product } from "../types/product";

export async function loadStoredProducts() {
  try {
    const rawValue = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!rawValue) {
      return [] as Product[];
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? (parsedValue as Product[]) : [];
  } catch (error) {
    console.warn("Unable to load stored products", error);
    return [] as Product[];
  }
}

export async function persistProducts(products: Product[]) {
  try {
    await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.warn("Unable to persist products", error);
  }
}
