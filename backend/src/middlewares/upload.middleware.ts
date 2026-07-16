import fs from "fs";
import path from "path";
import multer from "multer";
import { Request } from "express";

const profileUploadDirectory = path.join(process.cwd(), "uploads", "profiles");
const hotelUploadDirectory = path.join(process.cwd(), "uploads", "hotels");

fs.mkdirSync(profileUploadDirectory, { recursive: true });
fs.mkdirSync(hotelUploadDirectory, { recursive: true });

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
