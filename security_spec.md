# Security Spec - Spark Zing

## Data Invariants
1. A product must have a name, price, stock, and status.
2. Prices and stock must be non-negative.
3. Orders must be linked to a customer name (or user ID in future).
4. Timestamp fields `createdAt` and `updatedAt` must be verified by the server.

## The Dirty Dozen Payloads
1. Product Create: Missing name.
2. Product Create: Negative price.
3. Product Create: Spoofing `createdAt` to the past.
4. Product Update: Modifier trying to change `createdAt`.
5. Product Update: Changing price to a string.
6. Order Create: Negative total amount.
7. Order Update: Changing the status to an invalid value.
8. Unauthorized Read: Unauthenticated user trying to list orders (if restricted).
9. Unauthorized Write: Unauthenticated user trying to create a product.
10. ID Poisoning: Using a 2KB string as a product ID.
11. Array Poisoning: Sending a 10,000 item list in an order (if restricted).
12. Field Poisoning: Adding a `isVerified: true` field to a user profile (system-only field).

## Test Runner
(Tests would be implemented in `firestore.rules.test.ts` if a test environment was available. Here we focus on drafting and linting the rules.)
