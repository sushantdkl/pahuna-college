import {
  createTripPackageInquiry,
  getTripPackage,
  getTripPackages,
} from "@/lib/api/trip-packages";

export const getTripPackagesAction = getTripPackages;
export const getTripPackageAction = getTripPackage;
export const createTripPackageInquiryAction = createTripPackageInquiry;
