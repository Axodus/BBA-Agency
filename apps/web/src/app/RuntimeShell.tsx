import { BbaAppShell, type ShellRuntimeState } from "@bba/app-shell";
import { useBbaSdkState } from "@bba/sdk-react";

export function RuntimeShell() {
  const state = useBbaSdkState();
  const runtime: ShellRuntimeState = state.status === "READY"
    ? { status: "READY", tenantId: state.tenantId, session: state.principal }
    : state;
  return <BbaAppShell runtime={runtime} />;
}
