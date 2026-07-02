# ADR-004: Paystack for Payment Processing

## Decision

Use Paystack as the primary payment gateway.

## Reason

- Native support for African currencies (NGN, GHS, ZAR, etc.)
- Simple REST API with webhook support
- Transparent transaction fees
- Strong developer documentation and SDK
- Supports cards, USSD, bank transfer, mobile money
- PCI-DSS compliant (reduces compliance burden)

## Consequences

- Payment flows must be idempotent
- Webhook signature verification required
- Transaction reference must be unique per attempt
- Refund logic must be handled manually via dashboard or API
- Fallback gateway may be needed for non-African markets later