# Playbook 03 — Code-Based Domain Violation

## Purpose

This playbook demonstrates that V1.1 detects invalid cross-domain dependencies from actual TypeScript source-code imports.

It intentionally introduces a dependency from the booking domain to the customer domain.

## What this playbook demonstrates

- Cross-domain dependencies are discovered from source-code imports.
- Allowed domain dependencies are governed by `governance.profile.json`.
- The `domain-boundary` rule detects dependencies that are not explicitly allowed.
- The TypeScript adapter can support DDD-style bounded-context governance.

## Baseline assumption

The clean baseline should pass before starting this playbook:

```bash
yarn governance:check
```

## Introduce the violation manually

Open:

```txt
packages/booking-domain/src/index.ts
```

Add this import near the top of the file:

```ts
import type { Customer } from '@demo/customer-domain';
```

This creates the following dependency:

```txt
booking-domain -> customer-domain
```

Given the wrapper classification, this means:

```txt
booking -> customer
```

That is intentionally invalid in this demo.

## Run the check

```bash
yarn governance:check
```

## Expected result

The check should fail with an error-level `domain-boundary` violation.

Expected message shape:

```txt
Project booking-domain in domain booking depends on customer-domain in domain customer.
```

## Why this is a violation

The demo profile allows:

```txt
booking -> shared
customer -> shared
shared -> no outgoing domain dependencies
```

It does not allow:

```txt
booking -> customer
```

This reflects a common DDD governance rule:

```txt
A domain should not reach directly into another domain unless that dependency is explicit and intentional.
```

## Revert the manual change

Remove this import from `packages/booking-domain/src/index.ts`:

```ts
import type { Customer } from '@demo/customer-domain';
```

Run the check again:

```bash
yarn governance:check
```

The check should pass again.

## Patch-based execution

If the repository contains a patch file for this scenario, use:

```bash
git apply playbooks/patches/introduce-code-domain-violation.patch
yarn governance:check
git apply -R playbooks/patches/introduce-code-domain-violation.patch
```

## Architectural lesson

The governance model makes bounded-context policy executable:

```txt
Cross-domain dependencies must be intentional, explicit, and governed.
```

In V1 this violation was modeled manually in the canonical workspace document.

In V1.1 this violation is detected from an actual TypeScript import.
