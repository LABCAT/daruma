import { JSX } from "solid-js";
import "./Switch.scss";

interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Switch(props: SwitchProps) {
  // Extract label and class, pass the rest to the input
  const { label, class: className, ...rest } = props;

  return (
    <label class={`dm-switch-wrapper ${className || ""}`}>
      <div class="dm-switch">
        <input type="checkbox" class="dm-switch__input" {...rest} />
        <span class="dm-switch__slider"></span>
      </div>
      {label && <span class="dm-switch__label">{label}</span>}
    </label>
  );
}
