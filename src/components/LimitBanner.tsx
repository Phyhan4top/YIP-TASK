import { StyleSheet, Text, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";

type LimitBannerProps = {
  count: number;
  max: number;
  message: string;
};

export function LimitBanner({ count, max, message }: LimitBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Upload limit reached</Text>
      <Text style={styles.body}>
        {message}. You can still edit or delete existing items ({count}/{max}).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.warningMuted,
    borderColor: "#F79009",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 4,
    padding: SPACING.md,
  },
  title: {
    color: COLORS.warning,
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    color: COLORS.warning,
    fontSize: 14,
    lineHeight: 20,
  },
});
