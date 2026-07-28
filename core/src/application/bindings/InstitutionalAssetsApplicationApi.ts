import type { InstitutionalAssetsCommandApiPort, InstitutionalAssetsQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { ApplicationCommandContext, AssetCommandResponseDto, AssetDto, CreateAssetRequestDto, GetAssetRequestDto, ListAssetsRequestDto, RegisterAssetRequestDto, RetireAssetRequestDto, QueryContext, AssetSummaryDto } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { institutionalAssetsBindings } from "./InstitutionalAssetsBindings.js";

export class InstitutionalAssetsApplicationApi implements InstitutionalAssetsCommandApiPort, InstitutionalAssetsQueryApiPort {
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner) {}
  public createAsset(command: CreateAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto> { return executeBoundCommand(institutionalAssetsBindings.createAsset, this.commands, command, context); }
  public registerAsset(command: RegisterAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto> { return executeBoundCommand(institutionalAssetsBindings.registerAsset, this.commands, command, context); }
  public retireAsset(command: RetireAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto> { return executeBoundCommand(institutionalAssetsBindings.retireAsset, this.commands, command, context); }
  public getAsset(query: GetAssetRequestDto, context: QueryContext): Promise<AssetDto | null> { return executeBoundQuery(institutionalAssetsBindings.getAsset, this.queries, query, context); }
  public listAssets(query: ListAssetsRequestDto, context: QueryContext): Promise<readonly AssetSummaryDto[]> { return executeBoundQuery(institutionalAssetsBindings.listAssets, this.queries, query, context); }
}
