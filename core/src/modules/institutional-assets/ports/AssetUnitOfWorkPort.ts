import type { Asset } from "../domain/Asset.js";
import type { Version } from "../../../shared/version/Version.js";

export interface AssetUnitOfWorkPort { commitSupersession(previous: Asset, expectedPreviousVersion: Version, successor: Asset, expectedSuccessorVersion: Version): Promise<void>; }
