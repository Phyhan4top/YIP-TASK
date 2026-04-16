import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { LIMIT_MESSAGE, MAX_PRODUCTS } from "../constants/app";
import { Product, ProductDraft } from "../types/product";
import { persistProducts, loadStoredProducts } from "../utils/storage";
import {
  getFirstErrorMessage,
  hasValidationErrors,
  parsePrice,
  validateProductDraft,
} from "../utils/validation";

type ProductMutationResult =
  | {
      ok: true;
      total: number;
    }
  | {
      ok: false;
      error: string;
    };

type ProductContextValue = {
  products: Product[];
  isHydrated: boolean;
  canAddMore: boolean;
  maxProducts: number;
  limitMessage: string;
  addProduct: (draft: ProductDraft) => ProductMutationResult;
  updateProduct: (id: string, draft: ProductDraft) => ProductMutationResult;
  deleteProduct: (id: string) => void;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildProductRecord(draft: ProductDraft, existingProduct?: Product): Product {
  const now = new Date().toISOString();

  return {
    id: existingProduct?.id ?? createId(),
    name: draft.name.trim(),
    price: parsePrice(draft.price),
    imageUri: draft.imageUri,
    createdAt: existingProduct?.createdAt ?? now,
    updatedAt: now,
  };
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProducts() {
      const storedProducts = await loadStoredProducts();

      if (isMounted) {
        setProducts(storedProducts);
        setIsHydrated(true);
      }
    }

    hydrateProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    persistProducts(products);
  }, [products, isHydrated]);

  function addProduct(draft: ProductDraft): ProductMutationResult {
    if (products.length >= MAX_PRODUCTS) {
      return { ok: false, error: LIMIT_MESSAGE };
    }

    const errors = validateProductDraft(draft);

    if (hasValidationErrors(errors)) {
      return { ok: false, error: getFirstErrorMessage(errors) };
    }

    const nextProducts = [buildProductRecord(draft), ...products];

    setProducts(nextProducts);
    return { ok: true, total: nextProducts.length };
  }

  function updateProduct(id: string, draft: ProductDraft): ProductMutationResult {
    const existingProduct = products.find((product) => product.id === id);

    if (!existingProduct) {
      return { ok: false, error: "This product no longer exists." };
    }

    const errors = validateProductDraft(draft);

    if (hasValidationErrors(errors)) {
      return { ok: false, error: getFirstErrorMessage(errors) };
    }

    const updatedProduct = buildProductRecord(draft, existingProduct);
    const nextProducts = products.map((product) =>
      product.id === id ? updatedProduct : product
    );

    setProducts(nextProducts);
    return { ok: true, total: nextProducts.length };
  }

  function deleteProduct(id: string) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        isHydrated,
        canAddMore: products.length < MAX_PRODUCTS,
        maxProducts: MAX_PRODUCTS,
        limitMessage: LIMIT_MESSAGE,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProductContext must be used inside ProductProvider");
  }

  return context;
}
