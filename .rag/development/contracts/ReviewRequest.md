# ReviewRequest Contract

ReviewRequest is an immutable Entity owned exclusively by one Review.
`ReviewRequestId` is stable and distinct from `ReviewId`. A Review can never
replace or remove its request.

The request contains ReviewScope, review type, non-empty criteria, requester,
request timestamp and an optional later due timestamp. Requester and all scope
targets must belong to the Review Tenant.

ReviewScope accepts neutral Asset, AssetVersion, Knowledge and Policy
references. It never loads or copies canonical content.
