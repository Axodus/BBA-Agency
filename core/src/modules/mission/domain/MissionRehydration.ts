import { Mission } from "./Mission.js";
import { parseMissionSnapshot, type MissionSnapshot } from "./MissionSnapshot.js";

export class MissionRehydration {
  public static fromSnapshot(snapshot: MissionSnapshot): Mission {
    return Mission.rehydrate(parseMissionSnapshot(snapshot));
  }

  public static fromSerialized(serialized: string): Mission {
    return Mission.rehydrate(parseMissionSnapshot(JSON.parse(serialized) as unknown));
  }
}
