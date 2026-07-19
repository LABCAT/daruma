import { JSX } from "solid-js";
import "./Alert.scss";

interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning";
  title?: string;
  icon?: JSX.Element;
}

export function Alert(props: AlertProps) {
  const variant = props.variant || "default";
  
  return (
    <div
      {...props}
      class={`dm-alert dm-alert--${variant} ${props.class || ""}`}
      role="alert"
    >
      {props.icon && <div class="dm-alert__icon">{props.icon}</div>}
      <div class="dm-alert__content">
        {props.title && <h5 class="dm-alert__title">{props.title}</h5>}
        <div class="dm-alert__description">{props.children}</div>
      </div>
    </div>
  );
}
