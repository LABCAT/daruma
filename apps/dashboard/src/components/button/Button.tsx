import { JSX } from "solid-js";
import "./button.scss";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button(props: ButtonProps) {
  const variant = props.variant || "primary";
  const size = props.size || "md";
  
  return (
    <button
      {...props}
      class={`dm-button dm-button--${variant} dm-button--${size} ${props.class || ""}`}
    >
      {props.children}
    </button>
  );
}
