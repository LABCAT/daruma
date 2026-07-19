import { JSX } from "solid-js";
import "./text-input.scss";

interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: JSX.Element;
}

export function TextInput(props: TextInputProps) {
  return (
    <div class="dm-text-input">
      {props.label && <label class="dm-text-input__label" for={props.id}>{props.label}</label>}
      <div class="dm-text-input__wrapper">
        {props.icon && <div class="dm-text-input__icon">{props.icon}</div>}
        <input 
          {...props} 
          class={`dm-text-input__field ${props.icon ? 'dm-text-input__field--with-icon' : ''} ${props.error ? 'dm-text-input__field--error' : ''} ${props.class || ""}`} 
        />
      </div>
      {(props.error || props.helperText) && (
        <span class={`dm-text-input__helper ${props.error ? 'dm-text-input__helper--error' : ''}`}>
          {props.error || props.helperText}
        </span>
      )}
    </div>
  );
}
