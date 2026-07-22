import type { PublicationObservationInput } from "../domain/PublicationCommands.js";
import type { PublicationPackage } from "../domain/PublicationPackage.js";

export interface PublicationConnectorEvidencePort {
  validatePublicationObservations(input: { readonly publicationPackage: PublicationPackage; readonly observations: readonly PublicationObservationInput[] }): Promise<void>;
}
