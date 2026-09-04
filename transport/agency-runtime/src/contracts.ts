export type AiProvider = "OPENAI" | "ANTHROPIC";

export interface ProviderCredential {
  readonly provider: AiProvider;
  readonly apiKey: string;
  readonly model: string;
  readonly expiresAt: number;
}

export interface ProviderCredentialVault {
  get(tenantId: string, subject: string, provider: AiProvider, now?: number): ProviderCredential | undefined;
  put(tenantId: string, subject: string, credential: Omit<ProviderCredential, "expiresAt">, now?: number): void;
  delete(tenantId: string, subject: string, provider: AiProvider): void;
  status(tenantId: string, subject: string, now?: number): readonly { readonly provider: AiProvider; readonly configured: boolean; readonly model?: string | undefined; readonly expiresAt?: string | undefined; }[];
}

export interface CommandIdempotencyStore {
  execute<T>(input: { readonly tenantId: string; readonly subject: string; readonly operationId: string; readonly key: string; readonly fingerprint: string; readonly createdAt: string }, command: () => Promise<T>): Promise<{ readonly body: T; readonly replayed: boolean }>;
}
