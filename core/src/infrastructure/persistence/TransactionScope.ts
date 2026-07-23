import { PersistenceFailure } from "../../shared/errors/PersistenceFailure.js";
import type { TransactionContext } from "./TransactionContext.js";
import type { PersistenceProviderPort } from "./PersistencePorts.js";
import type { UnitOfWorkPort } from "./PersistencePorts.js";

export class TransactionScope {
  private static readonly active = new WeakMap<object, UnitOfWorkPort>();
  public static async run<T>(unitOfWork: UnitOfWorkPort, work: () => Promise<T>): Promise<T> {
    if (this.active.has(unitOfWork)) throw new PersistenceFailure("TransactionScope cannot be nested with the same UnitOfWork");
    this.active.set(unitOfWork, unitOfWork);
    try { const result = await work(); await unitOfWork.commit(); return result; } catch (error) { await unitOfWork.rollback(); throw error; } finally { this.active.delete(unitOfWork); }
  }
  public static contextOf(context: TransactionContext): TransactionContext { return context; }
}

export class UnitOfWorkFactory {
  public constructor(private readonly provider: PersistenceProviderPort) {}
  public create(context: TransactionContext): UnitOfWorkPort { return this.provider.begin(context); }
  public async run<T>(context: TransactionContext, work: (unitOfWork: UnitOfWorkPort) => Promise<T>): Promise<T> {
    const unitOfWork = this.create(context);
    return TransactionScope.run(unitOfWork, () => work(unitOfWork));
  }
}
