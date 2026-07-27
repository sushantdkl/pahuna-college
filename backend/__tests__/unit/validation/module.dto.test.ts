import {
  AdminCreateDestinationDTO,
  AdminUpdateDestinationDTO,
} from "../../../src/dtos/admin-destination.dto";
import {
  AdminCreateExperienceDTO,
  AdminUpdateExperienceDTO,
} from "../../../src/dtos/admin-experience.dto";
import {
  AdminCreateHotelDTO,
  AdminUpdateHotelDTO,
} from "../../../src/dtos/admin-hotel.dto";
import {
  BlogPostListQueryDTO,
  CreateBlogPostDTO,
  UpdateBlogPostDTO,
} from "../../../src/dtos/blog-post.dto";
import {
  AdminConsultingLeadListQueryDTO,
  AdminConsultingServiceListQueryDTO,
  CreateConsultingLeadDTO,
  CreateConsultingServiceDTO,
  UpdateConsultingLeadDTO,
  UpdateConsultingServiceDTO,
} from "../../../src/dtos/consulting.dto";
import {
  CreateFoodProviderDTO,
  CreateRouteSegmentDTO,
  CreateTransportRouteDTO,
  FoodProviderListQueryDTO,
  RouteListQueryDTO,
  UpdateFoodProviderDTO,
  UpdateRouteSegmentDTO,
  UpdateTransportRouteDTO,
} from "../../../src/dtos/final-crud.dto";
import {
  AdminCreateItineraryDTO,
  AdminItineraryListQueryDTO,
  CreateItineraryDTO,
  UpdateItineraryDTO,
} from "../../../src/dtos/itinerary.dto";
import {
  AdminTrainingCourseListQueryDTO,
  AdminTrainingEnrollmentListQueryDTO,
  CreateTrainingCourseDTO,
  CreateTrainingEnrollmentDTO,
  UpdateTrainingCourseDTO,
  UpdateTrainingEnrollmentDTO,
} from "../../../src/dtos/training.dto";
import {
  AdminTripPackageListQueryDTO,
  CreateTripPackageDTO,
  TripPackageListQueryDTO,
  UpdateTripPackageDTO,
} from "../../../src/dtos/trip-package.dto";

const mongoId = "507f1f77bcf86cd799439011";

const validHotel = {
  name: "QA-TEST Hotel",
  description: "A hotel for DTO tests.",
  address: "Birendranagar",
  propertyType: "Hotel",
  contactPhone: "9800000000",
};

const validDestination = {
  name: "QA-TEST Destination",
  description: "A public place.",
};

const validExperience = {
  name: "QA-TEST Experience",
  description: "A local activity.",
  category: "Culture",
  location: "Surkhet",
};

const validBlogPost = {
  title: "QA-TEST Blog",
  excerpt: "Short excerpt.",
  content: "Longer content.",
  authorName: "Pahuna",
};

const validCourse = {
  title: "QA-TEST Course",
  description: "Course description.",
};

const validEnrollment = {
  courseId: mongoId,
  fullName: "QA-TEST Student",
  email: "student@example.com",
  phone: "9800000000",
};

const validConsultingService = {
  title: "QA-TEST Consulting",
  description: "Service description.",
};

const validConsultingLead = {
  contactName: "QA-TEST Lead",
  email: "lead@example.com",
  phone: "9800000000",
  message: "Need help with operations.",
};

const validFoodProvider = {
  name: "QA-TEST Cafe",
  type: "Cafe",
  district: "Surkhet",
  area: "Birendranagar",
  shortDescription: "Coffee and snacks.",
};

const validRoute = {
  fromLocation: "Surkhet",
  toLocation: "Rara",
  mode: "Jeep",
};

const validSegment = {
  from: "Surkhet",
  to: "Rara",
  mode: "JEEP",
};

const validItinerary = {
  title: "QA-TEST Itinerary",
  destinationId: mongoId,
};

const validAdminItinerary = {
  ...validItinerary,
  userId: mongoId,
};

const validTripPackage = {
  title: "QA-TEST Package",
  description: "Package description.",
};

describe("core module DTO validation", () => {
  const validCases = [
    ["hotel create accepts minimum contact phone", AdminCreateHotelDTO, validHotel],
    ["hotel update accepts partial active status", AdminUpdateHotelDTO, { isActive: "false" }],
    ["destination create accepts minimum content", AdminCreateDestinationDTO, validDestination],
    ["destination update accepts images CSV", AdminUpdateDestinationDTO, { images: "/a.jpg,/b.jpg" }],
    ["experience create accepts minimum content", AdminCreateExperienceDTO, validExperience],
    ["experience update coerces price string", AdminUpdateExperienceDTO, { price: "1200" }],
    ["blog create accepts draft defaults", CreateBlogPostDTO, validBlogPost],
    ["blog query defaults pagination", BlogPostListQueryDTO, {}],
    ["training course create accepts minimum content", CreateTrainingCourseDTO, validCourse],
    ["training enrollment accepts fullName alias", CreateTrainingEnrollmentDTO, validEnrollment],
    ["consulting service create accepts minimum content", CreateConsultingServiceDTO, validConsultingService],
    ["consulting lead accepts contactName alias", CreateConsultingLeadDTO, validConsultingLead],
    ["food provider create accepts minimum content", CreateFoodProviderDTO, validFoodProvider],
    ["food query accepts featured flag", FoodProviderListQueryDTO, { featured: "true" }],
    ["transport route create accepts minimum content", CreateTransportRouteDTO, validRoute],
    ["route segment create accepts minimum content", CreateRouteSegmentDTO, validSegment],
    ["route query accepts active flag", RouteListQueryDTO, { active: "false" }],
    ["itinerary create accepts minimum content", CreateItineraryDTO, validItinerary],
    ["admin itinerary create requires user", AdminCreateItineraryDTO, validAdminItinerary],
    ["itinerary query accepts status filter", AdminItineraryListQueryDTO, { status: "DRAFT" }],
    ["trip package create accepts minimum content", CreateTripPackageDTO, validTripPackage],
    ["trip package query accepts featured flag", TripPackageListQueryDTO, { featured: "true" }],
    ["admin trip package query accepts active flag", AdminTripPackageListQueryDTO, { active: "true" }],
    ["admin course query accepts active flag", AdminTrainingCourseListQueryDTO, { active: "true" }],
    ["admin enrollment query accepts status", AdminTrainingEnrollmentListQueryDTO, { status: "PENDING" }],
    ["admin consulting service query accepts active flag", AdminConsultingServiceListQueryDTO, { active: "true" }],
    ["admin consulting lead query accepts status", AdminConsultingLeadListQueryDTO, { status: "NEW" }],
    ["hotel create accepts email as contact method", AdminCreateHotelDTO, { ...validHotel, contactPhone: "", email: "hotel@example.com" }],
    ["hotel create coerces amenity CSV", AdminCreateHotelDTO, { ...validHotel, amenities: "Wi-Fi,Parking" }],
    ["destination create coerces featured flag", AdminCreateDestinationDTO, { ...validDestination, isFeatured: "true" }],
    ["destination update coerces distance string", AdminUpdateDestinationDTO, { distanceFromSurkhetKm: "42" }],
    ["experience update coerces rating string", AdminUpdateExperienceDTO, { rating: "4.5" }],
    ["blog create accepts comma tags", CreateBlogPostDTO, { ...validBlogPost, tags: "Travel,Karnali" }],
    ["blog create accepts published status", CreateBlogPostDTO, { ...validBlogPost, status: "PUBLISHED" }],
    ["training course create coerces price string", CreateTrainingCourseDTO, { ...validCourse, price: "2500" }],
    ["training enrollment accepts name alias", CreateTrainingEnrollmentDTO, { ...validEnrollment, fullName: undefined, name: "QA-TEST Student" }],
    ["consulting service accepts comma deliverables", CreateConsultingServiceDTO, { ...validConsultingService, deliverables: "Audit,Plan" }],
    ["consulting lead accepts stage and budget aliases", CreateConsultingLeadDTO, { ...validConsultingLead, businessStage: undefined, stage: "Early", budgetRange: "NPR 50k" }],
    ["food provider accepts cuisine CSV", CreateFoodProviderDTO, { ...validFoodProvider, cuisines: "Coffee,Snacks" }],
    ["route segment accepts featured flag", CreateRouteSegmentDTO, { ...validSegment, featured: true }],
    ["itinerary create accepts public string", CreateItineraryDTO, { ...validItinerary, isPublic: "true" }],
    ["trip package accepts highlights CSV", CreateTripPackageDTO, { ...validTripPackage, highlights: "Lake,Temple" }],
  ] as const;

  test.each(validCases)("%s", (_name, schema, payload) => {
    expect(schema.safeParse(payload).success).toBe(true);
  });

  const invalidCases = [
    ["hotel create rejects missing email and phone", AdminCreateHotelDTO, { ...validHotel, contactPhone: "", email: "" }],
    ["hotel create rejects bad email", AdminCreateHotelDTO, { ...validHotel, email: "bad-email" }],
    ["destination create rejects blank name", AdminCreateDestinationDTO, { ...validDestination, name: "" }],
    ["destination create rejects blank description", AdminCreateDestinationDTO, { ...validDestination, description: "" }],
    ["experience create rejects missing category", AdminCreateExperienceDTO, { ...validExperience, category: "" }],
    ["experience create rejects missing location", AdminCreateExperienceDTO, { ...validExperience, location: "" }],
    ["blog create rejects bad slug", CreateBlogPostDTO, { ...validBlogPost, slug: "Bad Slug" }],
    ["blog query rejects huge limit", BlogPostListQueryDTO, { limit: "500" }],
    ["blog query rejects invalid status", BlogPostListQueryDTO, { status: "ARCHIVED" }],
    ["training course rejects end before start", CreateTrainingCourseDTO, { ...validCourse, startDate: "2026-02-02", endDate: "2026-01-01" }],
    ["training course update rejects empty payload", UpdateTrainingCourseDTO, {}],
    ["training enrollment rejects bad email", CreateTrainingEnrollmentDTO, { ...validEnrollment, email: "bad-email" }],
    ["training enrollment rejects short phone", CreateTrainingEnrollmentDTO, { ...validEnrollment, phone: "123" }],
    ["training enrollment update rejects empty payload", UpdateTrainingEnrollmentDTO, {}],
    ["consulting service rejects remote image", CreateConsultingServiceDTO, { ...validConsultingService, image: "https://example.com/a.jpg" }],
    ["consulting service update rejects bad slug", UpdateConsultingServiceDTO, { slug: "Bad Slug" }],
    ["consulting lead rejects missing message", CreateConsultingLeadDTO, { ...validConsultingLead, message: "" }],
    ["consulting lead update rejects empty payload", UpdateConsultingLeadDTO, {}],
    ["food provider rejects bad latitude", CreateFoodProviderDTO, { ...validFoodProvider, latitude: "100" }],
    ["food provider rejects bad image path", CreateFoodProviderDTO, { ...validFoodProvider, images: "https://example.com/a.jpg" }],
    ["food provider update rejects invalid verification status", UpdateFoodProviderDTO, { verificationStatus: "LIVE" }],
    ["transport route rejects reversed cost range", CreateTransportRouteDTO, { ...validRoute, costMin: 1000, costMax: 10 }],
    ["transport route update rejects reversed cost range", UpdateTransportRouteDTO, { costMin: 1000, costMax: 10 }],
    ["route segment rejects reversed duration range", CreateRouteSegmentDTO, { ...validSegment, durationMin: 100, durationMax: 10 }],
    ["route segment create rejects invalid mode", CreateRouteSegmentDTO, { ...validSegment, mode: "CAR" }],
    ["route segment update rejects reversed cost range", UpdateRouteSegmentDTO, { costMin: 1000, costMax: 10 }],
    ["itinerary rejects invalid destination id", CreateItineraryDTO, { ...validItinerary, destinationId: "bad-id" }],
    ["itinerary rejects end before start", CreateItineraryDTO, { ...validItinerary, startDate: "2026-02-02", endDate: "2026-01-01" }],
    ["itinerary update rejects empty payload", UpdateItineraryDTO, {}],
    ["admin itinerary rejects missing user id", AdminCreateItineraryDTO, validItinerary],
    ["admin itinerary query rejects bad destination id", AdminItineraryListQueryDTO, { destinationId: "bad-id" }],
    ["trip package rejects reversed price range", CreateTripPackageDTO, { ...validTripPackage, priceMin: 5000, priceMax: 1000 }],
    ["trip package update rejects reversed price range", UpdateTripPackageDTO, { priceMin: 5000, priceMax: 1000 }],
    ["trip package query rejects bad page", TripPackageListQueryDTO, { page: "0" }],
    ["food query rejects invalid verification", FoodProviderListQueryDTO, { verificationStatus: "LIVE" }],
    ["route query rejects huge limit", RouteListQueryDTO, { limit: "1000" }],
    ["admin enrollment query rejects invalid status", AdminTrainingEnrollmentListQueryDTO, { status: "DONE" }],
    ["admin consulting lead query rejects invalid status", AdminConsultingLeadListQueryDTO, { status: "DONE" }],
    ["hotel create rejects missing property type", AdminCreateHotelDTO, { ...validHotel, propertyType: "" }],
    ["destination create rejects invalid distance", AdminCreateDestinationDTO, { ...validDestination, distanceFromSurkhetKm: "far" }],
    ["experience update rejects invalid review count", AdminUpdateExperienceDTO, { reviewCount: "many" }],
    ["blog create rejects blank title", CreateBlogPostDTO, { ...validBlogPost, title: "" }],
    ["blog create rejects blank content", CreateBlogPostDTO, { ...validBlogPost, content: "" }],
    ["training course rejects zero capacity", CreateTrainingCourseDTO, { ...validCourse, maxParticipants: 0 }],
    ["training course rejects remote image", CreateTrainingCourseDTO, { ...validCourse, image: "https://example.com/course.jpg" }],
    ["training enrollment rejects impossible age", CreateTrainingEnrollmentDTO, { ...validEnrollment, age: 130 }],
    ["consulting service rejects blank title", CreateConsultingServiceDTO, { ...validConsultingService, title: "" }],
    ["consulting lead rejects short phone", CreateConsultingLeadDTO, { ...validConsultingLead, phone: "123" }],
    ["food provider rejects rating above five", CreateFoodProviderDTO, { ...validFoodProvider, rating: 6 }],
    ["food provider rejects bad longitude", CreateFoodProviderDTO, { ...validFoodProvider, longitude: 200 }],
    ["transport route rejects blank origin", CreateTransportRouteDTO, { ...validRoute, fromLocation: "" }],
    ["route segment rejects invalid reliability", CreateRouteSegmentDTO, { ...validSegment, reliability: "CERTAIN" }],
    ["trip package rejects bad slug", CreateTripPackageDTO, { ...validTripPackage, slug: "Bad Slug" }],
  ] as const;

  test.each(invalidCases)("%s", (_name, schema, payload) => {
    expect(schema.safeParse(payload).success).toBe(false);
  });
});
