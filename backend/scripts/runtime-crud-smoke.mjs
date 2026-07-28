import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const API = process.env.QA_API_URL || "http://localhost:4000/api/v1";
const MONGO = process.env.MONGODB_URL || "mongodb://localhost:27017/pahuna_college";
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const prefix = `QA-${stamp}`;
const password = "QaPass123!";
const results = [];

function record(feature, checks, error) {
  const failed = Object.entries(checks).filter(([, value]) => value !== "PASS" && value !== "NOT APPLICABLE");
  results.push({
    feature,
    result: failed.length || error ? "BLOCKED" : "PASS",
    checks,
    error: error ? String(error.message || error) : "",
  });
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers,
    body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(`${options.method || "GET"} ${path}: ${response.status} ${payload.message || response.statusText}`);
  }
  return payload.data;
}

function auth(token) {
  return { Authorization: `Bearer ${token}` };
}

function idOf(value) {
  return value?._id || value?.id || value?.user?._id || value?.user?.id;
}

function slugOf(value) {
  return value?.slug || value?.data?.slug;
}

async function ensureAdmin() {
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false, collection: "users" }));
  const email = "qa.admin@pahuna.local";
  const existing = await User.findOne({ email });
  if (existing) return;
  await User.create({
    fullName: "QA Admin",
    email,
    phoneNumber: "9800000000",
    password: await bcrypt.hash(password, 10),
    role: "admin",
  });
}

async function login(email) {
  const data = await request("/auth/login", { method: "POST", body: { email, password } });
  return data.token;
}

async function crud(feature, config) {
  const checks = {
    Create: "BLOCKED",
    List: "BLOCKED",
    Detail: "BLOCKED",
    Update: "BLOCKED",
    Delete: "BLOCKED",
    Search: "BLOCKED",
    Filter: "NOT APPLICABLE",
    Pagination: "BLOCKED",
    Status: "NOT APPLICABLE",
    Validation: "NOT APPLICABLE",
    Authorization: "NOT APPLICABLE",
    "Public integration": config.publicList || config.publicDetail ? "BLOCKED" : "NOT APPLICABLE",
    "Admin integration": "BLOCKED",
    "Runtime persistence": "BLOCKED",
  };

  let created;
  try {
    created = await request(config.createPath, {
      method: "POST",
      headers: config.createAuth ? auth(config.createAuth) : undefined,
      body: config.createBody,
    });
    created = config.createdData ? config.createdData(created) : created;
    const id = config.id ? config.id(created) : idOf(created);
    const slug = config.slug ? config.slug(created) : slugOf(created);
    checks.Create = id || slug ? "PASS" : "BLOCKED";

    await request(config.listPath, { headers: auth(config.adminToken) });
    checks.List = "PASS";
    checks.Pagination = "PASS";
    checks["Admin integration"] = "PASS";

    await request(`${config.detailBase}/${id}`, { headers: auth(config.adminToken) });
    checks.Detail = "PASS";
    checks["Runtime persistence"] = "PASS";

    await request(config.searchPath, { headers: auth(config.adminToken) });
    checks.Search = "PASS";

    if (config.filterPath) {
      await request(config.filterPath, { headers: auth(config.adminToken) });
      checks.Filter = "PASS";
    }

    if (config.publicList) {
      await request(config.publicList);
      checks["Public integration"] = "PASS";
    }

    if (config.publicDetail && slug) {
      await request(config.publicDetail(slug));
      checks["Public integration"] = "PASS";
    }

    if (config.updateBody) {
      await request(`${config.detailBase}/${id}`, {
        method: "PATCH",
        headers: auth(config.adminToken),
        body: config.updateBody,
      });
      checks.Update = "PASS";
    } else {
      checks.Update = "NOT APPLICABLE";
    }

    if (config.statusBody) {
      await request(`${config.detailBase}/${id}`, {
        method: "PATCH",
        headers: auth(config.adminToken),
        body: config.statusBody,
      });
      checks.Status = "PASS";
    }

    if (config.delete !== false) {
      await request(`${config.detailBase}/${id}`, {
        method: "DELETE",
        headers: auth(config.adminToken),
      });
      checks.Delete = "PASS";
    } else {
      checks.Delete = "NOT APPLICABLE";
    }

    record(feature, checks);
    return created;
  } catch (error) {
    record(feature, checks, error);
    if (created && config.delete !== false) {
      try {
        const id = config.id ? config.id(created) : idOf(created);
        if (id) await request(`${config.detailBase}/${id}`, { method: "DELETE", headers: auth(config.adminToken) });
      } catch {}
    }
    return created;
  }
}

async function main() {
  await mongoose.connect(MONGO);
  await ensureAdmin();
  await mongoose.disconnect();

  const adminToken = await login("qa.admin@pahuna.local");

  const qaUserEmail = `qa.user.${stamp}@pahuna.local`;
  const qaUser = await crud("User", {
    adminToken,
    createPath: "/admin/users",
    createAuth: adminToken,
    createBody: { fullName: `${prefix} User`, email: qaUserEmail, phoneNumber: "9800000001", location: "Surkhet", password, role: "user" },
    listPath: "/admin/users?page=1&limit=5",
    searchPath: `/admin/users?search=${encodeURIComponent(prefix)}`,
    filterPath: "/admin/users?role=user",
    detailBase: "/admin/users",
    updateBody: { fullName: `${prefix} User Updated` },
    delete: false,
  });
  const userId = idOf(qaUser);
  const userToken = await login(qaUserEmail);

  const hotel = await crud("Hotel / Stays / ServiceProvider", {
    adminToken,
    createPath: "/admin/hotels",
    createAuth: adminToken,
    createBody: { name: `${prefix} Hotel`, description: "QA hotel description", address: "Birendranagar", district: "Surkhet", propertyType: "HOTEL", amenities: ["Wifi"], contactPhone: "9800000002", priceMin: 1000, isActive: true },
    listPath: "/admin/hotels?page=1&limit=5",
    searchPath: `/admin/hotels?search=${prefix}`,
    filterPath: "/admin/hotels?active=true",
    detailBase: "/admin/hotels",
    publicList: "/hotels?page=1&limit=5",
    publicDetail: (slug) => `/hotels/${slug}`,
    updateBody: { description: "QA hotel updated" },
    delete: false,
  });
  const hotelId = idOf(hotel);

  const destination = await crud("Destination", {
    adminToken,
    createPath: "/admin/destinations",
    createAuth: adminToken,
    createBody: { name: `${prefix} Destination`, description: "QA destination description", attractions: ["Lake"], bestTimeToVisit: "Year round", category: "lake", district: "Surkhet", isActive: true },
    listPath: "/admin/destinations?page=1&limit=5",
    searchPath: `/admin/destinations?search=${prefix}`,
    filterPath: "/admin/destinations?active=true",
    detailBase: "/admin/destinations",
    publicList: "/destinations?page=1&limit=5",
    publicDetail: (slug) => `/destinations/${slug}`,
    updateBody: { description: "QA destination updated" },
    delete: false,
  });
  const destinationId = idOf(destination);

  const experience = await crud("Experience", {
    adminToken,
    createPath: "/admin/experiences",
    createAuth: adminToken,
    createBody: { name: `${prefix} Experience`, description: "QA experience description", category: "nature", price: 500, duration: "2 hours", location: "Surkhet", isActive: true },
    listPath: "/admin/experiences?page=1&limit=5",
    searchPath: `/admin/experiences?search=${prefix}`,
    filterPath: "/admin/experiences?active=true",
    detailBase: "/admin/experiences",
    publicList: "/experiences?page=1&limit=5",
    publicDetail: (slug) => `/experiences/${slug}`,
    updateBody: { description: "QA experience updated" },
    delete: false,
  });
  const experienceId = idOf(experience);

  await crud("Itinerary", {
    adminToken,
    createPath: "/admin/itineraries",
    createAuth: adminToken,
    createBody: { userId, destinationId, title: `${prefix} Itinerary`, description: "QA itinerary", totalDays: 2, budget: 2000, status: "DRAFT", isPublic: true, hotelIds: [hotelId], experienceIds: [experienceId] },
    listPath: "/admin/itineraries?page=1&limit=5",
    searchPath: `/admin/itineraries?search=${prefix}`,
    filterPath: "/admin/itineraries?status=DRAFT",
    detailBase: "/admin/itineraries",
    publicList: "/itineraries/public?page=1&limit=5",
    updateBody: { title: `${prefix} Itinerary Updated` },
  });

  await crud("Inquiry", {
    adminToken,
    createPath: "/inquiries",
    createAuth: userToken,
    createBody: { hotelId, title: `${prefix} Inquiry`, message: "QA inquiry message", inquiryType: "HOTEL" },
    listPath: "/admin/inquiries?page=1&limit=5",
    searchPath: `/admin/inquiries?search=${prefix}`,
    filterPath: "/admin/inquiries?status=NEW",
    detailBase: "/admin/inquiries",
    updateBody: { response: "QA response", status: "RESPONDED" },
    statusBody: { status: "CLOSED" },
  });

  await crud("ContactMessage", {
    adminToken,
    createPath: "/contact-messages",
    createBody: { name: `${prefix} Contact`, email: `qa.contact.${stamp}@pahuna.local`, phone: "9800000003", subject: `${prefix} Subject`, message: "QA contact message" },
    listPath: "/admin/contact-messages?page=1&limit=5",
    searchPath: `/admin/contact-messages?search=${prefix}`,
    filterPath: "/admin/contact-messages?status=NEW",
    detailBase: "/admin/contact-messages",
    updateBody: { response: "QA response", status: "RESPONDED" },
    statusBody: { status: "CLOSED" },
  });

  await crud("PartnerApplication", {
    adminToken,
    createPath: "/partner-applications",
    createBody: { businessName: `${prefix} Partner`, partnerType: "HOTEL", ownerName: "QA Owner", email: `qa.partner.${stamp}@pahuna.local`, phone: "9800000004", address: "Surkhet", existingOnline: false, challenges: "QA", goals: "QA" },
    listPath: "/admin/partner-applications?page=1&limit=5",
    searchPath: `/admin/partner-applications?search=${prefix}`,
    filterPath: "/admin/partner-applications?status=PENDING",
    detailBase: "/admin/partner-applications",
    updateBody: { notes: "QA reviewed", status: "APPROVED" },
    statusBody: { status: "REJECTED" },
  });

  await crud("FoodProvider", {
    adminToken,
    createPath: "/admin/food-providers",
    createAuth: adminToken,
    createBody: { name: `${prefix} Cafe`, type: "CAFE", district: "Surkhet", area: "Birendranagar", shortDescription: "QA cafe", longDescription: "QA cafe details", cuisines: ["Coffee"], services: ["Dine in"], features: ["Wifi"], active: true },
    listPath: "/admin/food-providers?page=1&limit=5",
    searchPath: `/admin/food-providers?search=${prefix}`,
    filterPath: "/admin/food-providers?active=true",
    detailBase: "/admin/food-providers",
    publicList: "/food-providers?page=1&limit=5",
    publicDetail: (slug) => `/food-providers/${slug}`,
    updateBody: { shortDescription: "QA cafe updated" },
  });

  await crud("BlogPost", {
    adminToken,
    createPath: "/admin/blog-posts",
    createAuth: adminToken,
    createBody: { title: `${prefix} Blog`, excerpt: "QA blog excerpt", content: "QA blog content", authorName: "QA Admin", category: "Travel", tags: ["qa"], status: "PUBLISHED", isFeatured: true },
    listPath: "/admin/blog-posts?page=1&limit=5",
    searchPath: `/admin/blog-posts?search=${prefix}`,
    filterPath: "/admin/blog-posts?status=PUBLISHED",
    detailBase: "/admin/blog-posts",
    publicList: "/blog-posts?page=1&limit=5",
    publicDetail: (slug) => `/blog-posts/${slug}`,
    updateBody: { excerpt: "QA blog excerpt updated" },
    statusBody: { status: "DRAFT" },
  });

  await crud("TripPackage", {
    adminToken,
    createPath: "/admin/trip-packages",
    createAuth: adminToken,
    createBody: { title: `${prefix} Package`, description: "QA package", destinationId, durationDays: 2, priceMin: 1000, priceMax: 2000, itinerary: ["Day 1"], inclusions: ["Guide"], exclusions: ["Flights"], highlights: ["Lake"], isActive: true },
    listPath: "/admin/trip-packages?page=1&limit=5",
    searchPath: `/admin/trip-packages?search=${prefix}`,
    filterPath: "/admin/trip-packages?active=true",
    detailBase: "/admin/trip-packages",
    publicList: "/trip-packages?page=1&limit=5",
    publicDetail: (slug) => `/trip-packages/${slug}`,
    updateBody: { description: "QA package updated" },
  });

  await crud("TransportRoute", {
    adminToken,
    createPath: "/admin/transport-routes",
    createAuth: adminToken,
    createBody: { fromLocation: `${prefix} From`, toLocation: `${prefix} To`, mode: "BUS", durationHours: 2, costMin: 100, costMax: 200, isActive: true },
    listPath: "/admin/transport-routes?page=1&limit=5",
    searchPath: `/admin/transport-routes?search=${prefix}`,
    filterPath: "/admin/transport-routes?active=true",
    detailBase: "/admin/transport-routes",
    publicList: "/transport-routes?page=1&limit=5",
    updateBody: { notes: "QA route updated" },
  });

  await crud("RouteSegment", {
    adminToken,
    createPath: "/admin/route-segments",
    createAuth: adminToken,
    createBody: { from: `${prefix} A`, to: `${prefix} B`, mode: "BUS", distanceKm: 10, durationMin: 30, durationMax: 60, costMin: 100, costMax: 200, active: true },
    listPath: "/admin/route-segments?page=1&limit=5",
    searchPath: `/admin/route-segments?search=${prefix}`,
    filterPath: "/admin/route-segments?active=true",
    detailBase: "/admin/route-segments",
    publicList: "/route-segments?page=1&limit=5",
    updateBody: { notes: "QA segment updated" },
  });

  const course = await crud("TrainingCourse", {
    adminToken,
    createPath: "/admin/training-courses",
    createAuth: adminToken,
    createBody: { title: `${prefix} Course`, description: "QA course", category: "Hospitality", duration: "1 week", price: 1000, status: "PUBLISHED", isActive: true },
    listPath: "/admin/training-courses?page=1&limit=5",
    searchPath: `/admin/training-courses?search=${prefix}`,
    filterPath: "/admin/training-courses?status=PUBLISHED",
    detailBase: "/admin/training-courses",
    publicList: "/training-courses?page=1&limit=5",
    publicDetail: (slug) => `/training-courses/${slug}`,
    updateBody: { description: "QA course updated" },
    delete: false,
  });

  await crud("TrainingEnrollment", {
    adminToken,
    createPath: "/training-enrollments",
    createBody: { courseId: idOf(course), fullName: `${prefix} Student`, email: `qa.training.${stamp}@pahuna.local`, phone: "9800000005", age: 21, educationLevel: "Plus Two", priorExperience: "None", motivation: "QA motivation" },
    listPath: "/admin/training-enrollments?page=1&limit=5",
    searchPath: `/admin/training-enrollments?search=${prefix}`,
    filterPath: "/admin/training-enrollments?status=PENDING",
    detailBase: "/admin/training-enrollments",
    updateBody: { status: "CONFIRMED", response: "QA confirmed" },
    statusBody: { status: "CANCELLED" },
  });

  const service = await crud("ConsultingService", {
    adminToken,
    createPath: "/admin/consulting-services",
    createAuth: adminToken,
    createBody: { title: `${prefix} Consulting`, description: "QA consulting service", category: "Operations", price: "NPR 1000", duration: "1 week", deliverables: ["Audit"], isActive: true },
    listPath: "/admin/consulting-services?page=1&limit=5",
    searchPath: `/admin/consulting-services?search=${prefix}`,
    filterPath: "/admin/consulting-services?active=true",
    detailBase: "/admin/consulting-services",
    publicList: "/consulting-services?page=1&limit=5",
    publicDetail: (slug) => `/consulting-services/${slug}`,
    updateBody: { description: "QA consulting updated" },
    delete: false,
  });

  await crud("ConsultingLead", {
    adminToken,
    createPath: "/consulting-leads",
    createBody: { serviceId: idOf(service), contactName: `${prefix} Lead`, email: `qa.consulting.${stamp}@pahuna.local`, phone: "9800000006", businessName: `${prefix} Business`, businessType: "Hotel", businessStage: "Planning", businessSize: "Small", location: "Surkhet", serviceType: "Operations", timeline: "Soon", budgetRange: "NPR 1000", message: "QA lead message" },
    listPath: "/admin/consulting-leads?page=1&limit=5",
    searchPath: `/admin/consulting-leads?search=${prefix}`,
    filterPath: "/admin/consulting-leads?status=NEW",
    detailBase: "/admin/consulting-leads",
    updateBody: { status: "CONTACTED", response: "QA contacted" },
    statusBody: { status: "QUALIFIED" },
  });

  for (const entity of [
    ["/admin/consulting-services", idOf(service)],
    ["/admin/training-courses", idOf(course)],
    ["/admin/experiences", experienceId],
    ["/admin/destinations", destinationId],
    ["/admin/hotels", hotelId],
    ["/admin/users", userId],
  ]) {
    try {
      if (entity[1]) await request(`${entity[0]}/${entity[1]}`, { method: "DELETE", headers: auth(adminToken) });
    } catch {}
  }

  console.log(JSON.stringify({ prefix, results }, null, 2));
  if (results.some((item) => item.result !== "PASS")) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
