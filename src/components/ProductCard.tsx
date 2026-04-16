import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { Product } from "../types/product";
import { formatPrice } from "../utils/currency";

type ProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageUri }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.copy}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.meta}>Updated {new Date(product.updatedAt).toLocaleString()}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}>
            <Text style={styles.editLabel}>Edit</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}>
            <Text style={styles.deleteLabel}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    padding: SPACING.md,
  },
  image: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    height: 92,
    width: 92,
  },
  body: {
    flex: 1,
    gap: SPACING.sm,
    justifyContent: "space-between",
  },
  copy: {
    gap: 4,
  },
  name: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  price: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  editButton: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.dangerMuted,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
  },
  editLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  deleteLabel: {
    color: COLORS.danger,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
