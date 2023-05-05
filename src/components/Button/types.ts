export interface IButtonProps {
  size?: "default" | "large" | "small";
  type?: "default" | "primary" | "danger" | "link";
  icon?: boolean;
  onClick?: () => void;
}
