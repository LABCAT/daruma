import { JSX } from "solid-js";
import "./stack.scss";

interface StackProps {
  children: JSX.Element;
  space?: "1" | "2" | "3" | "4" | "5" | "6" | "8";
}

export function Stack(props: StackProps) {
  return (
    <div class={`dm-stack dm-stack--space-${props.space ?? "3"}`}>
      {props.children}
    </div>
  );
}
