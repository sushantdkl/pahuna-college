# Pahuna Public UI Reference Mapping

Source inspected: `C:\Users\Acer\Downloads\client.zip`, extracted to `C:\Users\Acer\.codex\visualizations\2026\07\22\019f890f-2b84-7d20-98ad-ea3f52453963\pahuna-client-ref\client`.

The reference public UI is adapted into the current Sprint9 project without changing branch. Public pages keep the reference visual system while using the existing backend helpers and final CRUD contracts.

| Public route | Reference source | Current route/component | Backend integration |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx`, layout/header/footer/shared cards | `frontend/app/page.tsx` | Uses curated public fallbacks and links into backend-backed stays, food, destinations, routes, planner, contact |
| `/explore` | `src/app/explore/page.tsx`, Surkhet assets/cards | `frontend/app/explore/page.tsx` | Uses public content plus linked backend-backed food/stays/destinations/routes |
| `/hotels`, `/stays` | `src/app/hotels/page.tsx`, hotel cards/map | `frontend/app/hotels/page.tsx`, `frontend/app/stays/page.tsx` | `getHotels`, hotel detail route, protected inquiry CTA |
| `/hotels/[slug]` | `src/app/hotels/[slug]/page.tsx` | `frontend/app/hotels/[slug]/page.tsx` | `getHotelBySlug`, inquiry form |
| `/food` | `src/app/food/page.tsx`, food filters/cards | `frontend/app/food/page.tsx` | `getFoodProviders` with fallback public listings |
| `/food/[slug]` | `src/app/food/[slug]/page.tsx` | `frontend/app/food/[slug]/page.tsx` | `getFoodProviderBySlug` style detail route |
| `/destinations` | `src/app/destinations/page.tsx` | `frontend/app/destinations/page.tsx` | `getDestinations` plus featured destination presentation |
| `/destinations/[slug]` | `src/app/destinations/[slug]/page.tsx` | `frontend/app/destinations/[slug]/page.tsx` | `getDestinationBySlug` |
| `/experiences` | `src/app/experiences/page.tsx`, map and category chips | `frontend/app/experiences/page.tsx` | `getExperiences` with category filtering |
| `/experiences/[slug]` | `src/app/experiences/[slug]/page.tsx` | `frontend/app/experiences/[slug]/page.tsx` | `getExperienceBySlug` |
| `/itineraries` | `src/app/itineraries/page.tsx` | `frontend/app/itineraries/page.tsx` | Reference layout with planner/detail links; itinerary CRUD remains active in dashboard/API |
| `/trip-planner` | `src/app/trip-planner/page.tsx` | `frontend/app/trip-planner/page.tsx` | `ItineraryPlannerForm`, suggested hotels/food/destinations/routes |
| `/routes`, `/trip-cost` | `src/app/routes/page.tsx`, `src/app/trip-cost/page.tsx` | `frontend/app/routes/page.tsx`, `frontend/app/trip-cost/page.tsx` | `getRouteSegments`, `getTransportRoutes` |
| `/trip-packages` | `src/app/packages/page.tsx` | `frontend/app/trip-packages/page.tsx` | `getTripPackagesAction`, protected package inquiry |
| `/trip-packages/[slug]` | `src/app/packages/[slug]/page.tsx` | `frontend/app/trip-packages/[slug]/page.tsx` | package detail + inquiry |
| `/contact` | `src/app/contact/page.tsx` | `frontend/app/contact/page.tsx` | `createContactMessageAction`, inquiry helpers |
| `/consulting` | `src/app/consulting/page.tsx` | `frontend/app/consulting/page.tsx`, `consulting-client.tsx` | `getConsultingServices`, `createConsultingLeadAction` |
| `/consulting/[slug]` | `src/app/consulting/[slug]/page.tsx` | `frontend/app/consulting/[slug]/page.tsx` | consulting service detail |
| `/training` | `src/app/training/page.tsx` | `frontend/app/training/page.tsx`, `training-client.tsx` | `getTrainingCourses`, `createTrainingEnrollmentAction` |
| `/training/[slug]` | `src/app/training/[slug]/page.tsx` | `frontend/app/training/[slug]/page.tsx` | training course detail |
| `/partner` | `src/app/partner/page.tsx` | `frontend/app/partner/page.tsx` | `createPartnerApplicationAction` |

Final active CRUD scope preserved: users, hotels/stays, destinations, experiences, itineraries/trip planner, inquiries, contact messages, partner applications, food providers, trip packages, transport routes/segments, training courses/enrollments, consulting services/leads.

Static-only reference sections retained where useful: case studies, testimonials, success stories, FAQs, local tips, and planning confidence. These are presentation sections only and do not introduce active Blog, FAQ, Testimonial, Newsletter, CaseStudy, Review, Payment, or Booking CRUD.
