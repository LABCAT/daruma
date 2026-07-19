import { JSX } from "solid-js";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import "./page-shell.scss";

interface PageShellProps {
  children: JSX.Element;
  title?: string;
}

export function PageShell(props: PageShellProps) {
  return (
    <div class="dm-page-shell">
      <header class="dm-page-shell__header">
        {props.title && <h1 class="dm-page-shell__title">{props.title}</h1>}
        <div style={{ "margin-left": "auto" }}>
          <ThemeToggle />
        </div>
      </header>
      <main class="dm-page-shell__main">
        {props.children}
      </main>
    </div>
  );
}
