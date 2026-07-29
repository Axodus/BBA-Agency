import type { Version } from "../../../shared/version/Version.js";
import type { Asset } from "../domain/Asset.js";
import type { AssetUnitOfWorkPort } from "../ports/AssetUnitOfWorkPort.js";
import { InMemoryAssetRepository } from "./InMemoryAssetRepository.js";

export class InMemoryAssetUnitOfWork implements AssetUnitOfWorkPort { public constructor(private readonly repository: InMemoryAssetRepository) {} public async commitSupersession(previous: Asset, expectedPreviousVersion: Version, successor: Asset, expectedSuccessorVersion: Version): Promise<void> { this.repository.commitPair(previous, expectedPreviousVersion, successor, expectedSuccessorVersion); } }
