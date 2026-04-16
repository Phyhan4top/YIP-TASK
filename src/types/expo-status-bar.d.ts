declare module "expo-status-bar" {
  import { ComponentType } from "react";

  export type StatusBarStyle = "auto" | "inverted" | "light" | "dark";

  export type StatusBarProps = {
    style?: StatusBarStyle;
    animated?: boolean;
    hidden?: boolean;
    backgroundColor?: string;
    translucent?: boolean;
  };

  export const StatusBar: ComponentType<StatusBarProps>;
}
