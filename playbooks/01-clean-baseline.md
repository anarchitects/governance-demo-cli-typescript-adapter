# Playbook 01 — Clean Baseline with the TypeScript Adapter

## Purpose

This playbook validates the clean baseline of the V1.1 TypeScript adapter governance demo.

Unlike V1, this demo does not use `governance.workspace.yaml` as the active source of projects and dependencies.

Instead:

- projects are discovered from the TypeScript/Yarn workspace;
- dependencies are discovered from TypeScript imports;
- domain and layer metadata are supplied through a local adapter wrapper;
- policies are evaluated by `agov` using adapter mode.

## What this playbook demonstrates

- `agov` can run in adapter mode.
- `@anarchitects/governance-adapter-typescript` can analyze a plain TypeScript workspace without Nx.
- The local adapter wrapper supplies demo-specific domain/layer classification.
- The dependency graph is derived from source-code imports.
- The clean baseline has no error-level governance violations.

## Prerequisites

Run this playbook from the repository root.

Expected files and folders:

```txt
package.json
tsconfig.json
tsconfig.base.json
governance.profile.json
apps/booking-api
packages/booking-domain
packages/booking-application
packages/booking-interface
packages/booking-infrastructure
packages/customer-domain
packages/shared-kernel
packages/governance-adapter-typescript-conventions
```

The V1 canonical workspace file should no longer be active in the repository root.

It may be preserved as reference material here:

```txt
docs/reference/governance.workspace.v1.yaml
```

## Expected root scripts

The repository should contain scripts similar to:

```json
{
  "scripts": {
    "build": "tsc -b",
    "clean": "tsc -b --clean && find apps packages -type d -name dist -prune -exec rm -rf {} +",
    "rebuild": "yarn clean && yarn build",
    "governance:check": "yarn build && agov check --adapter @demo/governance-adapter-typescript-conventions --root . --profile governance.profile.json",
    "governance:debug": "yarn build && agov check --adapter @demo/governance-adapter-typescript-conventions --root . --profile governance.profile.json --format json --output governance-adapter-debug.json",
    "governance:report": "yarn build && agov check --adapter @demo/governance-adapter-typescript-conventions --root . --profile governance.profile.json --format markdown --output governance-report.md"
  }
}
```

## Steps

Install dependencies:

```bash
yarn install
```

Rebuild the TypeScript workspace:

```bash
yarn rebuild
```

Run the governance check:

```bash
yarn governance:check
```

Optionally generate a debug report:

```bash
yarn governance:debug
```

Optionally generate a Markdown report:

```bash
yarn governance:report
```

## Expected result

The governance check should complete without error-level violations.

The TypeScript adapter should discover dependencies from actual imports, including:

```txt
booking-api -> booking-interface
booking-interface -> booking-application
booking-application -> booking-domain
booking-infrastructure -> booking-domain
booking-domain -> shared-kernel
customer-domain -> shared-kernel
```

## Baseline architecture

The expected dependency direction is:

```txt
interface/application/infrastructure may depend inward
domain must remain independent from infrastructure and interface details
domains may only depend on explicitly allowed domains
```

The relevant baseline dependencies are produced by imports such as:

```ts
import { BookingController } from '@demo/booking-interface';
import { CreateBookingUseCase } from '@demo/booking-application';
import { createBooking, type Booking } from '@demo/booking-domain';
import type { EntityId } from '@demo/shared-kernel';
```

## Troubleshooting

### Adapter package cannot be loaded

If you see an error like:

```txt
Could not load Governance adapter package "@demo/governance-adapter-typescript-conventions".
```

Run:

```bash
yarn install
yarn build
```

Then verify that the wrapper package has been built:

```bash
ls packages/governance-adapter-typescript-conventions/dist/index.js
```

### Missing domain or layer violations

If the check fails with `missing-domain` or `missing-layer`, inspect:

```bash
cat governance-adapter-debug.json
```

The likely cause is that the local adapter wrapper does not derive `domain:*` and `layer:*` tags correctly.

### `shared-kernel` is treated as `layer:kernel`

The wrapper should contain a specific rule for `packages/shared-kernel` before any generic `packages/*-*` rule.

The intended classification is:

```txt
shared-kernel -> domain:shared, layer:domain
```

## Interpretation

If this playbook succeeds, V1.1 has proven that the governance CLI can evaluate a real TypeScript import graph without Nx and without a canonical workspace file as the active dependency source.
