import { Drawer } from "@bba/ui";
import type { ReactNode } from "react";

export function RouteActionPanel({ title, description, children, onClose }: { readonly title: string; readonly description: string; readonly children: ReactNode; onClose(): void }) { return <Drawer description={description} onOpenChange={(open) => { if (!open) onClose(); }} open title={title}>{children}</Drawer>; }
