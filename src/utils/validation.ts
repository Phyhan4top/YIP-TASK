import { ProductDraft } from "../types/product";

export type ProductFormErrors = Partial<Record<keyof ProductDraft, string>>;

export function parsePrice(value: string) {
  return Number.parseFloat(value.replace(/,/g, ""));
}

export function sanitizePriceInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");

  if (parts.length <= 1) {
    return cleaned;
  }

  return `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
}

export function validateProductDraft(draft: ProductDraft) {
  const errors: ProductFormErrors = {};
  const parsedPrice = parsePrice(draft.price);

  if (!draft.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!draft.price.trim()) {
    errors.price = "Product price is required.";
  } else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    errors.price = "Enter a valid price greater than zero.";
  }

  if (!draft.imageUri.trim()) {
    errors.imageUri = "Choose a product photo before saving.";
  }

  return errors;
}

export function hasValidationErrors(errors: ProductFormErrors) {
  return Object.values(errors).some(Boolean);
}

export function getFirstErrorMessage(errors: ProductFormErrors) {
  return Object.values(errors).find(Boolean) ?? "Unable to save this product.";
}
