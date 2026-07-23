# Pahuna Final CRUD Audit Matrix

Audit branch: `Sprint9`

Database technology found: MongoDB with Mongoose models.

Backend architecture found: Express app registration -> route -> auth/admin middleware -> controller -> service -> Mongoose model -> `ApiResponseHelper`.

Frontend architecture found: Next.js App Router pages -> feature/client components -> server actions/API helpers -> centralized `axios-instance` fetch helper -> Express API.

## Final 15 CRUD Status

| # | CRUD entity | Model | Public route/API | Admin route/API | Frontend integration | Security | Search/filter/page | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | User | `user.model.ts` | `/api/v1/auth/*` | `/api/v1/admin/users` | login/register/profile/admin users | auth/admin middleware, password hashing | admin search/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 2 | Hotel / Stays | `hotel.model.ts` | `/api/v1/hotels` | `/api/v1/admin/hotels` | `/hotels`, detail, dashboard hotels | admin protected writes, protected inquiry | search/property/district/featured/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 3 | Destination | `destination.model.ts` | `/api/v1/destinations` | `/api/v1/admin/destinations` | `/destinations`, detail, dashboard content | admin protected writes | search/category/district/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 4 | Experience | `experience.model.ts` | `/api/v1/experiences` | `/api/v1/admin/experiences` | `/experiences`, detail, dashboard experiences | admin protected writes | search/category/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 5 | Itinerary | `itinerary.model.ts` | `/api/v1/itineraries`, protected own routes | `/api/v1/admin/itineraries` | trip planner, profile itineraries, dashboard trip planner | ownership checks + admin protection | admin/user list/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 6 | Inquiry | `inquiry.model.ts` | `/api/v1/inquiries` | `/api/v1/admin/inquiries` | hotel/package inquiry, dashboard leads | auth required for submit, admin protected management | search/status/type/page | COMPLETED: package relation added; canonical query fixed |
| 7 | ContactMessage | `contact-message.model.ts` | `/api/v1/contact-messages` | `/api/v1/admin/contact-messages` | contact form, dashboard messages | public submit, admin protected management | search/status/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 8 | PartnerApplication | `partner-application.model.ts` | `/api/v1/partner-applications` | `/api/v1/admin/partner-applications` | partner form, dashboard partners | public submit, admin review protected | search/status/type/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 9 | FoodProvider | `food-provider.model.ts` | `/api/v1/food-providers` | `/api/v1/admin/food-providers` | food list/detail, dashboard food | admin protected writes | search/type/area/district/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 10 | TripPackage | `trip-package.model.ts` | `/api/v1/trip-packages` | `/api/v1/admin/trip-packages` | package list/detail, inquiry flow | admin protected writes, protected package inquiry | search/featured/destination/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 11 | TransportRoute / RouteSegment | `transport-route.model.ts`, `route-segment.model.ts` | `/api/v1/transport-routes`, `/api/v1/route-segments` | matching admin routes | route/cost page, dashboard routes | admin protected writes | search/mode/active/featured/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 12 | TrainingCourse | `training-course.model.ts` | `/api/v1/training-courses` | `/api/v1/admin/training-courses` | training public/detail, dashboard training | admin protected writes | search/category/level/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 13 | TrainingEnrollment | `training-enrollment.model.ts` | `/api/v1/training-enrollments` | `/api/v1/admin/training-enrollments` | enrollment form, dashboard training | public submit, admin protected review | search/status/course/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 14 | ConsultingService | `consulting-service.model.ts` | `/api/v1/consulting-services` | `/api/v1/admin/consulting-services` | consulting public/detail, dashboard consulting | admin protected writes | search/category/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |
| 15 | ConsultingLead | `consulting-lead.model.ts` | `/api/v1/consulting-leads` | `/api/v1/admin/consulting-leads` | consulting lead form, dashboard consulting | public submit, admin protected review | search/status/type/page | PRESENT, VERIFIED BY STATIC CONTRACT + BUILD |

## Runtime Verification Boundary

This audit verified route registration, frontend endpoint paths, request/response contracts, auth/admin middleware placement, TypeScript compilation, and production builds. Full create/update/delete smoke testing against a live MongoDB instance was not completed in this pass because no running database/API session was available in the workspace context.

## Fixed Contract Issues

- Inquiry admin frontend now sends canonical `inquiryType` query parameter.
- Inquiry now supports optional `tripPackageId` so protected package inquiries are stored with a real TripPackage relationship.
- Inquiry admin services populate and search related package records.

## Cleanup Candidate Report

Confirmed unused active-extra CRUD source files removed:

- `backend/src/models/blog-post.model.ts`
- `backend/src/types/blog-post.type.ts`
- `backend/src/models/faq.model.ts`
- `backend/src/models/newsletter-subscriber.model.ts`
- `backend/src/types/newsletter-subscriber.type.ts`
- `backend/src/models/testimonial.model.ts`

Usage search found no active route, controller, service, frontend helper, or dashboard import for these files. Static FAQ/testimonial/case-study presentation sections remain as static UI content only.
