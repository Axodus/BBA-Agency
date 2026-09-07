import {
  Bell, Buildings, FileText, GearSix, House, List, Package, Palette,
  ShieldCheck, Target, UserCircle,
} from "@phosphor-icons/react";
import { BbaProductShell as SharedProductShell, type ProductShellNavigationItem } from "@bba/app-shell";

const primaryNavigation: readonly ProductShellNavigationItem[] = [
  { to: "/", label: "Overview", icon: <House size={18} weight="regular" />, end: true },
  { to: "/missions", label: "Missions", icon: <Target size={18} weight="regular" /> },
  { to: "/institutional-assets", label: "Institutional Assets", icon: <FileText size={18} weight="regular" /> },
  { to: "/distribution-packages", label: "Distribution Packages", icon: <Package size={18} weight="regular" /> },
  { to: "/governance", label: "Governance", icon: <ShieldCheck size={18} weight="regular" /> },
  { to: "/institution", label: "Institution", icon: <Buildings size={18} weight="regular" /> },
];

const systemNavigation: readonly ProductShellNavigationItem[] = [
  { to: "/account", label: "Account", icon: <UserCircle size={18} weight="regular" /> },
  { to: "/settings", label: "Settings", icon: <GearSix size={18} weight="regular" /> },
  { to: "/ui-kit", label: "UI Kit", icon: <Palette size={18} weight="regular" /> },
];

export function BbaProductShell() {
  return <SharedProductShell institution="Acme Institute" menuIcon={<List size={22} weight="bold" />} notificationIcon={<Bell size={19} />} primaryNavigation={primaryNavigation} steward={{ initials: "AL", name: "Ana Lemos" }} systemNavigation={systemNavigation} workspaceContext="Governance Lineage" workspaceLabel="Mission Workspace" />;
}
