# Security policy

## Supported versions

GuideRail is pre-1.0 and maintained by one person. Security fixes are made on `main` only.

| Version | Supported |
|---|---|
| Latest commit on `main` | Yes |
| Anything older | No |

Supported Node.js lines are listed in the [README](README.md#requirements).

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Report it privately through GitHub: go to the repository's **Security** tab and choose **Report a vulnerability**, or use this link:

https://github.com/backspring-labs/guiderail/security/advisories/new

Please include:

- what you found and where (file, function, or URL);
- how to reproduce it;
- what an attacker could do with it;
- the commit or version you tested.

## What to expect

- The maintainer aims to acknowledge a report within 7 days.
- You will be told whether the report is accepted, and kept informed until it is fixed or closed.
- Fixes are released on `main`. Credit is given in the advisory unless you ask otherwise.

This is a best-effort commitment from a single maintainer, not a service-level agreement.

## Scope

In scope: the code in this repository, its build and CI configuration, and its published packages.

Worth knowing when assessing impact:

- The web app has no backend and no authentication. It renders demo data bundled at build time.
- `@guiderail/core` can parse content files, but nothing in the app feeds it untrusted input today.

Out of scope: vulnerabilities in third-party dependencies with no reachable path in GuideRail. Report those upstream; if GuideRail makes one exploitable, that is in scope.

## How the repository is protected

The controls in place, who owns alerts, and any accepted exceptions are recorded in [docs/security/controls.md](docs/security/controls.md).
