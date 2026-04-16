export type Product = {
  id: string;
  name: string;
  price: number;
  imageUri: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductDraft = {
  name: string;
  price: string;
  imageUri: string;
};
