# Pahuna Complete Platform Redesign Audit

Branch audited: `Sprint9`

## Core Backend Coverage

The current backend already exposes the final active scope through one API style:

| Functional module | Entity coverage | Public endpoints | Admin endpoints |
| --- | --- | --- | --- |
| Users | User | `/api/v1/auth/*` | `/api/v1/admin/users` |
| Hotels / Stays | Hotel | `/api/v1/hotels` | `/api/v1/admin/hotels` |
| Destinations | Destination | `/api/v1/destinations` | `/api/v1/admin/destinations` |
| Experiences | Experience | `/api/v1/experiences` | `/api/v1/admin/experiences` |
| Itineraries | Itinerary | `/api/v1/itineraries/options`, protected own itineraries | `/api/v1/admin/itineraries` |
| Inquiries | Inquiry | `/api/v1/inquiries` protected submit | `/api/v1/admin/inquiries` |
| Contact | ContactMessage | `/api/v1/contact-messages` | `/api/v1/admin/contact-messages` |
| Partners | PartnerApplication | `/api/v1/partner-applications` | `/api/v1/admin/partner-applications` |
| Food | FoodProvider | `/api/v1/food-providers` | `/api/v1/admin/food-providers` |
| Packages | TripPackage | `/api/v1/trip-packages` | `/api/v1/admin/trip-packages` |
| Routes | TransportRoute / RouteSegment | `/api/v1/transport-routes`, `/api/v1/route-segments` | `/api/v1/admin/transport-routes`, `/api/v1/admin/route-segments` |
| Training | TrainingCourse / TrainingEnrollment | `/api/v1/training-courses`, `/api/v1/training-enrollments` | `/api/v1/admin/training-courses`, `/api/v1/admin/training-enrollments` |
| Consulting | ConsultingService / ConsultingLead | `/api/v1/consulting-services`, `/api/v1/consulting-leads` | `/api/v1/admin/consulting-services`, `/api/v1/admin/consulting-leads` |

No active BlogPost, FAQ, Testimonial, NewsletterSubscriber, CaseStudy, Payment, Review, Rating, or Booking CRUD routes were added.

## Route Redesign Matrix

| Area | Current route(s) | Current implementation quality | Required redesign work |
| --- | --- | --- | --- |
| Global shell | `SiteHeader`, `SiteFooter`, `PageShell` | Reference-aligned but needed unified tokens/focus/states | Consolidate design tokens, focus states, reusable empty/error/loading primitives |
| Public home | `/` | Full body present, static highlights link to backend-backed pages | Keep cohesive system; future enhancement can fetch homepage feature strips directly server-side |
| Explore | `/explore` | Complete story sections, food/route links | Add true map integration later if desired |
| Stays | `/hotels`, `/stays`, detail | Backend connected; map/card/list states exist | Align controls and page details with system primitives |
| Food | `/food`, detail | Backend connected with filters and fallbacks | Add optional map/list switch later |
| Destinations | `/destinations`, detail | Backend connected with featured/reference hero | Detail pages should share the same status/card primitives |
| Experiences | `/experiences`, detail | Backend connected with chips, map-style panel, CTA | Add itinerary-add action when backend contract supports it |
| Trip planner | `/trip-planner` | Form and planning body present | Multi-step wizard can be made deeper in a later functional sprint |
| Itineraries | `/itineraries` | Reference listing/CTA shell present | Add public itinerary detail if public endpoint is added |
| Routes / cost | `/routes`, `/trip-cost` | Backend route data connected | Add richer calculator persistence only if required |
| Packages | `/trip-packages`, detail | Backend connected, protected inquiry flow | Add filters/search to client list as package count grows |
| Contact | `/contact` | Backend form connected, map panel present | Production map tile QA required with live env |
| Partner | `/partner` | Backend application form connected | Good current scope |
| Training | `/training`, detail | Backend courses/enrollment plus static FAQ/stories | Good current scope |
| Consulting | `/consulting`, detail | Backend services/leads plus static case/testimonial sections | Good current scope |
| Auth | `/login`, `/register`, `/admin/login` | Functional and branded, but mixed radius/color usage | Align inputs/buttons/cards to global tokens |
| Profile/account | `/profile`, `/account-settings` | Functional but visibly more rounded than public pages | Align radius/tokens and empty states |
| Admin dashboard | `/admin`, `/dashboard/*`, `/admin/users` | Functional generic CRUD shell | Improve final-module nav labels, tables, dialogs, loading/empty/error states, accessibility labels |

## Design-System Findings

- Colors existed as one-off Tailwind classes; root Pahuna tokens are now needed for consistency.
- Loading, empty, error, map, and badge UI should be reusable rather than page-specific ad hoc blocks.
- Admin shell and public shell used similar colors but different density and state language.
- Some text contained encoding artifacts from earlier copied arrows/bullets; these should be removed when touched.

## Safe Cleanup Decision

No broad file deletion is performed in this pass because many routes are connected through Next route discovery or backend/admin flows. Cleanup remains limited to dead navigation labels, reusable state consolidation, and replacing obsolete presentation code when a file is actively redesigned.
