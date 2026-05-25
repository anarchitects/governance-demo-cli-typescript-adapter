# Playbook 04 — Compare V1 and V1.1

## Purpose

This playbook explains the architectural difference between the V1 standalone governance demo and the V1.1 TypeScript adapter demo.

It is intended for readers, reviewers, workshop participants, and future maintainers.

## V1 summary

V1 demonstrates standalone governance with a canonical workspace document.

The active command is:

```bash
agov check --workspace governance.workspace.yaml --profile governance.profile.json
```

In V1:

```txt
projects are declared manually
dependencies are declared manually
policies are evaluated from the canonical workspace model
TypeScript code is illustrative but not the dependency source of truth
```

This is useful because canonical workspace mode can represent any technology or architecture source, including:

```txt
non-TypeScript systems
polyglot systems
legacy systems
manual architecture models
tool-generated workspace models
```

## V1.1 summary

V1.1 demonstrates standalone governance with the TypeScript adapter.

The active command is:

```bash
agov check --adapter @demo/governance-adapter-typescript-conventions --root . --profile governance.profile.json
```

In V1.1:

```txt
projects are discovered from the Yarn workspace
dependencies are discovered from TypeScript imports
domain/layer metadata is supplied by a local adapter wrapper
policies are evaluated from the discovered TypeScript workspace model
```

This is useful because TypeScript adapter mode can detect architectural drift from real source code.

## Key difference

V1 answers:

```txt
Can agov evaluate a canonical governance workspace outside Nx?
```

V1.1 answers:

```txt
Can agov evaluate a real TypeScript workspace outside Nx?
```

## Why V1.1 currently has a local adapter wrapper

The default TypeScript adapter can discover projects and dependencies, but it does not yet read package-level governance metadata from each package's `package.json`.

The local wrapper supplies demo-specific classification rules, such as:

```txt
packages/booking-domain -> domain:booking, layer:domain
packages/booking-application -> domain:booking, layer:application
packages/customer-domain -> domain:customer, layer:domain
packages/shared-kernel -> domain:shared, layer:domain
apps/booking-api -> domain:booking, layer:interface
```

This wrapper is intentionally temporary.

Once the TypeScript adapter supports package-level governance metadata, the wrapper can be removed.

## Future target after package metadata support

The target package metadata shape is:

```json
{
  "governance": {
    "domain": "booking",
    "layer": "domain",
    "scope": "booking",
    "owner": "booking-team"
  }
}
```

Then the demo can run directly with:

```bash
agov check --adapter @anarchitects/governance-adapter-typescript --root . --profile governance.profile.json
```

without a local wrapper.

## Recommended narrative for demos

Use V1 first when you want to explain the canonical governance model:

```txt
workspace
projects
dependencies
profile
rules
violations
```

Use V1.1 next when you want to show source-code-driven governance:

```txt
Yarn workspaces
TypeScript imports
adapter discovery
governance policies
code-based violations
```

## What V1 proves

```txt
Governance Core and Governance CLI are independent from Nx.
A canonical architecture model can be evaluated outside Nx.
Architecture decisions can be made executable even without source-code scanning.
```

## What V1.1 proves

```txt
The TypeScript adapter can analyze a plain TypeScript workspace.
Architecture violations can be detected from real imports.
Nx is not required for TypeScript architecture governance.
A local adapter wrapper can supply project classification until package metadata support exists.
```

## What V1.1 does not yet prove

V1.1 does not yet prove that the default TypeScript adapter can read package-level governance metadata from package.json.

That capability is tracked separately in the community repository epic:

```txt
Epic #134 — Extend TypeScript governance adapter with configurable package metadata mapping
```

## Final comparison

| Capability | V1 | V1.1 |
|---|---:|---:|
| Runs outside Nx | yes | yes |
| Uses `agov` CLI | yes | yes |
| Uses canonical workspace file | yes | reference only |
| Discovers TypeScript projects | no | yes |
| Discovers TypeScript imports | no | yes |
| Detects code-based violations | no | yes |
| Requires local wrapper | no | yes, temporarily |
| Ready for polyglot/manual models | yes | no |
| Ready for TypeScript source-driven governance | no | yes |
