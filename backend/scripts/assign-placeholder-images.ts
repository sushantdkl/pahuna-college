import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { MONGODB_URL } from "../src/configs/constant";

type ImageField = "images" | "image" | "coverImage";
type ManifestEntry = {
  collection: string;
  id: string;
  slug: string;
  name: string;
  imageField: ImageField;
  currentImage: string;
  imageStatus: "VALID" | "PLACEHOLDER" | "MISSING" | "BROKEN";
  validImage: boolean;
  placeholder: boolean;
  broken: boolean;
  eligibleForReplacement: boolean;
  reason: string;
};

type FixedAssignment = {
  collection: string;
  id: string;
  imageField: ImageField;
  images: string[];
  source: string;
  license: string;
  auditReason: string;
  auditCutoff: string;
};

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const FRONTEND_PUBLIC = path.join(PROJECT_ROOT, "frontend", "public");
const BACKEND_ROOT = path.join(PROJECT_ROOT, "backend");
const AUDIT_PATH = path.join(BACKEND_ROOT, "scripts", "placeholder-image-audit.json");
const VERIFY_PATH = path.join(BACKEND_ROOT, "scripts", "placeholder-image-verify.json");

const PLACEHOLDER_IMAGES = new Set([
  "/images/placeholders/hero-placeholder.svg",
  "/images/placeholders/destination-placeholder.svg",
  "/images/placeholders/food-placeholder.svg",
  "/images/placeholders/route-placeholder.svg",
  "/images/placeholders/service-placeholder.svg",
  "/images/placeholders/stay-placeholder.svg",
  "/images/food/bar-lounge-placeholder.svg",
  "/images/food/cafe-placeholder.svg",
  "/images/food/event-restaurant-placeholder.svg",
  "/images/food/momo-placeholder.svg",
  "/images/food/restaurant-placeholder.svg",
  "/images/food/tea-placeholder.svg",
]);

const COLLECTIONS: Array<{
  collection: string;
  nameField: string;
  slugField: string;
  imageField: ImageField;
}> = [
  { collection: "hotels", nameField: "name", slugField: "slug", imageField: "images" },
  { collection: "foodproviders", nameField: "name", slugField: "slug", imageField: "images" },
  { collection: "destinations", nameField: "name", slugField: "slug", imageField: "images" },
  { collection: "experiences", nameField: "name", slugField: "slug", imageField: "images" },
  { collection: "itineraries", nameField: "title", slugField: "slug", imageField: "image" },
  { collection: "trippackages", nameField: "title", slugField: "slug", imageField: "images" },
  { collection: "transportroutes", nameField: "name", slugField: "slug", imageField: "image" },
  { collection: "trainingcourses", nameField: "title", slugField: "slug", imageField: "image" },
  { collection: "consultingservices", nameField: "title", slugField: "slug", imageField: "image" },
  { collection: "blogposts", nameField: "title", slugField: "slug", imageField: "coverImage" },
];

// Current audit found no eligible live records. Keep this fixed list explicit so assignment never rewrites valid images.
const FIXED_IMAGE_ASSIGNMENTS: FixedAssignment[] = [];

function primaryImage(record: Record<string, unknown>, imageField: ImageField) {
  const value = record[imageField];
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : "";
  return typeof value === "string" ? value : "";
}

function localImageExists(image: string) {
  if (!image.startsWith("/")) return true;

  const resolved = image.startsWith("/uploads/")
    ? path.join(BACKEND_ROOT, image)
    : path.join(FRONTEND_PUBLIC, image);

  return fs.existsSync(resolved);
}

function imageStatus(image: string): ManifestEntry["imageStatus"] {
  const trimmed = image.trim();

  if (!trimmed) return "MISSING";
  if (PLACEHOLDER_IMAGES.has(trimmed)) return "PLACEHOLDER";
  if (!localImageExists(trimmed)) return "BROKEN";
  return "VALID";
}

async function buildManifest() {
  const db = mongoose.connection.db;
  const entries: ManifestEntry[] = [];

  for (const spec of COLLECTIONS) {
    const exists = await db.listCollections({ name: spec.collection }).toArray();
    if (!exists.length) continue;

    const records = await db.collection(spec.collection).find({}).sort({ createdAt: -1 }).toArray();

    for (const record of records) {
      const currentImage = primaryImage(record, spec.imageField);
      const status = imageStatus(currentImage);
      const placeholder = status === "PLACEHOLDER";
      const broken = status === "BROKEN";
      const eligible = status === "MISSING" || placeholder || broken;
      const name =
        String(record[spec.nameField] || record.name || record.title || "Untitled");

      entries.push({
        collection: spec.collection,
        id: String(record._id),
        slug: String(record[spec.slugField] || ""),
        name,
        imageField: spec.imageField,
        currentImage,
        imageStatus: status,
        validImage: status === "VALID",
        placeholder,
        broken,
        eligibleForReplacement: eligible,
        reason: eligible
          ? `${status.toLowerCase()} image requires explicit approved assignment`
          : "Existing valid image preserved",
      });
    }
  }

  return entries;
}

async function runAudit() {
  const manifest = await buildManifest();
  fs.writeFileSync(AUDIT_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  const eligible = manifest.filter((entry) => entry.eligibleForReplacement);

  console.log(`Audit complete: ${manifest.length} records inspected`);
  console.log(`Eligible for replacement: ${eligible.length}`);
  console.log(`Manifest: ${AUDIT_PATH}`);
}

async function runAssign(dryRun: boolean) {
  const manifest = await buildManifest();
  const manifestById = new Map(manifest.map((entry) => [`${entry.collection}:${entry.id}`, entry]));
  let updated = 0;
  let skipped = 0;

  for (const assignment of FIXED_IMAGE_ASSIGNMENTS) {
    const key = `${assignment.collection}:${assignment.id}`;
    const audit = manifestById.get(key);

    if (!audit?.eligibleForReplacement) {
      skipped += 1;
      console.log(`SKIPPED ${key}: current image is not eligible`);
      continue;
    }

    if (new Date(String((await mongoose.connection.db.collection(assignment.collection).findOne({ _id: new mongoose.Types.ObjectId(assignment.id) }))?.createdAt || 0)) > new Date(assignment.auditCutoff)) {
      skipped += 1;
      console.log(`SKIPPED ${key}: created after audit cutoff`);
      continue;
    }

    const update =
      assignment.imageField === "images"
        ? { $set: { images: assignment.images } }
        : { $set: { [assignment.imageField]: assignment.images[0] } };

    if (dryRun) {
      console.log(`DRY RUN ${key}: would assign ${assignment.images.join(", ")}`);
    } else {
      await mongoose.connection.db
        .collection(assignment.collection)
        .updateOne({ _id: new mongoose.Types.ObjectId(assignment.id) }, update);
      console.log(`UPDATED ${key}: ${assignment.images.join(", ")}`);
    }

    updated += 1;
  }

  console.log(`${dryRun ? "Dry run" : "Assignment"} complete: ${updated} planned, ${skipped} skipped`);
}

async function runVerify() {
  const manifest = await buildManifest();
  const result = {
    inspected: manifest.length,
    valid: manifest.filter((entry) => entry.validImage).length,
    unresolved: manifest.filter((entry) => entry.eligibleForReplacement),
  };

  fs.writeFileSync(VERIFY_PATH, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Verify complete: ${result.valid}/${result.inspected} records have valid images`);
  console.log(`Unresolved eligible records: ${result.unresolved.length}`);
  console.log(`Report: ${VERIFY_PATH}`);
}

async function main() {
  const args = new Set(process.argv.slice(2));

  await mongoose.connect(MONGODB_URL);

  try {
    if (args.has("--verify")) {
      await runVerify();
    } else if (args.has("--assign")) {
      await runAssign(args.has("--dry-run"));
    } else {
      await runAudit();
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
