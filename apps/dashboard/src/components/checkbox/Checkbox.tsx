import { JSX } from "solid-js";
import { Check } from "lucide-solid";
import "./Checkbox.scss";

interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export function Checkbox(props: CheckboxProps) {
  const { label, description, class: className, ...rest } = props;

  return (
    <label class={`dm-checkbox-wrapper ${className || ""}`}>
      <div class="dm-checkbox">
        <input type="checkbox" class="dm-checkbox__input" {...rest} />
        <div class="dm-checkbox__box">
          <Check class="dm-checkbox__icon" />
        </div>
      </div>
      {(label || description) && (
        <div class="dm-checkbox__text">
          {label && <span class="dm-checkbox__label">{label}</span>}
          {description && <p class="dm-checkbox__description">{description}</p>}
        </div>
      )}
    </label>
  );
}
