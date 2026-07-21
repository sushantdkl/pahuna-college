import {
  createAdminTripPackage,
  deleteAdminTripPackage,
  getAdminTripPackages,
  updateAdminTripPackage,
} from "@/lib/api/admin-trip-packages";

export const getAdminTripPackagesAction = getAdminTripPackages;
export const createAdminTripPackageAction = createAdminTripPackage;
export const updateAdminTripPackageAction = updateAdminTripPackage;
export const deleteAdminTripPackageAction = deleteAdminTripPackage;
