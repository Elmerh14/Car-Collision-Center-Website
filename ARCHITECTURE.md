# Car Collision Center — Full-Stack Architecture Plan

## Repo Structure (Monorepo)

```
Car-Collision-Center-Website/
├── frontend/
│   ├── main-site/          ← rename current ccr-frontend/ here
│   └── admin-panel/        ← new Vite + React app
├── backend/
│   ├── content-service/
│   ├── media-service/
│   ├── estimate-service/
│   └── auth-service/
├── gateway/
│   └── router.yaml         ← Apollo Router config
└── docker-compose.yml
```

---

## Frontend Stack (both apps)

| Tool                  | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| React 19 + TypeScript | UI framework                                                |
| Vite                  | Dev server + bundler                                        |
| Tailwind CSS 4        | Styling                                                     |
| shadcn/ui             | Component library (copy-paste via `npx shadcn@latest init`) |
| Apollo Client         | GraphQL client + caching                                    |
| react-hook-form + zod | Form handling + validation                                  |
| embla-carousel-react  | Gallery carousel (shadcn/ui wraps this)                     |

---

## Main Site Sections

1. **Hero** — banner, tagline, phone, email (pulled from DB via GraphQL), "Get a Quote" CTA
2. **Services** — card grid (name, description, image) — data from `services` query
3. **Gallery** — image carousel — data from `galleryImages` query
4. **Estimate Request Form** — name, email, phone, vehicle make/model/year, damage description, optional photo upload
5. **Footer** — contact info, hours, address (from DB)

---

## Admin Panel Pages

| Route        | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `/login`     | Username + password → JWT stored in httpOnly cookie |
| `/dashboard` | Overview + recent estimate requests                 |
| `/hero`      | Edit phone, email, headline text                    |
| `/services`  | Add / edit / delete / reorder service cards         |
| `/gallery`   | Upload / delete carousel images                     |
| `/estimates` | View submitted quote requests                       |

---

## Backend — 4 Spring Boot DGS Microservices

**Common setup for each service:**

- Java 21, Spring Boot 3.x
- Lombok (`@Data`, `@Builder`, `@RequiredArgsConstructor`, etc.)
- Netflix DGS: `com.netflix.graphql.dgs:graphql-dgs-spring-graphql-starter`
- Spring Data JPA + PostgreSQL driver
- Each service connects to its own schema on NeonDB

---

### `auth-service` (build this first)

**DB schema `auth`:**

```
admin_user     (id, username, password_hash, created_at)
refresh_token  (id, admin_user_id, token_hash, expires_at, revoked)
```

**GraphQL mutations:**

```graphql
login(username: String!, password: String!) → AuthPayload { accessToken, expiresIn }
logout → Boolean
refreshToken → AuthPayload
```

**Libraries:** `io.jsonwebtoken:jjwt`, Spring Security

**Token strategy:** Access token = 15 min JWT. Refresh token = 7 days, stored in DB. Set both as httpOnly cookies on the admin subdomain.

---

### `content-service`

**DB schema `content`:**

```
site_config   (id, hero_title, hero_subtitle, phone, email, address, business_hours, updated_at)
service_card  (id, name, description, image_asset_id, display_order, is_active, created_at)
```

**GraphQL:**

```graphql
# Queries (public)
siteConfig: SiteConfig
services: [ServiceCard!]!

# Mutations (admin only)
updateSiteConfig(input: UpdateSiteConfigInput!): SiteConfig!
createService(input: CreateServiceInput!): ServiceCard!
updateService(id: ID!, input: UpdateServiceInput!): ServiceCard!
deleteService(id: ID!): Boolean!
reorderServices(ids: [ID!]!): [ServiceCard!]!
```

---

### `media-service`

**DB schema `media`:**

```
media_asset (id, filename, r2_key, public_url, context, uploaded_at, is_active)
```

**Context enum:** `HERO | SERVICE | GALLERY | ESTIMATE`

**Cloudflare R2 setup:**

- Create R2 bucket in the Cloudflare dashboard
- Use `software.amazon.awssdk:s3` with a custom endpoint: `https://<account-id>.r2.cloudflarestorage.com`
- Generate an R2 API token for S3-compatible access

**Upload flow (presigned URL pattern):**

1. Client calls `requestUploadUrl(filename, context)` → service returns a presigned R2 PUT URL + the future public URL
2. Browser `PUT`s the file directly to R2 — never touches your server
3. Client calls `confirmUpload(assetId)` → marks the asset active in the DB

**GraphQL:**

```graphql
# Queries
galleryImages: [MediaAsset!]!
mediaAsset(id: ID!): MediaAsset

# Mutations
requestUploadUrl(filename: String!, context: MediaContext!): PresignedUpload!
confirmUpload(assetId: ID!): MediaAsset!
deleteMedia(id: ID!): Boolean!  # admin only
```

---

### `estimate-service`

**DB schema `estimates`:**

```
estimate_request (id, name, email, phone, vehicle_make, vehicle_model, vehicle_year,
                  damage_description, image_url, submitted_at, status)
```

**Status enum:** `PENDING | REVIEWED | QUOTED`

**Email on submission:** `spring-boot-starter-mail` → `JavaMailSender`. Recommended SMTP provider: **Resend** (resend.com) — free tier is 3,000 emails/month, simple setup, great deliverability.

**GraphQL:**

```graphql
# Queries (admin only)
estimateRequests: [EstimateRequest!]!
estimateRequest(id: ID!): EstimateRequest

# Mutations (public)
submitEstimateRequest(input: SubmitEstimateInput!): EstimateRequest!
```

---

## GraphQL Gateway — Apollo Router

Apollo Router sits in front of all 4 subgraphs and federates them into one unified schema.

- Run via Docker: `ghcr.io/apollographql/router`
- Use `rover` CLI to compose the supergraph SDL from each subgraph's schema
- Configure JWT validation in `router.yaml` — Router verifies the token and injects an `x-admin-user-id` header to downstream subgraphs
- Both the main site and admin panel hit a single endpoint: `http://localhost:4000/graphql`

---

## Infrastructure

| Concern       | Tool                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| Database      | NeonDB (PostgreSQL) — one project, 4 schemas: `auth`, `content`, `media`, `estimates` |
| Image storage | Cloudflare R2 — free egress, ~$0.015/GB/month storage                                 |
| Email         | Resend (SMTP relay)                                                                   |
| Local dev     | `docker-compose.yml` — runs all 4 services, Apollo Router, and a local Postgres       |

---

## Auth Decision

**JWT (not OAuth2)** — OAuth2 is overkill for a 1–2 person admin panel where you control all accounts. JWT with Spring Security is straightforward and sufficient.

---

## Build Order Recommendation

1. **Repo restructure** — move `ccr-frontend/` → `frontend/main-site/`, create the other directories
2. **`auth-service`** — get JWT login working end-to-end first
3. **Apollo Router** — configure the gateway with just `auth-service` to start
4. **`content-service`** — hero config + service card CRUD
5. **Main site frontend** — finish NavBar desktop view, then build sections top to bottom
6. **`media-service`** — set up R2 bucket + implement presigned URL flow
7. **`estimate-service`** — form submission + email notification
8. **Admin panel** — login page first, then each editor page
