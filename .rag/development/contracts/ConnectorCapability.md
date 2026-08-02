# Connector Capability Contract

`ConnectorCapability` is an immutable entity owned by exactly one Connector.
It contains a capability type, immutable supported `ConnectorOperationKey`
values and technical metadata. It never contains content, credentials or
references to institutional Aggregates.
