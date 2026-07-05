# Daniel Mai — Record of Achievements (GrydPark)

*Factual source document for portfolio generation. All work attributed to author identity `dmai@gryd.com` (git names: DanielMai, dmai-gryd, Daniel Mai). Claims below have been verified against real code and git history; role labels are deliberately honest and downgraded where attribution did not fully support them.*

## Brief for the portfolio-generating agent

- **Purpose:** This is the vetted source of truth for Daniel Mai's engineering achievements at GrydPark. Use it as ground material to generate his public portfolio — do not invent achievements beyond what is recorded here.
- **How to consume it:** Every achievement is structured as **Role / What was built / Tech & stack / How it improved the system / Evidence**. Mine those fields for portfolio bullets; the Evidence field carries file paths and ticket ids that back each claim.
- **Target positioning:** Full-stack **platform engineer**, weighted toward **Backend + DevOps + Mobile**. Web operator portal and Express Checkout are genuine but *supporting* areas — frame them as breadth, not the headline.
- **Preserve honest role framing:** The role labels are load-bearing. Keep the distinction between **Sole architect / Founder / Creator / Owner** (Daniel wrote essentially the whole thing), **Led** (Daniel drove and is majority author but had collaborators), and **Contributed / Key contributor** (meaningful but shared or partial). Do not silently upgrade any of these.
- **Tone:** Confident, concrete, specific. Cite real mechanisms and files. Do **not** over-claim — where the material qualifies a claim, carry the qualification through.
- **Jira ids:** `GPK-####` are internal Jira ticket identifiers. They are useful provenance here but can be dropped from a public-facing portfolio.
- **Commit counts & ranks are approximate:** They come from local clones and `git log --author=dmai@gryd.com`, and can vary with branch reachability and name-identity merging. Treat all commit numbers as "approximately."

## Professional summary

Daniel Mai is a full-stack platform engineer who owns GrydPark's most sensitive backend surfaces — the money-movement and accounting cores (Stripe payments/webhooks feeding a reconciled QuickBooks Online double-entry ledger) and the SecurePark physical-access layer — and who led the 2026 Booking Flow V2 re-architecture that replaced race-prone booking with a two-phase spot-hold model backed by `pg_cron` cleanup. He is the #1 contributor to the NestJS/PostgreSQL API and the primary author and de-facto owner of the company's Google Cloud infrastructure-as-code, where he built the Terraform modules, the GKE Autopilot cluster, the Cloud SQL hardening, and a static-site migration program that moved apps off Kubernetes onto GCS + Cloud CDN. On mobile, he is the #1 contributor to the consumer React Native / Expo app, having architected its typed HTTP client, booking hold→confirm flow, notification system, and authentication. His work consistently spans product features, reliability and correctness, third-party integrations, and cost engineering — from timezone-safe money handling and mutation-tested critical paths to cutting Cloud Monitoring/Logging spend. Across web (operator portal, Express Checkout) he is a top-tier contributor, giving him end-to-end reach from database and cloud infrastructure up through mobile and web clients.

## Tech & skills matrix

**Backend**
- NestJS 10
- TypeORM 0.3
- TypeScript 5, Node 18
- @casl/ability (RBAC)
- Luxon (timezone-correct date/money handling)
- node-quickbooks, intuit-oauth-ts (QuickBooks Online)
- Stripe (stripe v17)
- @voucherify/sdk
- Twilio (SMS / notifications)
- pg_cron

**DevOps / Cloud / Platform**
- Terraform (HCL), Terraform workspaces, GCS remote-state backend
- Google Cloud Platform; hashicorp/google, google-beta, and random providers
- GKE, GKE Autopilot, Dataplane V2 (Cilium/eBPF), Kubernetes Gateway API
- Cloud DNS, Workload Identity, Google Managed Prometheus, Vertical Pod Autoscaler, Horizontal Pod Autoscaler
- Filestore CSI driver, GCS FUSE CSI driver, Binary Authorization
- VPC Network Peering, Secret Manager
- Cloud Storage (GCS), Cloud CDN, External HTTPS Load Balancer, Google-managed SSL certificates / Google ManagedCertificate, GCE Ingress
- Cloud Scheduler, Identity Platform (Firebase Auth), Artifact Registry
- Cloud Logging, Cloud Monitoring
- Kustomize
- gcloud CLI

**Mobile**
- React Native 0.79.6, React 19, Expo SDK 53, TypeScript 5.8, Expo prebuild
- React Navigation 7
- TanStack Query 5, Zustand 5, Redux Toolkit (legacy, being deprecated), react-redux
- Axios
- @stripe/stripe-react-native, Apple Pay (via Stripe), Google Pay (via Stripe)
- @react-native-google-signin/google-signin, expo-apple-authentication, react-native-confirmation-code-field
- expo-notifications, expo-secure-store, @react-native-async-storage/async-storage
- react-native-maps, expo-location, expo-google-places
- react-hook-form, @gorhom/bottom-sheet
- luxon, moment
- babel-plugin-module-resolver

**Web frontend**
- Vite / Vite 5, React 18, TypeScript
- react-router v6 / react-router-dom v6
- Zustand / Zustand 4
- Radix UI, shadcn / shadcn-style components, Tailwind CSS / Tailwind CSS 3.4
- Zod, @hookform/resolvers, react-hook-form
- @tanstack/react-table, TanStack Query
- Recharts
- @vis.gl/react-google-maps
- react-qr-code, react-intersection-observer
- framer-motion, react-select
- libphonenumber-js, react-phone-number-input, react-international-phone
- qs, date-fns
- mina-scheduler (vendored, in-repo)

**Databases / Data**
- PostgreSQL 15 (application DB)
- Cloud SQL (PostgreSQL 18), pgAudit, point-in-time recovery
- pg_cron (scheduled cleanup)
- TypeORM 0.3 (entities, repositories, migrations)

**Third-party integrations**
- Stripe (stripe v17, @stripe/stripe-js, @stripe/react-stripe-js, @stripe/stripe-react-native, @stripe/terminal-js), Apple Pay, Google Pay
- QuickBooks Online (node-quickbooks, intuit-oauth-ts)
- ButterflyMX API (OAuth, gate/door access)
- Twilio
- @voucherify/sdk (vouchers / coupons / credits)
- Firebase / Firebase Auth phone OTP, reCAPTCHA, Identity Platform
- Apple / Google sign-in
- Google Maps / Places (@vis.gl/react-google-maps, expo-google-places)

**Testing / Quality**
- Stryker mutation testing (@stryker-mutator/jest-runner, typescript-checker)
- Jest (unit + e2e)
- ESLint, Prettier, Husky

**CI-CD / Build**
- GitHub Actions
- Google Cloud Build
- Terraform (fmt / init / validate / plan / apply gating)
- EAS Build (with autoIncrement + auto-submit)
- Docker, nginx
- Kustomize
- Vite build
- google-github-actions/setup-gcloud
- gcloud CLI (`gcloud storage rsync`, `gcloud compute url-maps invalidate-cdn-cache`)

# Achievements by feature / product area

## A. Backend / Platform

Backend and platform work on `grydpark-api` (NestJS 10, TypeORM 0.3, PostgreSQL 15, TypeScript 5, Node 18), where Daniel is the #1 contributor with ~1,130+ commits spanning Jul 2024 -> Jul 2026. He owns the money-movement and accounting surfaces, led the Booking Flow V2 spot-hold rearchitecture, and built the SecurePark physical-access and mobile BFF layers.

### QuickBooks Online (QBO) accounting & reconciliation engine
- **Role:** Led
- **Product area / repos:** Accounting / financial automation — `grydpark-api`
- **What was built:** A QBO integration that turns every parking payment and refund into a validated double-entry journal. Includes contact sync, bill and journal services, and a reconcile flow that re-reads posted QBO journals against the matching Stripe payment intent to detect and correct fee/amount drift (dry-run). Handles GST/tax, Voucherify coupons/credits, Stripe processing fees, and revenue shares, with a debit/credit balance-validation gate before posting.
- **Tech & stack:** node-quickbooks, intuit-oauth-ts, NestJS, TypeORM (qboBill / qboContact / reservationQboBill entities + repositories), @voucherify/sdk, Stripe, PostgreSQL
- **How it improved the system:** Replaced manual bookkeeping with reliable, reconciled, auditable financials; the reconcile pass catches processing-fee and amount drift before it corrupts the ledger.
- **Evidence:** `src/accounting/` (services `qboJournal.service.ts`, `qboBill.service.ts`, `qboContact.service.ts`, `quickBooks.service.ts`; `controllers/quickBooks.controller.ts`; `README.md` with mermaid flow; integration/unit specs); GPK-1318, GPK-1322, GPK-1348 (v2 migration + integration tests), GPK-1364 (PE tax), GPK-1380 (query efficiency); Nov 2024 -> 2026

### Stripe payments & webhook service
- **Role:** Creator (webhook service) / Key contributor (payments)
- **Product area / repos:** Payments / money movement — `grydpark-api`
- **What was built:** Created and owns the Stripe webhook service (the single busiest file in the payment module by his authorship) handling payment intents, refunds, processing/service fees, and payouts. Covers Voucherify voucher sessions, service-fee computation, and payout/payoutCharge tracking, feeding confirmed transactions into the QBO accounting pipeline.
- **Tech & stack:** Stripe (stripe v17), NestJS, TypeORM (payout / payoutCharge entities), @voucherify/sdk, PostgreSQL
- **How it improved the system:** Correct, resilient money movement; webhook events reliably drive downstream accounting and booking state.
- **Evidence:** `src/payment/services/stripeWebhook.service.ts`, `src/payment/controllers/stripeWebhook.controller.ts`, `src/payment/services/stripe-api-client.ts`, `src/payment/services/serviceFee.service.ts`, `src/payment/entities/payout.entity.ts`, `payoutCharge.entity.ts`; Oct 2024 -> 2026

### Booking Flow V2 — spot-hold architecture
- **Role:** Led
- **Product area / repos:** Booking / lot management — `grydpark-api`
- **What was built:** Reworked booking into a two-phase hold -> confirm flow to eliminate double-booking races. Added a reservationHold entity, service, and repository plus a non-nullable bookingTime field with a backfill migration; wired the Stripe webhook into the hold lifecycle; and shipped a pg_cron migration that auto-deletes stale holds on a schedule.
- **Tech & stack:** NestJS, TypeORM migrations, PostgreSQL, pg_cron, Stripe, Jest (unit + integration specs)
- **How it improved the system:** Eliminates spot contention and overselling, cleans up the payment sequencing, and makes hold cleanup self-managing.
- **Evidence:** `src/lotManagement/entities/reservationHold.entity.ts`, `services/reservationHold.service.ts`, `repositories/reservationHold.repository.ts`; `src/migrations/…CreateReservationHoldTable.ts`, `…AddZoneIdToReservationHold.ts`, `…AddPgCronCleanupExpiredHolds.ts`; GPK-1329, GPK-1346, GPK-1348; 2025 -> 2026

### SecurePark / ButterflyMX access control
- **Role:** Sole architect
- **Product area / repos:** Physical access control — `grydpark-api`
- **What was built:** Created the entire SecurePark module: OAuth integration with ButterflyMX and reservation-driven gate/door provisioning. Access points, per-reservation access-point links, and per-user access keys are modeled as entities with repositories, a controller, DTOs, and service layer; the butterflyMx service is authored end-to-end by Daniel.
- **Tech & stack:** NestJS, TypeORM (secureParkAccessPoint / secureParkAccessPointReservation / secureParkUserAccessKey entities), ButterflyMX API (OAuth), PostgreSQL
- **How it improved the system:** Provisions physical building access automatically from bookings — a differentiated product capability with no manual gate/key handling.
- **Evidence:** `src/securePark/` (module created by Daniel; `services/butterflyMx.service.ts` 100% his, `services/securePark.service.ts`, entities, repositories, controller, DTOs); GPK-1342 (mobile v2 endpoints), GPK-1391, GPK-1276 (perf); Jan 2026 -> 2026

### Scheduling & rates V2
- **Role:** Led
- **Product area / repos:** Pricing / scheduling — `grydpark-api`
- **What was built:** Migrated dashboard queries and cancel-booking logic onto the V2 schedule tables (daily/monthly rate types, time chunks, recurrence, block events), including daily-vs-hourly categorization (categorizeDailyOrHourlyV2), evening-window splitting, and virtual-column select fixes.
- **Tech & stack:** NestJS, TypeORM, PostgreSQL, Luxon
- **How it improved the system:** Flexible pricing with correct rate resolution, and decouples the app from the legacy schedule schema.
- **Evidence:** `src/scheduling/` (Daniel is the #1 contributor); GPK-1314, GPK-1315 (dashboard + cancel-booking migration to V2 schedule tables); 2025 -> 2026

### Mobile App BFF layer
- **Role:** Creator
- **Product area / repos:** Mobile backend-for-frontend — `grydpark-api`
- **What was built:** Created the mobile-specific API surface: mobileBooking service plus mobileApp property/spot controllers. Delivered getParkerSummaries v2, the v2 replacement for GetParkerReservations, cancellation/replacement flows, and app-version gating, with Apple/Android sign-in fixes.
- **Tech & stack:** NestJS, TypeORM, PostgreSQL, Apple / Google sign-in
- **How it improved the system:** A purpose-built, faster mobile API tuned to the app's screens instead of reusing dashboard endpoints.
- **Evidence:** `src/mobileApp/services/mobileBooking.service.ts` (created by Daniel), `src/mobileApp/` property/spot controllers, `mobileBooking.dtos.ts`; Feb 2025 -> 2026

### Terminal / kiosk booking channel
- **Role:** Led
- **Product area / repos:** Pay-station / kiosk booking — `grydpark-api`
- **What was built:** Built the terminal (pay-station) booking service and its v2, including terminal-specific journal and Voucherify guards so kiosk transactions flow correctly into accounting.
- **Tech & stack:** NestJS, TypeORM, Stripe, @voucherify/sdk, node-quickbooks
- **How it improved the system:** Adds a physical pay-station sales channel with the same accounting correctness guarantees as the app.
- **Evidence:** GPK-1290 (Sherbrook terminal booking service), GPK-1374 (terminal booking service v2); 2025 -> 2026

### Cross-cutting quality, security & correctness
- **Role:** Contributed / Key contributor
- **Product area / repos:** Platform reliability — `grydpark-api`
- **What was built:** CASL-based RBAC roles/permissions and guards (including guarding cron endpoints and enforcement-officer permissions); Luxon timezone corrections across bookings, receipts, and monthly queries; Twilio SMS receipts and push notifications; and a test/CI setup with Stryker mutation testing plus Jest unit/e2e running on GitHub Actions. Also touched GKE deploy image-name/flow and GCS bucket config.
- **Tech & stack:** @casl/ability, Luxon, Twilio, Stryker (@stryker-mutator/jest-runner, typescript-checker), Jest, GitHub Actions, GKE
- **How it improved the system:** Security (RBAC on sensitive/cron endpoints), correctness (timezone-safe money and receipts), and dev velocity/quality (mutation-tested critical paths in CI).
- **Evidence:** `stryker.config.json`, CASL guards/roles across `src`; GPK-634 (cron endpoint permissions), GPK-1232, GPK-1239 (GKE deploy); 2024 -> 2026

## B. DevOps / Cloud / Platform

Daniel is the primary author and de-facto owner of GrydPark's Google Cloud Infrastructure-as-Code, and a contributor to the managed Kubernetes cluster. Work spans reproducible Terraform provisioning, a GKE Autopilot cluster module, a static-site migration program that moved apps off the cluster onto GCS + Cloud CDN, Cloud SQL hardening, and gated CI/CD.

### GCP Infrastructure-as-Code platform (Terraform)
- **Role:** Owner
- **Product area / repos:** Cloud infrastructure / IaC — `grydpark-infra`
- **What was built:** The bulk of a modular Terraform codebase provisioning the org's GCP footprint: reusable modules for `gke`, `cloud-sql`, `static-site`, `vpc-peering`, `artifact-registry`, `storage`, `cloud-scheduler`, `service-account`, and `identity-platform` (co-authored). Multi-environment (dev/stage/prod) via Terraform workspaces with per-env `*.tfvars` and GCS remote-state backends (`backend-*.hcl`). Also consolidated the deployment to a single region, `northamerica-northeast1` (Montreal), with matching CDN location for data residency and latency, and wired Cloud Scheduler API cron jobs driven by a Secret Manager security token.
- **Tech & stack:** Terraform (HCL), Google Cloud Platform, hashicorp/google + google-beta providers, GCS remote state, Cloud Scheduler, Secret Manager, Identity Platform (Firebase Auth), Artifact Registry, Cloud Storage
- **How it improved the system:** Replaced manual/ad-hoc provisioning with reproducible, reviewable, multi-env IaC; single-region consolidation reduced cross-region cost and latency; workspace + remote-state design gave safe, isolated dev/stage/prod state.
- **Evidence:** `terraform/main.tf`, `terraform/modules/`, `terraform/backend-*.hcl`, `terraform/{dev,stage,prod}.tfvars`; GPK-1224, GPK-1228; Nov 2025 – Jun 2026

### GKE Autopilot cluster module
- **Role:** Led
- **Product area / repos:** Kubernetes platform / IaC — `grydpark-infra`
- **What was built:** The GKE Autopilot cluster Terraform module, enabling Dataplane V2 (`ADVANCED_DATAPATH`, Cilium/eBPF), Kubernetes Gateway API, Cloud DNS for in-cluster resolution, Workload Identity, Google Managed Prometheus with advanced datapath observability, Vertical Pod Autoscaling, a performance HPA profile, Filestore and GCS-FUSE CSI drivers, and a variable-driven Binary Authorization toggle.
- **Tech & stack:** GKE Autopilot, Dataplane V2 (Cilium/eBPF), Kubernetes Gateway API, Cloud DNS, Workload Identity, Google Managed Prometheus, Vertical Pod Autoscaler, Horizontal Pod Autoscaler, Filestore CSI, GCS FUSE CSI, Binary Authorization, Terraform
- **How it improved the system:** Codified a modern, keyless (Workload Identity), observable cluster with autoscaling and managed storage drivers, replacing hand-configured clusters with a single reproducible module.
- **Evidence:** `terraform/modules/gke/main.tf`, `terraform/modules/gke/variables.tf`; ~Mar–Jun 2026

### Static-site migration program (GKE → GCS + Cloud CDN + global HTTPS LB)
- **Role:** Led
- **Product area / repos:** Web hosting / edge delivery — `grydpark-infra`, `gryd-cluster`
- **What was built:** A reusable `static-site` module that fronts a GCS bucket with a global external HTTPS load balancer (`EXTERNAL_MANAGED`), Cloud CDN (origin-header caching, negative caching, serve-while-stale), a Google-managed SSL certificate, and an HTTP→HTTPS 301 redirect. Applied across three apps — express/guest checkout, enforcement, and portal — each getting its own global static IP, backend bucket, URL map, and cert. Paired with decommissioning the enforcement and portal services from the managed Kubernetes cluster.
- **Tech & stack:** Cloud Storage (GCS), Cloud CDN, Google External HTTPS Load Balancer, Google-managed SSL certificates, Terraform
- **How it improved the system:** Removed always-on cluster workloads for static apps (lower cluster load and hosting cost) and added edge caching and managed TLS for faster, cheaper delivery.
- **Evidence:** `terraform/modules/static-site/load-balancer.tf`, `terraform/modules/static-site/storage.tf`, `terraform/main.tf` (express-checkout/enforcement/portal modules), `docs/enforcement-static-site-migration.md`; GPK-1139, GPK-1226, GPK-1227; Mar–May 2026

### Cloud SQL provisioning + networking hardening
- **Role:** Led
- **Product area / repos:** Managed database / networking — `grydpark-infra`
- **What was built:** The `cloud-sql` module for a PostgreSQL 18 instance with private connectivity via a dedicated `vpc-peering` module (reserved internal IP range), automated backups with 7-day transaction-log retention and point-in-time recovery, Query Insights, optional maintenance windows, pgAudit database flags, a password validation policy, randomly generated passwords for additional DB users (random provider), a Secret Manager-sourced postgres password, and configurable authorized networks.
- **Tech & stack:** Cloud SQL (PostgreSQL 18), VPC Network Peering, Secret Manager, pgAudit, hashicorp/random provider, Terraform
- **How it improved the system:** Delivered a private, backed-up, auditable database with reproducible user/secret management and PITR — improving security, recoverability, and observability over manually provisioned instances.
- **Evidence:** `terraform/modules/cloud-sql/main.tf`, `terraform/modules/vpc-peering/main.tf`, `docs/cloud-sql-guide.md`, `docs/networking-guide.md`; Mar–Apr 2026

### CI/CD pipelines for infrastructure deploys
- **Role:** Led
- **Product area / repos:** CI/CD / release automation — `grydpark-infra`
- **What was built:** A Cloud Build pipeline (`cloudbuild.yaml`) that runs `terraform fmt`/`init`/`validate`/`plan` with `-detailed-exitcode` and only applies when the plan reports changes (exit code 2), gating apply on plan success; plus a GitHub Actions deploy workflow. Deploys are workspace-scoped via `TF_WORKSPACE` and backend config selection.
- **Tech & stack:** Google Cloud Build, GitHub Actions, Terraform
- **How it improved the system:** Made infrastructure changes reproducible and gated — no-op plans skip apply, failed plans block apply — reducing accidental drift and manual deploy toil.
- **Evidence:** `cloudbuild.yaml`, `.github/workflows/deploy.yml`; Mar–Apr 2026

### GKE observability & logging cost reduction
- **Role:** Contributed
- **Product area / repos:** Cost optimization / observability — `grydpark-infra`
- **What was built:** Reduced GKE monitoring/logging spend at the cluster level: after Managed Prometheus was enabled, removed the redundant cAdvisor/kubelet metric components (GPK-1337) and trimmed system-component logging in the GKE `logging_config`/`monitoring_config` and per-env tfvars. (Note: the complementary Cloud Logging `_Default` sink exclusion in `logging.tf` was authored by a teammate, Alain Carvalho, not Daniel.)
- **Tech & stack:** GKE monitoring/logging config, Google Managed Prometheus, Cloud Logging/Monitoring, Terraform
- **How it improved the system:** Cut duplicate metrics ingestion and system-log volume once Managed Prometheus covered the same signals, directly reducing Cloud Monitoring/Logging cost.
- **Evidence:** `terraform/modules/gke/main.tf` (monitoring/logging config), `terraform/{prod,stage}.tfvars`; GPK-1337; May–Jun 2026

### Kubernetes / Kustomize cluster contribution & service decommissioning
- **Role:** Contributed
- **Product area / repos:** Kubernetes cluster config — `gryd-cluster`
- **What was built:** Added the initial enforcement-app cluster configuration (Dec 2024) to the shared Kustomize repo (base + dev/staging/production overlays using Google `ManagedCertificate` and global static IPs), then later removed the enforcement (GPK-1226) and portal (GPK-1227) services from the managed cluster as they migrated to static sites. (The base Ingress and http-to-https manifests were originally authored by other engineers; Daniel edited the Ingress/managed-cert to add and later remove these services.)
- **Tech & stack:** Kubernetes, Kustomize, Google ManagedCertificate, GCE Ingress, GitHub Actions
- **How it improved the system:** Kept the shared cluster config accurate through the static-site migration, removing decommissioned workloads and their certificates/routes.
- **Evidence:** `base/ingress-grydpark.yaml`, `{development,staging,production}/managed-cert.yaml`, `{development,staging,production}/kustomization.yaml`; GPK-1226, GPK-1227; Dec 2024 – May 2026

## C. Mobile

The Prod-MobileApp is GrydPark's consumer parking app (iOS + Android), built on React Native 0.79.6 / React 19 / Expo SDK 53 with TypeScript. Daniel is the #1 contributor (~161 commits authored, Oct 2024 - Jul 2026) and drove the booking, payments, authentication, notifications, secure-park, and networking layers.

### App-wide typed HTTP client with global auth handling
- **Role:** Sole architect
- **Product area / repos:** Networking / session layer — `Prod-MobileApp`
- **What was built:** A typed Axios wrapper (`get`/`post`/`put`/`patch`/`del`) with a custom `ApiError` class, a request interceptor that attaches the bearer token from an in-memory token cache (falling back to expo-secure-store, avoiding a Keychain read per request) and switches `Content-Type` for `FormData` uploads, and a response interceptor that normalizes all errors into `ApiError` and globally handles 401 (session expired) and 403 (suspended) by deduplicating concurrent auth failures, clearing the session, and resetting navigation to the AuthScreen.
- **Tech & stack:** Axios, TypeScript, expo-secure-store, AsyncStorage, Zustand (auth store), React Navigation (navigationRef reset)
- **How it improved the system:** Eliminated ad-hoc fetch/error handling across the app, centralized session-expiry/logout so a single expired token can't trigger multiple resets, and cut per-request Keychain reads via token caching.
- **Evidence:** `src/services/httpClient.ts` (194 of 195 lines authored by Daniel per git blame); GPK-1263; May 2026

### Booking Flow V2 (hold → confirm, with in-flight edit and extend)
- **Role:** Led
- **Product area / repos:** Booking / checkout — `Prod-MobileApp`
- **What was built:** A transactional hold→confirm booking model backed by a suite of TanStack Query hooks (`useHoldSpot`/`useExtendHold`, `useConfirmHold`, `useCancelHold`, `useUnholdSpot`, `useGetCheckoutOptions`, `useGetZoneAvailability`, `useGetBookingDetails`, `useGetReceipt`) calling the v2 reservation API (`v2/reservation/mobile/hold`, `.../hold/extend`). Holds carry an `expiresAt` and Stripe `clientSecret`; editing a booking recreates the payment hold, and extensions reuse the same hold primitives. Surfaced through the Checkout and MyBooking screens.
- **Tech & stack:** TanStack Query 5, Axios, @stripe/stripe-react-native, TypeScript, React Navigation
- **How it improved the system:** Introduced a robust hold→confirm flow that prevents mischarges and stale holds and supports edit/extend without leaking reservations.
- **Evidence:** `src/hooks/booking/` (13 of ~19 commits by Daniel), `src/screens/home/Checkout`, `src/screens/home/MyBooking`; GPK-1342; 2026

### Booking-lifecycle push & local notifications
- **Role:** Sole architect
- **Product area / repos:** Notifications — `Prod-MobileApp`
- **What was built:** A local-notification scheduler that fires "starts soon" (5 min before start), "ends soon" (15 min before end), and "ended" notifications, with copy and action buttons that vary by lot type (standard vs secure-park) and extend-eligibility; it reschedules the expiring/ended notifications on extension and fires immediately if the window has already passed. A companion response handler deep-links taps and notification actions (Open Gate, Extend, View Receipt, View Details) and deduplicates the iOS double-fire of a single response via a ref on the notification identifier.
- **Tech & stack:** expo-notifications, TypeScript, React Navigation deep-linking
- **How it improved the system:** Actionable re-engagement that reduces overstays and parking tickets by prompting users before their session ends and routing them straight to the relevant action.
- **Evidence:** `src/services/localNotificationScheduler.ts`, `src/hooks/notification/useNotificationResponseHandler.ts`, `src/config/notificationCategories.ts` (all 6-7 commits solely by Daniel); GPK-1352, GPK-1366; May-Jun 2026

### Authentication & onboarding (phone OTP + Apple/Google sign-in)
- **Role:** Led
- **Product area / repos:** Auth / onboarding — `Prod-MobileApp`
- **What was built:** Passwordless authentication hooks (`useRequestOtpForSignIn`, `useVerifyOtpForSignIn`, `useSignInWithThirdParty`, `useVerifyEmail`, plus account-recovery hooks `useSendRecoveryCodeToEmail`/`useVerifyRecoveryCode` and phone-change flows `useRequestOtpForNewPhone`/`useVerifyOtpForPhoneChange`) wired to the authentication, RecoverAccount, and intro onboarding screens, supporting phone OTP plus Apple and Google third-party sign-in with OTP autofill.
- **Tech & stack:** TanStack Query, @react-native-google-signin/google-signin, expo-apple-authentication, react-native-confirmation-code-field, react-hook-form, Zustand (auth store)
- **How it improved the system:** Reduced sign-in friction with a passwordless OTP path and native Apple/Google sign-in, and handled recovery and phone-change edge cases.
- **Evidence:** `src/hooks/auth/auth.ts` (7 of ~12 commits by Daniel), `src/screens/onboarding/authentication`, `src/screens/onboarding/RecoverAccount`, `src/screens/onboarding/intro`; GPK-926, GPK-966, GPK-968, GPK-971, GPK-972; 2025-2026

### Checkout / review-booking / payments UX
- **Role:** Led
- **Product area / repos:** Checkout / payments — `Prod-MobileApp`
- **What was built:** The dynamically-priced checkout UI and its components (HourlyBookingPriceOptions, PricingInformation, CommonPaymentMethodSelection, CommonVehicleSelectionModal, DurationCard, MonthlySubscriptionWarning), with in-flow vehicle and payment-method editing, monthly-subscription warnings, and correct proration on changes; the ReviewBookingScreen integrates Stripe payment (including Apple Pay / Google Pay via Stripe).
- **Tech & stack:** @stripe/stripe-react-native (Apple Pay / Google Pay), TanStack Query, @gorhom/bottom-sheet, TypeScript
- **How it improved the system:** Streamlined a dynamically-priced checkout with in-flow editing and correct proration, reducing drop-off and pricing errors.
- **Evidence:** `src/components/checkout/`, `src/screens/home/Checkout/review/ReviewBookingScreen.tsx`, reservationPayments/paymentMethod hooks; GPK-1021, GPK-1023, GPK-1025, GPK-1026, GPK-1027, GPK-1029, GPK-1044, GPK-1094, GPK-1132, proration GPK-993; 2025-2026

### Secure Park in-app gate access
- **Role:** Led
- **Product area / repos:** Secure Park / access control — `Prod-MobileApp`
- **What was built:** In-app remote gate/door opening for gated lots via hooks that call the v2 secure-park API — `useOpenDoorGivenReservationId` (POST `.../access-points/{id}/open-door`, invalidating the cached PIN), `useGetSecureParkAccessKey` (PIN retrieval), `useGetSecureParkAccessPoints` (access-point selection), and `useSecureLotAccessExpired` — surfaced through the securePark screens.
- **Tech & stack:** TanStack Query, Axios, TypeScript
- **How it improved the system:** Enabled users to open gates/doors and pick access points from the app, replacing manual entry for secure lots.
- **Evidence:** `src/hooks/securePark/` (6 of 8 commits by Daniel), `src/screens/home/securePark`; GPK-1131, GPK-1203, GPK-1211, GPK-1248; 2026

### State-management & performance refactors
- **Role:** Led
- **Product area / repos:** App architecture / performance — `Prod-MobileApp`
- **What was built:** Refactored the Redux store and removed the legacy `GetParkerReservations-v2` path (part of the migration toward Zustand + TanStack Query), and reduced re-renders on the ExploreScreen.
- **Tech & stack:** Zustand 5, TanStack Query 5, Redux Toolkit (legacy, being deprecated), babel-plugin-module-resolver (@/ path aliases)
- **How it improved the system:** Fewer re-renders on a hot screen and a simpler data layer as legacy Redux is retired in favor of Zustand/TanStack Query.
- **Evidence:** `src/stores/`, `src/components/explore`; GPK-1272 (redux store refactor + remove GetParkerReservations-v2, #148), GPK-1208 (reduce ExploreScreen re-renders, #124); 2025-2026

### Vehicle management, receipts & misc UX
- **Role:** Contributed
- **Product area / repos:** Account / vehicles / receipts — `Prod-MobileApp`
- **What was built:** Vehicle-screen refactor with delete, a reusable vehicle-selection modal, a ReceiptsScreen refactor, plus Android province-selection and booking-detail crash fixes.
- **Tech & stack:** React Native, TanStack Query, react-native-picker/select-dropdown, Zustand (province store)
- **How it improved the system:** Improved account/vehicle management UX and fixed Android-specific crashes.
- **Evidence:** vehicle screens, `src/components/checkout/CommonVehicleSelectionModal.tsx`, ReceiptsScreen, `src/stores/useProvinceStore.ts`; GPK-367 (vehicle refactor + delete), GPK-854 (vehicle-selection modal), GPK-857 (ReceiptsScreen refactor); 2025-2026

### Release engineering — EAS build config & CI
- **Role:** Key contributor
- **Product area / repos:** Build / release — `Prod-MobileApp`
- **What was built:** Extended the EAS Build configuration and GitHub Actions build workflow (originally created by another engineer under GPK-1111): split the EAS build into a parameterized platform-input workflow (#159), fixed `eas.json` (GPK-1282, #143), switched Android production to app bundle (#157), added buildNumber/versionCode handling, and drove version bumps. `eas.json` uses auto-increment and auto-submit (preview→TestFlight/Play internal, production→store).
- **Tech & stack:** EAS Build, GitHub Actions, Expo prebuild, App Store Connect / Google Play submit
- **How it improved the system:** More reliable, parameterized cloud builds and submissions across iOS and Android.
- **Evidence:** `eas.json`, `.github/workflows/eas-build.yml`, `.github/workflows/ci.yml`; GPK-1282; #157, #159; 2026

## D. Enforcement (web app)

Daniel was the #2 contributor (~31 commits, Dec 2024 – May 2026) to the enforcement app — a Vite + React 18 + TypeScript mobile-first web SPA that officers run in a browser. His work skewed toward production DevOps (path-to-prod and a static-site re-platform) plus one live-data feature; the scanning/ticketing UI itself was primarily built by Shaun Lazaro.

### Production DevOps: containerized deploy → GCS + Cloud CDN static-site re-platform and CI/CD
- **Role:** Led
- **Product area / repos:** Enforcement web app deployment & CI/CD — `grydpark-enforcement-app`
- **What was built:** Owned the app's path to production end to end. Authored the `Dockerfile` and `nginx.conf` for containerized serving, the initial GCP deployment, and the Kubernetes/Kustomize manifests (`kubernetes/base`, `kubernetes/staging`, `kubernetes/production`). Fixed GKE image-name resolution in the deployment flow (GPK-1232, #23 and #24). Then re-platformed the app off GKE to static-site delivery (GPK-1226, #27): rebuilt the GitHub Actions pipeline into a reusable `deploy.yml` (invoked by `production.yml`/`staging.yml`) that `gcloud storage rsync`s the Vite `dist/` output to a GCS bucket, sets `public, max-age=31536000, immutable` cache headers on hashed `assets/**` and `js/**`, `no-cache` on `index.html`, and invalidates the Cloud CDN cache via `gcloud compute url-maps invalidate-cdn-cache`. Also added the build-test workflow and later workflow cleanup (#28).
- **Tech & stack:** Docker, nginx, GKE / Kubernetes, Kustomize, Google Cloud Storage, Cloud CDN, gcloud CLI, GitHub Actions, Vite
- **How it improved the system:** Established a repeatable, automated path to production, then cut cost and sped delivery by moving from always-on GKE pods to cheaper, faster CDN-fronted static hosting, with correct cache semantics (immutable hashed assets, always-fresh index.html) that prevent stale-deploy bugs.
- **Evidence:** `Dockerfile`, `nginx.conf`, `kubernetes/`, `.github/workflows/deploy.yml`, `.github/workflows/production.yml`, `.github/workflows/build-test.yml`; GPK-1232, GPK-1226 (PRs #23, #24, #27, #28, #14); Dec 2024 – May 2026

### 15-second live enforcement/booking data polling
- **Role:** Led
- **Product area / repos:** Enforcement live occupancy data — `grydpark-enforcement-app`
- **What was built:** Added near-real-time polling of active parkers per lot. Built the `useGetZonesWithParkers` TanStack Query hook in `src/api/hooks/enforcement/enforcement.ts` with `refetchInterval: 15000` hitting the lot `list-parkers` endpoint, wired into the scanning flow (`src/pages/scanning/scanning.tsx`) so officers see live booking/occupancy state (GPK-1161, #22).
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, Axios
- **How it improved the system:** Officers see near-real-time lot occupancy instead of stale snapshots, reducing the chance of wrongful enforcement against vehicles that just booked.
- **Evidence:** `src/api/hooks/enforcement/enforcement.ts` (line 46-66), `src/pages/scanning/scanning.tsx`; GPK-1161 (PR #22); Dec 2025

## E. Web Operator Portal (supporting)

Operator/ops single-page portal (React 18 + Vite 5 + TypeScript) where GrydPark staff manage bookings, properties, zones, payments, gates, enforcement and users. Daniel is a co-leading contributor (~370–420 commits across name identities, roughly tied with one other engineer for the top spot), Jul 2024 – Jul 2026. This is a supporting area, so achievements are grouped and condensed.

### Operator booking lifecycle management
- **Role:** Led
- **Product area / repos:** Operator booking management — `grydpark-front`
- **What was built:** End-to-end booking control in one panel: the ~1,080-line `modifyBooking` view (Daniel is top author) plus right-panel and monthly/charge-refund dialogs; a price-override dialog; a cancellation flow that disables cancel outside the reserved state; and attendant/custom plus zero-dollar bookings (including Fairmont free bookings). Backed by the reservation hook layer (`useModifyBooking`, `useOverridePrice`, `useCreateCustomBooking`, `useRefundCustomBooking`, `useCancelReservation`, `useCreateAttendantFreeBooking`) and a filter/search/paginated booking table.
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, react-hook-form, Zod, @tanstack/react-table, Radix UI + shadcn, Luxon
- **How it improved the system:** Gives operators full booking-lifecycle control (create, modify, override, refund, cancel) from one UI, removing engineering involvement for day-to-day booking corrections.
- **Evidence:** `src/pages/booking/modifyBooking.tsx`, `src/api/hooks/reservation/reservation.ts`, `src/api/hooks/reservation/attendantBooking.ts`; GPK-879/883/704 (override), GPK-406/765 (cancellation), GPK-1177 (Fairmont free), GPK-70/696/145 (table); 2024–2026

### Secure Park access-point / gate control UI
- **Role:** Creator
- **Product area / repos:** Physical access control — `grydpark-front`
- **What was built:** Portal UI for BMX-hardware gate and PIN control: Add/Edit Access Point dialogs, `AccessPointForm`, an Access Points tab, and the full secure-park hook set (`useCreateAccessPoint`, `useUpdateAccessPoint`, `useDeleteAccessPoint`, `useOpenDoorByButton`, `useGeneratePincodeForReservation`, `useGetAccessPointsByLotId`, `useGetAccessPointsByBmxBuildingId`, `useGetBmxBuildings`).
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, react-hook-form, Zod, Radix UI + shadcn
- **How it improved the system:** Lets ops staff view, create and trigger physical access points (open gate, resend PIN) directly from the portal, connecting the web app to BMX gate hardware.
- **Evidence:** `src/api/hooks/secure-park/` (Daniel is sole author of this directory), `src/pages/property-management/dialog/AddAccessPointDialog.tsx`, `EditAccessPointDialog.tsx`, `dialog/form/AccessPointForm.tsx`, `right-panels/tabs/AccessPointsTab.tsx`; GPK-1163; 2026

### Property management + Google Maps lot creation
- **Role:** Led
- **Product area / repos:** Property/zone configuration — `grydpark-front`
- **What was built:** Property create/edit/delete flows with image upload, Google-Maps-based lot creation, and lot rating/feedback display. Daniel also contributed the zone activate/deactivate and edit-schedule work within a zone module co-owned with several engineers.
- **Tech & stack:** React 18, TypeScript, @vis.gl/react-google-maps, TanStack Query 5, react-hook-form, Zod
- **How it improved the system:** Makes property and lot configuration self-serve for ops, with map-driven lot placement replacing manual coordinate entry.
- **Evidence:** `src/pages/property-management/` (Daniel top author), `src/components/organisms/form/zone/` (shared); GPK-122/142/102/563 (property), GPK-154 (Google Maps lot), GPK-180 (lot rating), GPK-384/289 (zone activate/edit, contributed); 2024–2025

### User / access management & authentication
- **Role:** Led
- **Product area / repos:** Auth & RBAC — `grydpark-front`
- **What was built:** User-vs-Parker separation, profile and user actions, management-companies plus roles/permissions tabs, forgot-password UI + hooks, full sign-out on token expiry, parker email-verification page, and invitation/registration enhancements. Daniel is the top author across `src/pages/userManagement` and `src/pages/auth`.
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, Firebase, react-hook-form, Zod, react-router v6
- **How it improved the system:** Delivers role-based access control and hardened auth UX (correct handling for non-gryd-admin roles, complete sign-out on expiry, verified parker emails).
- **Evidence:** `src/pages/userManagement/`, `src/pages/auth/`; GPK-156 (user/parker split), GPK-86/96/360 (roles/permissions), GPK-1156 (non-admin auth fix), GPK-95 (forgot password), GPK-141 (token expiry), GPK-436 (email verify), GPK-1141/1411 (invitation/registration); 2024–2026

### Enforcement UI + license-plate search
- **Role:** Led
- **Product area / repos:** Enforcement — `grydpark-front`
- **What was built:** Enforcement report accordions, scan/report datagrid and right-panel, and license-plate search. Daniel is top author across the enforcement pages and hooks.
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, @tanstack/react-table
- **How it improved the system:** Gives enforcement staff searchable, structured access to scan/report data in the portal.
- **Evidence:** `src/pages/enforcement/`, `src/api/hooks/enforcement/enforcement.ts`, `src/components/organisms/datagrid/enforcement`; GPK-212; 2024

### Stripe payments frontend + in-person Terminal (contributed)
- **Role:** Led (Stripe frontend bootstrap & payment methods); Contributed (Terminal in-person checkout)
- **Product area / repos:** Payments — `grydpark-front`
- **What was built:** Daniel bootstrapped the Stripe frontend integration (Oct 2024), wired the price-calculation API into the frontend, built payment-method management, and added the free-transaction skip (zero-dollar bookings bypass Stripe). He also contributed to the in-person Stripe Terminal flow — the terminal receipt hook and the 853 Sherbrook terminal-booking support — but the Terminal checkout UI and core terminal hooks were primarily built by another engineer.
- **Tech & stack:** @stripe/stripe-js, @stripe/react-stripe-js, @stripe/terminal-js, TanStack Query 5, React 18, TypeScript
- **How it improved the system:** Established the portal's online payment layer and enabled staffed physical-lot (Terminal) checkouts, with free bookings correctly skipping payment.
- **Evidence:** `src/api/hooks/reservation/reservation.ts` (`useSendTerminalReceipt`), `src/components/organisms/right-panel/booking/terminal/` (contributed); "Init the stripe integration frontend" (2024-10-19), GPK-388 (price calc), GPK-514 (free-transaction skip), GPK-1290 (853 Sherbrook Terminal booking); 2024–2026

### Calendar & spot-block scheduling (block-event owner)
- **Role:** Key contributor
- **Product area / repos:** Scheduling — `grydpark-front`
- **What was built:** Within the vendored `mina-scheduler` calendar engine (co-owned roughly equally with another engineer), Daniel authored the block-event scheduling UI: the calendar block-event view, tooltips, and delete-confirmation modal, plus block-event create/delete hooks. The base `bookingCalendar.tsx` was written by the other engineer.
- **Tech & stack:** React 18, TypeScript, TanStack Query 5, Luxon, Radix UI + shadcn
- **How it improved the system:** Lets operators visually block spots/times and manage closures without engineering involvement.
- **Evidence:** `src/components/organisms/mina-scheduler/components/schedule/_components/view/calendarBlockEvent/CalendarBlockEvent.tsx`, `src/components/organisms/dialog/DeleteBlockEventDialog.tsx`, `src/api/hooks/calendar/blockEvent.ts`; GPK-909/824/922/899; 2025

### Guest checkout + QR, dashboard widgets & reusable foundations
- **Role:** Led (QR/guest checkout, autocomplete, foundations); Contributed (dashboard)
- **Product area / repos:** Guest conversion, analytics & shared infra — `grydpark-front`
- **What was built:** QR-code build + download and an anti-scam unique identifier, plus the guest-checkout confirmation screen. Reusable foundations: a paginated autocomplete component with infinite loading, a centralized `QueryKeys` enum, and a Luxon date migration. Daniel also contributed the missing dashboard widgets (the shared chart components render with Recharts).
- **Tech & stack:** React 18, TypeScript, react-qr-code, TanStack Query 5, react-intersection-observer, Recharts, Luxon
- **How it improved the system:** Improves guest conversion (QR + confirmation), analytics coverage, and long-term maintainability (shared autocomplete, centralized query keys, consistent date handling).
- **Evidence:** `src/pages/property-management/right-panels/tabs/AdditionalDetailsTab.tsx` (QR), `src/api/enum/queryKeys.enum.ts`; GPK-184 (QR build/download), GPK-987 (anti-scam id), GPK-986 (guest confirmation), GPK-192 (autocomplete), GPK-10 (Luxon migration), GPK-315 (dashboard widgets); 2024–2025

### Portal CI/CD (Docker + nginx, GCS + Cloud CDN)
- **Role:** Led
- **Product area / repos:** Delivery pipeline — `grydpark-front`
- **What was built:** A new GitHub Actions deployment flow for the portal building a Docker image (nginx-served SPA) and deploying to a GCS bucket fronted by Cloud CDN, with CDN cache invalidation via the gcloud CLI, across staging and production workflows.
- **Tech & stack:** GitHub Actions, Docker, nginx, Google Cloud Storage, Google Cloud CDN, gcloud CLI, Vite build
- **How it improved the system:** Automates portal builds and deploys with CDN cache invalidation, improving release reliability and dev velocity.
- **Evidence:** `.github/workflows/deploy.yml`, `staging.yml`, `production.yml`, `Dockerfile`, `nginx.conf`; GPK-1227; 2026

## F. Guest / Express Checkout (supporting)

Daniel founded and built the standalone GrydPark Express Checkout web app — a lightweight public guest-checkout flow carved out of the heavy portal, with its own routing, feature code, and GCS + Cloud CDN deploy pipeline. He authored 18 of the repo's 29 commits, including the initial scaffold of the entire app.

### Founded the standalone Express Checkout web app
- **Role:** Founder
- **Product area / repos:** Guest / express-checkout web app — `grydpark-express-checkout`
- **What was built:** Created the repo from scratch (Initial commit) and, in a single setup commit, stood up the whole application — ~104 files spanning pages, API hooks, providers, routing, and a feature-folder / atomic component layout (`api/`, `components/atoms` + `components/ui`, `pages/`, `providers/`, `forms/`, `routes/`). The module was extracted from the guest-checkout portion of `grydpark-front` into its own purpose-built React 18 + Vite 5 + TypeScript SPA, then de-branded from GC-prefixed names to express-checkout naming.
- **Tech & stack:** React 18, Vite 5, TypeScript, react-router-dom v6 (`createBrowserRouter` + `createRoutesFromElements` + `RouterProvider`), TanStack Query 5, Zustand 4, Radix UI + shadcn-style components, Tailwind CSS, react-hook-form + Zod
- **How it improved the system:** A deliberately small, fast public checkout surface — free of the portal's heavyweight dependencies (no react-table / Maps / Recharts / payment-terminal code) — so the QR/link guest path loads lean and ships independently of the main portal.
- **Evidence:** `src/` (whole tree); commits `Initial commit`, `Set up standalone guest-checkout project`, `Reorganize the project structure folder`, `Rename all to express-checkout (#6)`; Mar 2026 – Apr 2026

### Express-checkout wizard, booking extension, and receipts
- **Role:** Led
- **Product area / repos:** Guest checkout flow — `grydpark-express-checkout`
- **What was built:** Authored the multi-step guest flow — `Home` → `ParkingDuration` → `UserDetails` → `Payment` → `Confirmation`, plus a separate Extend track (`FindBooking` → duration → payment → confirmation) routed via `EC_ROUTES`. Built the supporting data layer: `useGetActiveLots`, `useGetLot`, `useGetSpotAvailability`, `useGetBookingFees`, `useInitiateExpressCheckout` for the core purchase; `useFindBooking`, `useValidateReservationForExtend`, `useExtendBooking` for extensions; and `useGetConfirmationBookingReceipt` / `useSendReceipt` for receipts. Also implemented the Firebase phone-OTP verification provider (`providers/FirebaseOtp.tsx`, with reCAPTCHA), the spot-unavailable error UX (GPK-1212), a fix for the confirmation-page crash on hard refresh, and the Zendesk help-link update (GPK-1339).
- **Tech & stack:** Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`), Firebase Auth phone OTP + reCAPTCHA, TanStack Query 5, Axios, libphonenumber-js / react-phone-number-input / react-international-phone, Luxon (+ date-fns), Zod, react-hook-form, Radix dialogs, framer-motion
- **How it improved the system:** Delivers the full QR/link guest journey — pick a lot and duration, phone-verify, pay, and get a receipt — plus in-place booking extension, without requiring an account or the full portal.
- **Evidence:** `src/pages/*`, `src/api/lot/*`, `src/api/reservation/*`, `src/api/payment/useGetBookingFees.ts`, `src/providers/FirebaseOtp.tsx`, `src/components/dialogs/*`; GPK-1212, GPK-1339; commit `Fix confirmation page crash after a hard refresh`; Mar 2026 – May 2026

### CI/CD deploy pipeline to GCS + Cloud CDN
- **Role:** Led
- **Product area / repos:** Deployment / infra — `grydpark-express-checkout`
- **What was built:** Authored all four GitHub Actions workflows: a `build-test.yml` gate, a reusable `deploy.yml` that builds and syncs `dist/` to a GCS bucket via `gcloud storage rsync` (with per-asset cache-control headers) and invalidates the Cloud CDN URL map for `index.html`, and `staging.yml` / `production.yml` callers wired to the `express-checkout-stage` and `express-checkout-prod` buckets.
- **Tech & stack:** GitHub Actions, Google Cloud Storage, Google Cloud CDN, `google-github-actions/setup-gcloud`, `gcloud storage` / `gcloud compute url-maps invalidate-cdn-cache`
- **How it improved the system:** Gives the standalone app repeatable, environment-separated static deploys (staging vs prod) with automatic CDN cache invalidation, so releases are one-click and independent of the portal's deploy cadence.
- **Evidence:** `.github/workflows/build-test.yml`, `.github/workflows/deploy.yml`, `.github/workflows/staging.yml`, `.github/workflows/production.yml`; PR #1; Mar 2026

## Cross-cutting themes

**Reliability & correctness.** Daniel's work repeatedly hardens the parts of the system where bugs cost money or trust. The Booking Flow V2 hold→confirm model (backend and mobile) removes double-booking races, backed by a `pg_cron` job that self-manages stale-hold cleanup. On mobile, his typed HTTP client centralizes 401/403 session-expiry handling and deduplicates concurrent auth failures so one expired token can't trigger multiple navigation resets. Luxon timezone corrections run across bookings, receipts, and monthly queries so money and time are computed correctly, and Stryker mutation testing (with Jest) verifies that the tests guarding critical API paths actually catch regressions.

**Cost & platform engineering.** Daniel consistently pushes the platform toward lower cost and less operational toil. He led the static-site migration program that moved the enforcement and portal apps off always-on Kubernetes pods onto GCS + Cloud CDN with managed TLS and correct cache semantics, and decommissioned the corresponding cluster workloads. He reduced GKE monitoring/logging spend by removing redundant cAdvisor/kubelet metrics once Managed Prometheus covered the same signals (GPK-1337) and trimming system-component logging. He also drove the single-region (`northamerica-northeast1`) consolidation for data residency and lower cross-region cost/latency, and wired Cloud Scheduler cron jobs into the IaC. (The complementary staging power-down Cloud Function and the `_Default` log-sink exclusion were authored by a teammate, Alain Carvalho, and are not credited to Daniel.)

**Integrations breadth.** Across repos, Daniel has integrated a wide range of third-party systems: Stripe (payments, webhooks, and in-person Stripe Terminal), QuickBooks Online (reconciled double-entry accounting), ButterflyMX (physical gate/door access), Twilio (SMS receipts and notifications), SendGrid-style email receipts, Firebase / Identity Platform (auth and phone OTP), Voucherify (vouchers, coupons, credits), Google Maps / Places (lot placement and location), Zendesk (help links), and Yardi-adjacent property data flows — spanning money movement, identity, physical hardware, messaging, and mapping.

## Scale & metrics appendix

| Repo | Type / Stack | Daniel's role | Approx. commits | Window |
|---|---|---|---|---|
| `grydpark-api` | Backend — NestJS 10, TypeORM, PostgreSQL 15, TS/Node 18 | #1 contributor | ~1,300+ | Jul 2024 → Jul 2026 |
| `grydpark-infra` | IaC — Terraform on GCP (GKE Autopilot, Cloud SQL, CDN) | Founder / primary author | ~90 | Nov 2025 → Jun 2026 |
| `gryd-cluster` | Kubernetes — Kustomize overlays, GKE Ingress, ManagedCertificate | Supporting contributor | ~17 | Dec 2024 → May 2026 |
| `Prod-MobileApp` | Mobile — React Native 0.79 + Expo SDK 53, React 19, TS | #1 contributor | ~251 | Nov 2024 → Jul 2026 |
| `grydpark-enforcement-app` | **Web SPA** (Vite + React 18, Tailwind/Radix) — not native | #2 contributor | ~31 | Dec 2024 → Dec 2025 |
| `grydpark-front` | Web — React 18 + Vite, TanStack Query, Radix/shadcn, Tailwind | Top-2 contributor | ~420 | Jul 2024 → Jun 2026 |
| `grydpark-express-checkout` | Web — React 18 + Vite (extracted guest checkout) | Founder / #1 | ~30 | Mar 2026 → May 2026 |

## Accuracy & attribution notes

- **Enforcement app is a web SPA, not native mobile.** `grydpark-enforcement-app` is a Vite + React 18 + TypeScript browser app officers run on a device; it should not be portrayed as a native mobile app.
- **CarPlay / Android Auto native plugins are NOT Daniel's.** They were authored by Alain Carvalho; Daniel only integrated them via PR #191 and is not credited as author.
- **Mobile testing pyramid is aspirational, not shipped.** The jest-expo / RNTL / MSW / Maestro / Pact testing stack described in the mobile testing standards is a target, and is NOT present in `Prod-MobileApp`'s `package.json`; do not claim it as shipped. By contrast, the Stryker + Jest setup in `grydpark-api` is real and shipped.
- **Commit counts and ranks are approximate,** derived from local clones and can shift with branch reachability and merging of name identities (DanielMai / dmai-gryd / Daniel Mai → `dmai@gryd.com`).

Material verification corrections folded into the sections above:

- **[A] QBO accounting: "Sole architect" → "Led."** File attribution shows substantial co-authorship (knguyen@gryd.com ~43 commits in `src/accounting`; `quickBooks.service.ts` originally created by danilo.meireles). Daniel created and dominates `qboJournal.service.ts` (41 of 53 commits) and the reconcile flow, so he clearly led but is not sole author.
- **[A] SecurePark "Sole architect" retained but qualified.** Daniel created the module and both services and authored `butterflyMx.service.ts` 100%; `securePark.service.ts` is ~80% his (a few commits by alain@ and tjustino@). Defensible as sole architect of the module's design and core.
- **[A] No `qboJournal` entity exists** — corrected. Accounting entities are `qboBill`, `qboContact`, and `reservationQboBill`; `qboJournal` exists only as a service.
- **[A] GPK-1274 removed from Daniel's scheduling credit.** GPK-1274 (new schedule table + sync) was authored by dwanke@gryd.com; Daniel branched/merged off it. His own GPK-1314/1315 (dashboard + cancel-booking migration) are retained.
- **[A] Scheduling confirmed "Led," not sole ownership.** Daniel is #1 in `src/scheduling` (~69 commits) but with significant others (shreyas ~30, knguyen ~12).
- **[A] GPK-634 (cron endpoint RBAC) has only ~1 Daniel commit;** cross-cutting role softened to "Contributed / Key contributor," not owner.
- **[A] `intuit-oauth-ts` verified real** (used in `quickBooks.service.ts`) — not a mistaken tech name.
- **[B] IaC platform "Founder" → "Owner."** `grydpark-infra` was initialized by Ramona (Ona) Niederhausern (first commit 2025-11-07), not Daniel. Daniel is majority/primary author (90 commits vs 24 Alain / 21 Ona) and wrote most modules, but did not found the repo.
- **[B] Staging power-down Cloud Function removed from Daniel's credit** — the `staging-env-toggle` module + `functions/staging-toggle/main.py` were authored entirely by Alain Carvalho. Only the Cloud Scheduler / region-strategy work (Daniel's) remains, folded into the IaC platform achievement.
- **[B] Cloud logging cost-optimization corrected** — the `logging.tf` `_Default` sink exclusion was authored entirely by Alain Carvalho, not Daniel. Role downgraded to "Contributed" and rescoped to Daniel's real work (GPK-1337 cAdvisor/kubelet removal and the system-component logging trim in `gke/main.tf` + tfvars).
- **[B] gryd-cluster base manifests corrected** — `base/http-to-https.yaml` (Flavio Toribio, Danilo Meireles) and `base/ingress-grydpark.yaml` / `managed-cert.yaml` (Flavio Toribio, Danilo Meireles, Tiago Justino) were not authored by Daniel. His genuine contribution is the Dec 2024 enforcement-app config and the later enforcement + portal decommissioning. Role kept as "Contributed."
- **[B] Cluster commit count clarified** — `git shortlog --all` counts 17 across all branches, but only 6 Daniel-authored commits are reachable on main; verifiable commits/tickets cited rather than the 17 figure.
- **[B] Added verified specifics** — Cloud SQL is PostgreSQL 18 with pgAudit flags and a Secret Manager-sourced password; the static-site LB uses `EXTERNAL_MANAGED` with origin-header Cloud CDN caching. `identity-platform` and `service-account` modules are co-authored with Ona (not solely Daniel).
- **[C] Release engineering "Owner" → "Key contributor."** The EAS Build / CI GitHub Actions workflows were originally created by Tiago Justino under GPK-1111. Daniel made substantial modifications (platform-input split #159, GPK-1282 eas.json fix #143, Android app bundle #157, buildNumber/versionCode) but did not originate the pipeline.
- **[C] Fastlane removed from the mobile stack** — not present in the repo (no Fastfile); submission is via `eas.json` (autoIncrement + auto-submit).
- **[C] Mobile commit count corrected** — `git log --author=dmai@gryd.com --oneline` returns 161 (not ~251); adjusted to ~161.
- **[C] Mobile first-commit date corrected** — Daniel's earliest authored commit is Oct 2, 2024 (PR #3, GPK-283), so the range is Oct 2024 – Jul 2026.
- **[C] `httpClient` upheld and strengthened to "Sole architect"** — git blame shows 194 of 195 lines by Daniel (1 incidental line by Alain Carvalho).
- **[C] Booking / auth / securePark "Led" confirmed (not sole)** — each directory has additional contributors (Dai Vo, Tiago Justino, Shane Fondeur, Dane Harrison) though Daniel is majority author.
- **[C] CarPlay/Android Auto and the aspirational testing pyramid excluded entirely** — no testing tooling is present in `package.json`.
- **[D] Time range extended to May 2026** — Daniel's enforcement DevOps commits run through the deploy re-platform #27 (2026-05-06) and cleanup #28 (2026-05-28); the 15s-polling feature (#22) is the Dec 2025 item.
- **[D] Static-site deploy logic lives in a reusable `deploy.yml`** called by `production.yml`/`staging.yml` (not in `production.yml` directly) and uses `gcloud storage rsync` (not `gsutil`) — both verified.
- **[D] Contributor count clarified** — 31 commits = 28 as "DanielMai" + 3 as "dmai-gryd" (same identity); #2 behind Shaun Lazaro (41).
- **[D] Polling feature scoped to the confirmed hook + `scanning.tsx`** — `scanning-details.tsx` / `selectZone.tsx` could not be confirmed as Daniel-authored, so they were dropped to avoid over-crediting.
- **[E] Portal commit count stated as ~370–420 ("co-leading, roughly tied")** — `git log --author=dmai@gryd.com` returns 371; name-variant totals sum to ~421. Kevin Nguyen (324) is the other top contributor.
- **[E] Stripe Terminal in-person checkout "Led" → "Contributed."** The terminal UI directory is primarily Kevin Nguyen (29 vs Daniel's 5) and the core hooks `useCreateStripeTerminalBooking`/`useUpdateTerminalReservation` are Kevin's. Daniel's "Led" is retained only for the Stripe frontend bootstrap, price-calc integration, payment-method management, and free-transaction skip (he authored `useSendTerminalReceipt` and GPK-1290).
- **[E] Calendar / spot-block scheduling "Led" → "Key contributor."** The `mina-scheduler` engine is co-owned ~equally (Kevin 17 vs Daniel 16) and `bookingCalendar.tsx` is Kevin's. Daniel clearly owns the block-event UI (calendarBlockEvent, DeleteBlockEventDialog, GPK-909).
- **[E] Zone management "Led" → "Contributed"** and folded into the property achievement — `form/zone/` is heavily shared (Kevin 28, Daniel 28, Edmond 27, Shane 12). Daniel's verified zone work is activate/deactivate (GPK-384) and edit-schedule (GPK-289).
- **[E] Dashboard/analytics "Led" → "Contributed."** The chart directories are primarily Kevin Nguyen and Edmond. Daniel's verified dashboard work is GPK-315 (missing widgets).
- **[E] GPK-293 corrected** — it is "Avoid rendering whole list of parkers on frontend" (a pagination/perf fix), not a revenue/metrics hook; removed from the dashboard/metrics claim.
- **[E] `mina-scheduler` is a vendored in-repo component library** (`src/components/organisms/mina-scheduler/`), not an npm dependency — labeled accordingly.
- **[E] Terminal file paths corrected** — terminal booking hooks live in `src/api/hooks/reservation/reservation.ts`; the terminal UI files are `stripeTerminalBooking.tsx` / `stripeTerminalCheckout.tsx`, etc.
- **[F] Phone-ban flow (GPK-1214 / `useCheckPhoneBan`) removed from Daniel's credit** — authored by Dai Vo (dvo@gryd.com), not Daniel.
- **[F] Express Checkout commit count corrected** — 18 of 29 total repo commits are Daniel's.
- **[F] Founder/architect role confirmed via file-level attribution** — the "Set up standalone guest-checkout project" commit created ~104 files (entire pages/hooks/components/providers tree); Daniel also authored the initial commit, structure reorg, and rename. `FirebaseOtp.tsx` and all cited hooks except `useCheckPhoneBan` originated in his setup commit.
- **[F] Added present-but-omitted libraries** — date-fns (alongside Luxon), framer-motion, react-select, react-phone-number-input, react-international-phone, qs.
- **[F] Other Express Checkout work explicitly NOT claimed for Daniel** — GPK-1286 phone-autofill country fix, GPK-1252 default-to-Canada, and GPK-1275 Husky standardization (Dane Harrison); Prettier/VSCode config commits #10, #13 (Alain Carvalho).

