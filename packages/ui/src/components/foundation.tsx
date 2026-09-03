import * as Dialog from "@radix-ui/react-dialog";
import { cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactNode, useId } from "react";
import { Link as RouterLink, NavLink as RouterNavLink, type LinkProps, type NavLinkProps } from "react-router-dom";

function classes(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export type SemanticState = "neutral" | "running" | "awaiting" | "approved" | "rejected" | "failed" | "attention";

export function Button({ className, variant = "primary", ...props }: ComponentPropsWithoutRef<"button"> & { readonly variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={classes("bba-button", `bba-button--${variant}`, className)} {...props} />;
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={classes("bba-input", className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) { return <textarea className={classes("bba-input", "bba-textarea", className)} {...props} />; }
export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) { return <select className={classes("bba-input", className)} {...props} />; }
export function Checkbox({ label, ...props }: ComponentPropsWithoutRef<"input"> & { readonly label: string }) { return <label className="bba-checkbox"><input type="checkbox" {...props} /><span>{label}</span></label>; }

export function Field({ label, hint, error, id: providedId, children }: { readonly label: string; readonly hint?: string; readonly error?: string; readonly id?: string; readonly children: ReactNode }) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const control = isValidElement<{ id?: string; "aria-describedby"?: string }>(children) ? cloneElement(children, { id: children.props.id ?? id, "aria-describedby": children.props["aria-describedby"] ?? descriptionId }) : children;
  return <div className="bba-field"><label htmlFor={id}>{label}</label>{control}<div id={descriptionId} className={classes("bba-field__message", error && "bba-field__message--error")}>{error ?? hint}</div></div>;
}

export function Card({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={classes("bba-card", className)} {...props} />;
}

export function Badge({ tone = "neutral", ...props }: ComponentPropsWithoutRef<"span"> & { readonly tone?: "neutral" | "positive" | "warning" }) {
  return <span className={`bba-badge bba-badge--${tone}`} {...props} />;
}

export function StatusBadge({ state, children, className, ...props }: ComponentPropsWithoutRef<"span"> & { readonly state: SemanticState }) {
  return <span className={classes("bba-status", `bba-status--${state}`, className)} {...props}><span aria-hidden="true" className="bba-status__mark" />{children}</span>;
}

export function Alert({ title, children, tone = "danger" }: { readonly title: string; readonly children: ReactNode; readonly tone?: "danger" | "info" }) {
  return <div className={`bba-alert bba-alert--${tone}`} role="alert"><strong>{title}</strong><div>{children}</div></div>;
}

export function Spinner({ label = "Carregando" }: { readonly label?: string }) {
  return <span className="bba-spinner" role="status"><span aria-hidden="true" className="bba-spinner__mark" />{label}</span>;
}

export function EmptyState({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return <div className="bba-empty"><strong>{title}</strong><div>{children}</div></div>;
}

export function Panel({ eyebrow, title, action, children, className, ...props }: ComponentPropsWithoutRef<"section"> & { readonly eyebrow?: string; readonly title: string; readonly action?: ReactNode }) {
  return <section className={classes("bba-panel", className)} {...props}><header className="bba-panel__header"><div>{eyebrow === undefined ? null : <span className="bba-panel__eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action}</header><div className="bba-panel__body">{children}</div></section>;
}

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly content: ReactNode;
}

export function Tabs({ items, activeId, onChange, label }: { readonly items: readonly TabItem[]; readonly activeId: string; readonly label: string; onChange(id: string): void }) {
  const active = items.find((item) => item.id === activeId) ?? items[0];
  if (active === undefined) return null;
  return <div className="bba-tabs"><div aria-label={label} className="bba-tabs__list" role="tablist">{items.map((item) => <button aria-controls={`${item.id}-panel`} aria-selected={item.id === active.id} id={`${item.id}-tab`} key={item.id} onClick={() => onChange(item.id)} role="tab" type="button">{item.label}</button>)}</div><div aria-labelledby={`${active.id}-tab`} className="bba-tabs__panel" id={`${active.id}-panel`} role="tabpanel">{active.content}</div></div>;
}

export function Table({ className, children, ...props }: ComponentPropsWithoutRef<"table">) {
  return <div className="bba-table-wrap"><table className={classes("bba-table", className)} {...props}>{children}</table></div>;
}

export function Skeleton({ lines = 3, label = "Carregando conteúdo" }: { readonly lines?: number; readonly label?: string }) {
  return <div aria-busy="true" aria-label={label} className="bba-skeleton" role="status">{Array.from({ length: lines }, (_, index) => <span key={index} />)}</div>;
}

export function Feedback({ title, children, tone = "info" }: { readonly title: string; readonly children: ReactNode; readonly tone?: "info" | "success" | "danger" }) {
  return <div className={`bba-feedback bba-feedback--${tone}`} role={tone === "danger" ? "alert" : "status"}><strong>{title}</strong><span>{children}</span></div>;
}

export function Link(props: LinkProps) { return <RouterLink {...props} />; }
export function NavLink({ className, ...props }: NavLinkProps) {
  return <RouterNavLink className={(state) => classes("bba-nav-link", state.isActive && "bba-nav-link--active", typeof className === "function" ? className(state) : className)} {...props} />;
}
export function SkipLink({ targetId = "main-content", label = "Skip to main content" }: { readonly targetId?: string; readonly label?: string }) { return <a className="bba-skip-link" href={`#${targetId}`}>{label}</a>; }

export function Drawer({ trigger, title, description, children, open, onOpenChange }: { readonly trigger?: ReactNode; readonly title: string; readonly description?: string; readonly children: ReactNode; readonly open?: boolean; onOpenChange?(open: boolean): void }) {
  return <Dialog.Root {...(open === undefined ? {} : { open })} {...(onOpenChange === undefined ? {} : { onOpenChange })}>{trigger === undefined ? null : <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}<Dialog.Portal><Dialog.Overlay className="bba-drawer__overlay" /><Dialog.Content className="bba-drawer__content"><Dialog.Title>{title}</Dialog.Title>{description === undefined ? null : <Dialog.Description>{description}</Dialog.Description>}<div className="bba-drawer__body">{children}</div><Dialog.Close asChild><Button variant="ghost" aria-label="Close navigation">Close</Button></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function Modal({ trigger, title, description, children, open, onOpenChange }: { readonly trigger?: ReactNode; readonly title: string; readonly description?: string; readonly children: ReactNode; readonly open?: boolean; onOpenChange?(open: boolean): void }) {
  return <Dialog.Root {...(open === undefined ? {} : { open })} {...(onOpenChange === undefined ? {} : { onOpenChange })}>{trigger === undefined ? null : <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}<Dialog.Portal><Dialog.Overlay className="bba-dialog__overlay" /><Dialog.Content className="bba-dialog__content"><div className="bba-dialog__header"><div><Dialog.Title>{title}</Dialog.Title>{description === undefined ? null : <Dialog.Description>{description}</Dialog.Description>}</div><Dialog.Close asChild><Button aria-label="Fechar modal" variant="ghost">Fechar</Button></Dialog.Close></div><div className="bba-dialog__body">{children}</div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function ConfirmationDialog({ trigger, title, description, confirmLabel, onConfirm }: { readonly trigger: ReactNode; readonly title: string; readonly description: ReactNode; readonly confirmLabel: string; onConfirm(): void }) {
  return <Dialog.Root><Dialog.Trigger asChild>{trigger}</Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="bba-drawer__overlay" /><Dialog.Content className="bba-confirmation"><Dialog.Title>{title}</Dialog.Title><Dialog.Description asChild><div>{description}</div></Dialog.Description><div className="bba-confirmation__actions"><Dialog.Close asChild><Button variant="secondary">Voltar</Button></Dialog.Close><Dialog.Close asChild><Button onClick={onConfirm}>{confirmLabel}</Button></Dialog.Close></div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
