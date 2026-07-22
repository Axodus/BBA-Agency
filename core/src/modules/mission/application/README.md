# Mission Application

## Public API do módulo

The application barrel exports `CreateMission`, `RenameMission`,
`ActivateMission`, `CompleteMission`, and `MissionNotFoundError`.

Loading coordination remains internal. Application use cases consume the
`MissionRepository` port and do not depend on infrastructure adapters.
