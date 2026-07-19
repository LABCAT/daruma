import { JSX } from "solid-js";
import "./Badge.scss";

interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "danger" | "success" | "warning";
}

export function Badge(props: BadgeProps) {
  const variant = props.variant || "default";
  
  return (
    <div
      {...props}
      class={`dm-badge dm-badge--${variant} ${props.class || ""}`}
    >
      {props.children}
    </div>
  );
}
