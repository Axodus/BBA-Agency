import { Button, Drawer } from "@bba/ui";
import type { ReactNode } from "react";

export function ActionPanel({ title, description, children }: { readonly title: string; readonly description: string; readonly children: ReactNode }) {
  return <Drawer title={title} description={description} trigger={<Button variant="secondary">{title}</Button>}>{children}</Drawer>;
}
