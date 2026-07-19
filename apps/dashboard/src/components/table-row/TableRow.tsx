import { JSX } from "solid-js";
import "./table-row.scss";

interface TableRowProps {
  children: JSX.Element;
  isHeader?: boolean;
}

export function TableRow(props: TableRowProps) {
  return (
    <div class={`dm-table-row ${props.isHeader ? "dm-table-row--header" : "dm-table-row--data"}`}>
      {props.children}
    </div>
  );
}
