import { BlogPostModel } from "../models/blog-post.model";
import { ConsultingLeadModel } from "../models/consulting-lead.model";
import { ConsultingServiceModel } from "../models/consulting-service.model";
import { ContactMessageModel } from "../models/contact-message.model";
import { DestinationModel } from "../models/destination.model";
import { ExperienceModel } from "../models/experience.model";
import { FoodProviderModel } from "../models/food-provider.model";
import { HotelModel } from "../models/hotel.model";
import { InquiryModel } from "../models/inquiry.model";
import { ItineraryModel } from "../models/itinerary.model";
import { PartnerApplicationModel } from "../models/partner-application.model";
import { ReservationModel } from "../models/reservation.model";
import { TrainingCourseModel } from "../models/training-course.model";
import { TrainingEnrollmentModel } from "../models/training-enrollment.model";
import { TransportRouteModel } from "../models/transport-route.model";
import { TripPackageModel } from "../models/trip-package.model";
import { UserModel } from "../models/user.model";

export type DashboardRange = "today" | "7d" | "30d" | "90d";
type TrendMetric =
  | "users"
  | "inquiries"
  | "reservations"
  | "messages"
  | "partners"
  | "training"
  | "consulting";

const rangeDays: Record<DashboardRange, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const trendModels: Record<TrendMetric, any> = {
  users: UserModel,
  inquiries: InquiryModel,
  reservations: ReservationModel,
  messages: ContactMessageModel,
  partners: PartnerApplicationModel,
  training: TrainingEnrollmentModel,
  consulting: ConsultingLeadModel,
};

function startOfRange(range: DashboardRange) {
  const now = new Date();
  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  const start = new Date(now);
  start.setDate(start.getDate() - rangeDays[range] + 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function previousRange(start: Date, range: DashboardRange) {
  const previousEnd = new Date(start);
  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - rangeDays[range]);
  return { previousStart, previousEnd };
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function comparisonText(current: number, previous: number, rangeLabel: string) {
  const change = percentChange(current, previous);
  if (change === null) return `${current} new this period`;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}% vs previous ${rangeLabel}`;
}

function dateMatch(from: Date, to: Date) {
  return { createdAt: { $gte: from, $lte: to } };
}

async function countInRange(model: any, from: Date, to: Date, filter = {}) {
  return model.countDocuments({ ...filter, ...dateMatch(from, to) });
}

async function statusCounts(model: any, statuses: string[], filter = {}) {
  const rows = await model.aggregate([
    { $match: filter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const map = new Map(rows.map((row: any) => [row._id, row.count]));
  return statuses.map((status) => ({
    status,
    count: map.get(status) || 0,
  }));
}

async function trendSeries(metric: TrendMetric, from: Date, to: Date, range: DashboardRange) {
  const format = range === "today" ? "%Y-%m-%d %H:00" : range === "90d" ? "%Y-W%U" : "%Y-%m-%d";
  const rows = await trendModels[metric].aggregate([
    { $match: dateMatch(from, to) },
    {
      $group: {
        _id: { $dateToString: { format, date: "$createdAt" } },
        value: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((row: any) => ({ label: row._id, value: row.value }));
}

function safeString(value: unknown, fallback = "Untitled") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export class AdminDashboardService {
  async getOverview(params: { range: DashboardRange }) {
    const range = params.range;
    const now = new Date();
    const from = startOfRange(range);
    const { previousStart, previousEnd } = previousRange(from, range);
    const rangeLabel = range === "today" ? "day" : `${rangeDays[range]} days`;

    const [
      totalUsers,
      usersCurrent,
      usersPrevious,
      inquiriesCurrent,
      inquiriesPrevious,
      pendingReservations,
      reservationsCurrent,
      reservationsPrevious,
      pendingPartners,
      unreadMessages,
      messagesCurrent,
      messagesPrevious,
      trainingCurrent,
      trainingPrevious,
      consultingCurrent,
      consultingPrevious,
      activeListingsBreakdown,
    ] = await Promise.all([
      UserModel.countDocuments(),
      countInRange(UserModel, from, now),
      countInRange(UserModel, previousStart, previousEnd),
      countInRange(InquiryModel, from, now),
      countInRange(InquiryModel, previousStart, previousEnd),
      ReservationModel.countDocuments({ status: "PENDING" }),
      countInRange(ReservationModel, from, now),
      countInRange(ReservationModel, previousStart, previousEnd),
      PartnerApplicationModel.countDocuments({ status: { $in: ["PENDING", "UNDER_REVIEW"] } }),
      ContactMessageModel.countDocuments({ status: "NEW" }),
      countInRange(ContactMessageModel, from, now),
      countInRange(ContactMessageModel, previousStart, previousEnd),
      countInRange(TrainingEnrollmentModel, from, now),
      countInRange(TrainingEnrollmentModel, previousStart, previousEnd),
      countInRange(ConsultingLeadModel, from, now),
      countInRange(ConsultingLeadModel, previousStart, previousEnd),
      this.getActiveListingsBreakdown(),
    ]);

    const activeListings = activeListingsBreakdown.reduce((sum, item) => sum + item.count, 0);

    const [
      trends,
      pipelines,
      reservationSummary,
      attention,
      recentSubmissions,
      recentActivity,
      recentlyPublished,
      health,
    ] = await Promise.all([
      Promise.all((Object.keys(trendModels) as TrendMetric[]).map(async (metric) => ({
        metric,
        points: await trendSeries(metric, from, now, range),
      }))),
      this.getPipelines(),
      this.getReservationSummary(from, now),
      this.getAttentionItems(),
      this.getRecentSubmissions(),
      this.getRecentActivity(),
      this.getRecentlyPublished(),
      this.getHealth(activeListings),
    ]);

    return {
      range,
      dateFrom: from,
      dateTo: now,
      cards: [
        { id: "users", label: "Total Users", value: totalUsers, comparison: comparisonText(usersCurrent, usersPrevious, rangeLabel), href: "/dashboard/users", icon: "users" },
        { id: "activeListings", label: "Active Listings", value: activeListings, comparison: `${activeListings} public records available`, href: "/dashboard/content", icon: "listings", breakdown: activeListingsBreakdown },
        { id: "inquiries", label: "New Inquiries", value: inquiriesCurrent, comparison: comparisonText(inquiriesCurrent, inquiriesPrevious, rangeLabel), href: "/dashboard/inquiries", icon: "inquiries" },
        { id: "reservations", label: "Pending Reservations", value: pendingReservations, comparison: comparisonText(reservationsCurrent, reservationsPrevious, rangeLabel), href: "/dashboard/reservations", icon: "reservations" },
        { id: "partners", label: "Pending Partner Applications", value: pendingPartners, comparison: `${pendingPartners} awaiting decision`, href: "/dashboard/partners", icon: "partners" },
        { id: "messages", label: "Unread Messages", value: unreadMessages, comparison: comparisonText(messagesCurrent, messagesPrevious, rangeLabel), href: "/dashboard/messages", icon: "messages" },
        { id: "training", label: "Training Enrollments", value: trainingCurrent, comparison: comparisonText(trainingCurrent, trainingPrevious, rangeLabel), href: "/dashboard/training", icon: "training" },
        { id: "consulting", label: "Consulting Leads", value: consultingCurrent, comparison: comparisonText(consultingCurrent, consultingPrevious, rangeLabel), href: "/dashboard/consulting", icon: "consulting" },
      ],
      trends,
      contentDistribution: activeListingsBreakdown,
      pipelines,
      reservationSummary,
      attention,
      recentSubmissions,
      recentActivity,
      recentlyPublished,
      quickActions: [
        { label: "Add Stay", href: "/dashboard/hotels?action=create" },
        { label: "Add Food Provider", href: "/dashboard/food?action=create" },
        { label: "Add Destination", href: "/dashboard/content?action=create" },
        { label: "Add Package", href: "/dashboard/packages?action=create" },
        { label: "Add Training Course", href: "/dashboard/training?action=create-course" },
        { label: "Create Blog Post", href: "/dashboard/blog?action=create" },
        { label: "Review Inquiries", href: "/dashboard/inquiries?status=NEW" },
        { label: "Review Partner Applications", href: "/dashboard/partners?status=PENDING" },
      ],
      health,
    };
  }

  private async getActiveListingsBreakdown() {
    const rows = await Promise.all([
      HotelModel.countDocuments({ isActive: true }),
      FoodProviderModel.countDocuments({ active: true }),
      DestinationModel.countDocuments({ isActive: true }),
      ExperienceModel.countDocuments({ isActive: true }),
      ItineraryModel.countDocuments({ isPublic: true, status: { $ne: "DRAFT" } }),
      TripPackageModel.countDocuments({ isActive: true }),
      TransportRouteModel.countDocuments({ isActive: true }),
      TrainingCourseModel.countDocuments({ isActive: true, status: "PUBLISHED" }),
      ConsultingServiceModel.countDocuments({ isActive: true }),
      BlogPostModel.countDocuments({ status: "PUBLISHED" }),
    ]);
    const labels = [
      ["Stays", "/dashboard/hotels"],
      ["Food", "/dashboard/food"],
      ["Destinations", "/dashboard/content"],
      ["Experiences", "/dashboard/experiences"],
      ["Itineraries", "/dashboard/trip-planner"],
      ["Packages", "/dashboard/packages"],
      ["Routes", "/dashboard/routes"],
      ["Training", "/dashboard/training"],
      ["Consulting", "/dashboard/consulting"],
      ["Blog", "/dashboard/blog"],
    ];
    return labels.map(([label, href], index) => ({ label, count: rows[index], href }));
  }

  private async getPipelines() {
    const [inquiries, consulting, partners, training] = await Promise.all([
      statusCounts(InquiryModel, ["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"]),
      statusCounts(ConsultingLeadModel, ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"]),
      statusCounts(PartnerApplicationModel, ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"]),
      statusCounts(TrainingEnrollmentModel, ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
    ]);
    return [
      { id: "inquiries", label: "Inquiries", href: "/dashboard/inquiries", statuses: inquiries },
      { id: "consulting", label: "Consulting Leads", href: "/dashboard/consulting", statuses: consulting },
      { id: "partners", label: "Partner Applications", href: "/dashboard/partners", statuses: partners },
      { id: "training", label: "Training Enrollments", href: "/dashboard/training", statuses: training },
    ];
  }

  private async getReservationSummary(from: Date, to: Date) {
    const [statuses, valueRows, nextReservation] = await Promise.all([
      statusCounts(ReservationModel, ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"]),
      ReservationModel.aggregate([
        { $match: dateMatch(from, to) },
        { $group: { _id: null, total: { $sum: "$estimatedTotal" }, rooms: { $sum: "$numberOfRooms" }, count: { $sum: 1 } } },
      ]),
      ReservationModel.findOne({ checkIn: { $gte: new Date() }, status: { $in: ["PENDING", "CONFIRMED"] } })
        .sort({ checkIn: 1 })
        .select("guestName checkIn status")
        .lean(),
    ]);
    const values = valueRows[0] || { total: 0, rooms: 0, count: 0 };
    return {
      statuses,
      total: values.count,
      estimatedValue: values.total,
      roomsReserved: values.rooms,
      nextCheckIn: nextReservation
        ? { guestName: nextReservation.guestName, checkIn: nextReservation.checkIn, status: nextReservation.status }
        : null,
      href: "/dashboard/reservations",
    };
  }

  private async getAttentionItems() {
    const [inquiries, messages, partners, reservations, training, consulting, hotelsUnverified, foodPending, missingHotelImages, missingFoodImages, missingHotelCoords, missingFoodCoords, draftPosts] = await Promise.all([
      InquiryModel.countDocuments({ status: "NEW" }),
      ContactMessageModel.countDocuments({ status: "NEW" }),
      PartnerApplicationModel.countDocuments({ status: { $in: ["PENDING", "UNDER_REVIEW"] } }),
      ReservationModel.countDocuments({ status: "PENDING" }),
      TrainingEnrollmentModel.countDocuments({ status: "PENDING" }),
      ConsultingLeadModel.countDocuments({ status: "NEW" }),
      HotelModel.countDocuments({ isActive: true, isVerified: false }),
      FoodProviderModel.countDocuments({ active: true, verificationStatus: "PENDING" }),
      HotelModel.countDocuments({ isActive: true, images: { $size: 0 } }),
      FoodProviderModel.countDocuments({ active: true, images: { $size: 0 } }),
      HotelModel.countDocuments({ isActive: true, $or: [{ latitude: { $exists: false } }, { longitude: { $exists: false } }] }),
      FoodProviderModel.countDocuments({ active: true, $or: [{ latitude: { $exists: false } }, { longitude: { $exists: false } }] }),
      BlogPostModel.countDocuments({ status: "DRAFT" }),
    ]);
    return [
      { label: "New inquiries awaiting response", count: inquiries, href: "/dashboard/inquiries?status=NEW" },
      { label: "Unread contact messages", count: messages, href: "/dashboard/messages?status=NEW" },
      { label: "Partner applications need review", count: partners, href: "/dashboard/partners?status=PENDING" },
      { label: "Pending reservations", count: reservations, href: "/dashboard/reservations?status=PENDING" },
      { label: "Training enrollments awaiting review", count: training, href: "/dashboard/training?tab=enrollments&status=PENDING" },
      { label: "Consulting leads not contacted", count: consulting, href: "/dashboard/consulting?tab=leads&status=NEW" },
      { label: "Listings awaiting verification", count: hotelsUnverified + foodPending, href: "/dashboard/locations?verification=pending" },
      { label: "Public listings missing images", count: missingHotelImages + missingFoodImages, href: "/dashboard/locations?health=images" },
      { label: "Public listings missing coordinates", count: missingHotelCoords + missingFoodCoords, href: "/dashboard/locations?health=coordinates" },
      { label: "Draft blog posts awaiting publication", count: draftPosts, href: "/dashboard/blog?status=DRAFT" },
    ].filter((item) => item.count > 0);
  }

  private async getRecentSubmissions() {
    const [inquiries, messages, partners, training, consulting] = await Promise.all([
      InquiryModel.find().sort({ createdAt: -1 }).limit(8).select("title inquiryType status createdAt").lean(),
      ContactMessageModel.find().sort({ createdAt: -1 }).limit(8).select("name subject status createdAt").lean(),
      PartnerApplicationModel.find().sort({ createdAt: -1 }).limit(8).select("businessName partnerType status createdAt").lean(),
      TrainingEnrollmentModel.find().sort({ createdAt: -1 }).limit(8).populate("courseId", "title").select("name fullName courseId status createdAt").lean(),
      ConsultingLeadModel.find().sort({ createdAt: -1 }).limit(8).select("businessName name serviceType status createdAt").lean(),
    ]);
    return {
      inquiries: inquiries.map((item: any) => ({ id: String(item._id), name: safeString(item.title), type: item.inquiryType, status: item.status, createdAt: item.createdAt, href: "/dashboard/inquiries" })),
      messages: messages.map((item: any) => ({ id: String(item._id), name: safeString(item.name), type: safeString(item.subject), status: item.status, createdAt: item.createdAt, href: "/dashboard/messages" })),
      partners: partners.map((item: any) => ({ id: String(item._id), name: safeString(item.businessName), type: item.partnerType, status: item.status, createdAt: item.createdAt, href: "/dashboard/partners" })),
      training: training.map((item: any) => ({ id: String(item._id), name: safeString(item.fullName || item.name), type: safeString(item.courseId?.title, "Training course"), status: item.status, createdAt: item.createdAt, href: "/dashboard/training" })),
      consulting: consulting.map((item: any) => ({ id: String(item._id), name: safeString(item.businessName || item.name), type: safeString(item.serviceType, "Consulting"), status: item.status, createdAt: item.createdAt, href: "/dashboard/consulting" })),
    };
  }

  private async getRecentActivity() {
    const [users, inquiries, partners, reservations, training, consulting, hotels, destinations, posts] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).limit(5).select("fullName createdAt").lean(),
      InquiryModel.find().sort({ createdAt: -1 }).limit(5).select("title createdAt").lean(),
      PartnerApplicationModel.find().sort({ createdAt: -1 }).limit(5).select("businessName createdAt").lean(),
      ReservationModel.find().sort({ createdAt: -1 }).limit(5).select("guestName createdAt").lean(),
      TrainingEnrollmentModel.find().sort({ createdAt: -1 }).limit(5).select("name fullName createdAt").lean(),
      ConsultingLeadModel.find().sort({ createdAt: -1 }).limit(5).select("businessName name createdAt").lean(),
      HotelModel.find().sort({ createdAt: -1 }).limit(5).select("name createdAt").lean(),
      DestinationModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select("name createdAt").lean(),
      BlogPostModel.find({ status: "PUBLISHED" }).sort({ publishedAt: -1, createdAt: -1 }).limit(5).select("title publishedAt createdAt").lean(),
    ]);
    return [
      ...users.map((item: any) => ({ type: "User", text: `${safeString(item.fullName)} registered an account`, createdAt: item.createdAt, href: "/dashboard/users" })),
      ...inquiries.map((item: any) => ({ type: "Inquiry", text: `New inquiry submitted: ${safeString(item.title)}`, createdAt: item.createdAt, href: "/dashboard/inquiries" })),
      ...partners.map((item: any) => ({ type: "Partner", text: `${safeString(item.businessName)} submitted a partner application`, createdAt: item.createdAt, href: "/dashboard/partners" })),
      ...reservations.map((item: any) => ({ type: "Reservation", text: `${safeString(item.guestName)} requested a reservation`, createdAt: item.createdAt, href: "/dashboard/reservations" })),
      ...training.map((item: any) => ({ type: "Training", text: `${safeString(item.fullName || item.name)} submitted a training enrollment`, createdAt: item.createdAt, href: "/dashboard/training" })),
      ...consulting.map((item: any) => ({ type: "Consulting", text: `${safeString(item.businessName || item.name)} submitted a consulting lead`, createdAt: item.createdAt, href: "/dashboard/consulting" })),
      ...hotels.map((item: any) => ({ type: "Stay", text: `${safeString(item.name)} was added to stays`, createdAt: item.createdAt, href: "/dashboard/hotels" })),
      ...destinations.map((item: any) => ({ type: "Destination", text: `${safeString(item.name)} was published`, createdAt: item.createdAt, href: "/dashboard/content" })),
      ...posts.map((item: any) => ({ type: "Blog", text: `${safeString(item.title)} was published`, createdAt: item.publishedAt || item.createdAt, href: "/dashboard/blog" })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);
  }

  private async getRecentlyPublished() {
    const [destinations, packages, training, consulting, posts] = await Promise.all([
      DestinationModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(4).select("name images createdAt").lean(),
      TripPackageModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(4).select("title images createdAt").lean(),
      TrainingCourseModel.find({ isActive: true, status: "PUBLISHED" }).sort({ createdAt: -1 }).limit(4).select("title image createdAt").lean(),
      ConsultingServiceModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(4).select("title image createdAt").lean(),
      BlogPostModel.find({ status: "PUBLISHED" }).sort({ publishedAt: -1, createdAt: -1 }).limit(4).select("title coverImage publishedAt createdAt").lean(),
    ]);
    return [
      ...destinations.map((item: any) => ({ title: item.name, type: "Destination", image: item.images?.[0], createdAt: item.createdAt, href: "/dashboard/content" })),
      ...packages.map((item: any) => ({ title: item.title, type: "Package", image: item.images?.[0], createdAt: item.createdAt, href: "/dashboard/packages" })),
      ...training.map((item: any) => ({ title: item.title, type: "Training", image: item.image, createdAt: item.createdAt, href: "/dashboard/training" })),
      ...consulting.map((item: any) => ({ title: item.title, type: "Consulting", image: item.image, createdAt: item.createdAt, href: "/dashboard/consulting" })),
      ...posts.map((item: any) => ({ title: item.title, type: "Blog", image: item.coverImage, createdAt: item.publishedAt || item.createdAt, href: "/dashboard/blog" })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }

  private async getHealth(activeListings: number) {
    const [missingImages, missingCoordinates, pendingVerification, pendingConsent, draftPosts] = await Promise.all([
      Promise.all([
        HotelModel.countDocuments({ isActive: true, images: { $size: 0 } }),
        FoodProviderModel.countDocuments({ active: true, images: { $size: 0 } }),
      ]).then(([a, b]) => a + b),
      Promise.all([
        HotelModel.countDocuments({ isActive: true, $or: [{ latitude: { $exists: false } }, { longitude: { $exists: false } }] }),
        FoodProviderModel.countDocuments({ active: true, $or: [{ latitude: { $exists: false } }, { longitude: { $exists: false } }] }),
      ]).then(([a, b]) => a + b),
      Promise.all([
        HotelModel.countDocuments({ isActive: true, isVerified: false }),
        FoodProviderModel.countDocuments({ active: true, verificationStatus: "PENDING" }),
      ]).then(([a, b]) => a + b),
      FoodProviderModel.countDocuments({ active: true, consentStatus: "PENDING" }),
      BlogPostModel.countDocuments({ status: "DRAFT" }),
    ]);
    return [
      { label: "Database connection", status: "Healthy", detail: "Dashboard data loaded from MongoDB" },
      { label: "Active public listings", status: activeListings > 0 ? "Healthy" : "Needs Attention", detail: `${activeListings} active records` },
      { label: "Listings missing images", status: missingImages ? "Needs Attention" : "Healthy", detail: `${missingImages} records` },
      { label: "Records missing coordinates", status: missingCoordinates ? "Needs Attention" : "Healthy", detail: `${missingCoordinates} records` },
      { label: "Pending verification", status: pendingVerification ? "Needs Attention" : "Healthy", detail: `${pendingVerification} records` },
      { label: "Pending consent", status: pendingConsent ? "Needs Attention" : "Healthy", detail: `${pendingConsent} records` },
      { label: "Draft posts", status: draftPosts ? "Needs Attention" : "Healthy", detail: `${draftPosts} drafts` },
    ];
  }
}
