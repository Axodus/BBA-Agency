# Connector Evidence Contract

Successful executions require `ExternalEvidenceSuccess`; failed executions
require `ExternalEvidenceFailure`. Cancellation requires an audit reason and
does not simulate external evidence.

Evidence contains technical identifiers, provider references, timestamps,
checksums and diagnostic metadata only. Raw requests, raw responses,
credentials, tokens and institutional payloads are prohibited.
