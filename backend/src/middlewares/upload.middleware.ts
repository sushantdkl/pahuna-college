import fs from "fs";
import path from "path";
import multer from "multer";
import { Request } from "express";

const profileUploadDirectory = path.join(process.cwd(), "uploads", "profiles");
const hotelUploadDirectory = path.join(process.cwd(), "uploads", "hotels");
const destinationUploadDirectory = path.join(process.cwd(), "uploads", "destinations");
const experienceUploadDirectory = path.join(process.cwd(), "uploads", "experiences");
const blogUploadDirectory = path.join(process.cwd(), "uploads", "blog");
const packageUploadDirectory = path.join(process.cwd(), "uploads", "packages");
const foodUploadDirectory = path.join(process.cwd(), "uploads", "food");
const trainingUploadDirectory = path.join(process.cwd(), "uploads", "training");
const consultingUploadDirectory = path.join(process.cwd(), "uploads", "consulting");

fs.mkdirSync(profileUploadDirectory, { recursive: true });
fs.mkdirSync(hotelUploadDirectory, { recursive: true });
fs.mkdirSync(destinationUploadDirectory, { recursive: true });
fs.mkdirSync(experienceUploadDirectory, { recursive: true });
fs.mkdirSync(blogUploadDirectory, { recursive: true });
fs.mkdirSync(packageUploadDirectory, { recursive: true });
fs.mkdirSync(foodUploadDirectory, { recursive: true });
fs.mkdirSync(trainingUploadDirectory, { recursive: true });
fs.mkdirSync(consultingUploadDirectory, { recursive: true });

function createImageStorage(uploadDirectory: string) {
  return multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

      callback(null, safeName);
    },
  });
}

const profileStorage = createImageStorage(profileUploadDirectory);
const hotelStorage = createImageStorage(hotelUploadDirectory);
const destinationStorage = createImageStorage(destinationUploadDirectory);
const experienceStorage = createImageStorage(experienceUploadDirectory);
const blogStorage = createImageStorage(blogUploadDirectory);
const packageStorage = createImageStorage(packageUploadDirectory);
const foodStorage = createImageStorage(foodUploadDirectory);
const trainingStorage = createImageStorage(trainingUploadDirectory);
const consultingStorage = createImageStorage(consultingUploadDirectory);

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    callback(new Error("Only JPG, PNG, or WEBP images are allowed"));
    return;
  }

  callback(null, true);
};

export const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadHotelImages = multer({
  storage: hotelStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export const uploadDestinationImages = multer({
  storage: destinationStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export const uploadExperienceImages = multer({
  storage: experienceStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export const uploadBlogCoverImage = multer({
  storage: blogStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadTripPackageImages = multer({
  storage: packageStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
});

export const uploadFoodProviderImages = multer({
  storage: foodStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export const uploadTrainingCourseImage = multer({
  storage: trainingStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadConsultingServiceImage = multer({
  storage: consultingStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
