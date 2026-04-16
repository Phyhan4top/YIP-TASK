import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { LIMIT_MESSAGE } from "../constants/app";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { Product, ProductDraft } from "../types/product";
import {
  ProductFormErrors,
  sanitizePriceInput,
  validateProductDraft,
} from "../utils/validation";

type ProductFormProps = {
  product?: Product | null;
  disabled?: boolean;
  limitReached: boolean;
  onSave: (draft: ProductDraft, productId?: string) => boolean;
  onCancelEdit: () => void;
};

export function ProductForm({
  product,
  disabled = false,
  limitReached,
  onSave,
  onCancelEdit,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [imageUri, setImageUri] = useState(product?.imageUri ?? "");
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const isEditing = Boolean(product);
  const isFormDisabled = disabled || (limitReached && !isEditing);

  useEffect(() => {
    setName(product?.name ?? "");
    setPrice(product ? String(product.price) : "");
    setImageUri(product?.imageUri ?? "");
    setErrors({});
  }, [product]);

  async function pickImage(source: "camera" | "gallery") {
    if (isFormDisabled) {
      return;
    }

    try {
      if (source === "gallery") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert("Permission required", "Allow photo library access to choose an image.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.85,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
          setImageUri(result.assets[0].uri);
          setErrors((currentErrors) => ({ ...currentErrors, imageUri: undefined }));
        }

        return;
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Allow camera access to capture a product image.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setErrors((currentErrors) => ({ ...currentErrors, imageUri: undefined }));
      }
    } catch (error) {
      Alert.alert("Image error", "The image picker could not complete that action.");
      console.warn("Unable to select image", error);
    }
  }

  function handleSave() {
    const draft = {
      name,
      price,
      imageUri,
    };
    const nextErrors = validateProductDraft(draft);

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const saved = onSave(draft, product?.id);

    if (saved && !product) {
      setName("");
      setPrice("");
      setImageUri("");
      setErrors({});
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{isEditing ? "Edit product" : "Add a product"}</Text>
          <Text style={styles.subtitle}>
            Enter the product details, attach a photo, and save it to the list.
          </Text>
        </View>
        {isEditing ? (
          <Pressable onPress={onCancelEdit} style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}>
            <Text style={styles.ghostButtonLabel}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      {limitReached && !isEditing ? (
        <View style={styles.limitNotice}>
          <Text style={styles.limitNoticeText}>{LIMIT_MESSAGE}</Text>
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Product name</Text>
        <TextInput
          editable={!isFormDisabled}
          onChangeText={(value) => {
            setName(value);
            setErrors((currentErrors) => ({ ...currentErrors, name: undefined }));
          }}
          placeholder="e.g. Travel Mug"
          placeholderTextColor={COLORS.textMuted}
          style={[styles.input, isFormDisabled && styles.inputDisabled]}
          value={name}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Product price</Text>
        <TextInput
          editable={!isFormDisabled}
          keyboardType="decimal-pad"
          onChangeText={(value) => {
            setPrice(sanitizePriceInput(value));
            setErrors((currentErrors) => ({ ...currentErrors, price: undefined }));
          }}
          placeholder="e.g. 49.99"
          placeholderTextColor={COLORS.textMuted}
          style={[styles.input, isFormDisabled && styles.inputDisabled]}
          value={price}
        />
        {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Product photo</Text>
        <View style={styles.photoActions}>
          <Pressable
            onPress={() => pickImage("gallery")}
            style={({ pressed }) => [styles.secondaryButton, isFormDisabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>Gallery</Text>
          </Pressable>
          <Pressable
            onPress={() => pickImage("camera")}
            style={({ pressed }) => [styles.secondaryButton, isFormDisabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>Camera</Text>
          </Pressable>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewText}>Image preview will appear here.</Text>
          </View>
        )}

        {errors.imageUri ? <Text style={styles.errorText}>{errors.imageUri}</Text> : null}
      </View>

      <Pressable
        disabled={isFormDisabled}
        onPress={handleSave}
        style={({ pressed }) => [
          styles.primaryButton,
          isFormDisabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isEditing ? "Update product" : "Save product"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: SPACING.sm,
    justifyContent: "space-between",
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
  },
  inputDisabled: {
    backgroundColor: "#F2F4F7",
    color: COLORS.textMuted,
  },
  photoActions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  previewImage: {
    borderRadius: RADIUS.md,
    height: 180,
    width: "100%",
  },
  previewPlaceholder: {
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 180,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  previewText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: SPACING.md,
  },
  primaryButtonLabel: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: SPACING.md,
  },
  secondaryButtonLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  ghostButton: {
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  ghostButtonLabel: {
    color: COLORS.text,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
  },
  limitNotice: {
    backgroundColor: COLORS.warningMuted,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  limitNoticeText: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: "600",
  },
});
