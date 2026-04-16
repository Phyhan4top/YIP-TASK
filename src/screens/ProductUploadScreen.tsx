import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LimitBanner } from "../components/LimitBanner";
import { ProductCard } from "../components/ProductCard";
import { ProductForm } from "../components/ProductForm";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { useProducts } from "../hooks/useProducts";
import { ProductDraft } from "../types/product";

export function ProductUploadScreen() {
  const {
    addProduct,
    canAddMore,
    deleteProduct,
    isHydrated,
    limitMessage,
    maxProducts,
    products,
    updateProduct,
  } = useProducts();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const editingProduct =
    products.find((product) => product.id === editingProductId) ?? null;
  const limitReached = !canAddMore;

  function handleSave(draft: ProductDraft, productId?: string) {
    const result = productId
      ? updateProduct(productId, draft)
      : addProduct(draft);

    if (!result.ok) {
      Alert.alert("Unable to save", result.error);
      return false;
    }

    if (productId) {
      setEditingProductId(null);
      return true;
    }

    if (result.total === maxProducts) {
      Alert.alert("Product limit reached", limitMessage);
    }

    return true;
  }

  function handleDelete(productId: string) {
    Alert.alert("Delete product", "Remove this product from the list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (editingProductId === productId) {
            setEditingProductId(null);
          }

          deleteProduct(productId);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Simple Inventory Manager</Text>
            <Text style={styles.title}>Add Products Within Smart Limits</Text>
            <Text style={styles.subtitle}>
              A streamlined mobile app for adding, viewing, and managing a
              limited set of products with ease.
            </Text>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{products.length}</Text>
              <Text style={styles.statLabel}>Products saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>
                {maxProducts - products.length}
              </Text>
              <Text style={styles.statLabel}>Slots remaining</Text>
            </View>
          </View>

          {limitReached ? (
            <LimitBanner
              count={products.length}
              max={maxProducts}
              message={limitMessage}
            />
          ) : null}

          <ProductForm
            limitReached={limitReached}
            onCancelEdit={() => setEditingProductId(null)}
            onSave={handleSave}
            product={editingProduct}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved products</Text>
            <Text style={styles.sectionMeta}>
              {products.length}/{maxProducts}
            </Text>
          </View>

          {!isHydrated ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.stateText}>Loading saved products...</Text>
            </View>
          ) : null}

          {isHydrated && products.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>No products yet</Text>
              <Text style={styles.stateText}>
                Add your first item above to start building the list.
              </Text>
            </View>
          ) : null}

          {isHydrated && products.length > 0 ? (
            <View style={styles.list}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  onDelete={() => handleDelete(product.id)}
                  onEdit={() => setEditingProductId(product.id)}
                  product={product}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    gap: SPACING.lg,
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  hero: {
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    padding: SPACING.lg,
  },
  statBlock: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    textTransform: "uppercase",
  },
  statDivider: {
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
    width: 1,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  sectionMeta: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    padding: SPACING.xl,
  },
  stateTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  stateText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  list: {
    gap: SPACING.md,
  },
});
