# Playbook 02 — Code-Based Layer Violation

## Purpose

This playbook demonstrates that V1.1 detects architecture drift from actual TypeScript source-code imports.

It intentionally introduces a dependency from the domain layer to the infrastructure layer.

## What this playbook demonstrates

- Violations are derived from code, not from manually edited `governance.workspace.yaml`.
- The TypeScript adapter sees the invalid import.
- The governance engine maps that import to a project dependency.
- The `layer-boundary` rule detects the invalid layer dependency.

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
import type { InMemoryBookingRepository } from '@demo/booking-infrastructure';
```

This creates the following dependency:

```txt
booking-domain -> booking-infrastructure
```

Given the wrapper classification, this means:

```txt
domain -> infrastructure
```

That is intentionally invalid.

## Run the check

```bash
yarn governance:check
```

## Expected result

The check should fail with an error-level `layer-boundary` violation.

Expected message shape:

```txt
Layer violation: booking-domain (domain) depends on booking-infrastructure (infrastructure).
```

## Why this is a violation

The domain layer should not depend on infrastructure.

Infrastructure may depend on domain abstractions, but domain should not know about repositories, persistence, adapters, frameworks, or infrastructure implementations.

Allowed direction:

```txt
infrastructure -> domain
```

Forbidden direction:

```txt
domain -> infrastructure
```

## Revert the manual change

Remove this import from `packages/booking-domain/src/index.ts`:

```ts
import type { InMemoryBookingRepository } from '@demo/booking-infrastructure';
```

Run the check again:

```bash
yarn governance:check
```

The check should pass again.

## Patch-based execution

If the repository contains a patch file for this scenario, use:

```bash
git apply playbooks/patches/introduce-code-layer-violation.patch
yarn governance:check
git apply -R playbooks/patches/introduce-code-layer-violation.patch
```

## Architectural lesson

The governance model makes this architectural principle executable:

```txt
The domain model must remain independent from infrastructure implementation details.
```

In V1 this violation was modeled manually in the canonical workspace document.

In V1.1 this violation is detected from an actual TypeScript import.
