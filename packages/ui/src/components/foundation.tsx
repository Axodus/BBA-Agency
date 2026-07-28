import * as Dialog from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";
import { Link as RouterLink, NavLink as RouterNavLink, type LinkProps, type NavLinkProps } from "react-router-dom";

function classes(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function Button({ className, variant = "primary", ...props }: ComponentPropsWithoutRef<"button"> & { readonly variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={classes("bba-button", `bba-button--${variant}`, className)} {...props} />;
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={classes("bba-input", className)} {...props} />;
}

export function Field({ label, hint, error, id: providedId, children }: { readonly label: string; readonly hint?: string; readonly error?: string; readonly id?: string; readonly children: ReactNode }) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  return <div className="bba-field"><label htmlFor={id}>{label}</label>{children}<div id={descriptionId} className={classes("bba-field__message", error && "bba-field__message--error")}>{error ?? hint}</div></div>;
}

export function Card({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={classes("bba-card", className)} {...props} />;
}

export function Badge({ tone = "neutral", ...props }: ComponentPropsWithoutRef<"span"> & { readonly tone?: "neutral" | "positive" | "warning" }) {
  return <span className={`bba-badge bba-badge--${tone}`} {...props} />;
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

export function Link(props: LinkProps) { return <RouterLink {...props} />; }
export function NavLink({ className, ...props }: NavLinkProps) {
  return <RouterNavLink className={(state) => classes("bba-nav-link", state.isActive && "bba-nav-link--active", typeof className === "function" ? className(state) : className)} {...props} />;
}
export function SkipLink({ targetId = "main-content" }: { readonly targetId?: string }) { return <a className="bba-skip-link" href={`#${targetId}`}>Pular para o conteúdo principal</a>; }

export function Drawer({ trigger, title, description, children }: { readonly trigger: ReactNode; readonly title: string; readonly description?: string; readonly children: ReactNode }) {
  return <Dialog.Root><Dialog.Trigger asChild>{trigger}</Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="bba-drawer__overlay" /><Dialog.Content className="bba-drawer__content"><Dialog.Title>{title}</Dialog.Title>{description === undefined ? null : <Dialog.Description>{description}</Dialog.Description>}<div className="bba-drawer__body">{children}</div><Dialog.Close asChild><Button variant="ghost" aria-label="Fechar navegação">Fechar</Button></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
