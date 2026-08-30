import type { CommandReceipt } from "@bba/sdk-react";
import { Badge, Card, Link } from "@bba/ui";

export function CommandReceiptView({ receipt, returnTo }: { readonly receipt: CommandReceipt; readonly returnTo: string }) {
  return <Card><Badge tone="positive">Operação concluída</Badge><h2>{receipt.operationId}</h2><dl className="bba-definition"><div><dt>Transaction</dt><dd>{receipt.transactionId}</dd></div><div><dt>Correlation</dt><dd>{receipt.correlationId}</dd></div>{receipt.resourceReferences.map((reference) => <div key={`${reference.type}:${reference.id}`}><dt>{reference.type}</dt><dd>{reference.id}</dd></div>)}</dl><Link to={returnTo}>Voltar ao detalhe</Link></Card>;
}
