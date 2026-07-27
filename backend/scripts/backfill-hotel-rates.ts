/**
 * Gives every stay a real nightly rate.
 *
 * Five listings were seeded without `priceMin`/`priceMax`, so the mobile app
 * showed "Price on request" and their auto-created room type was priced at
 * zero. This backfills both from the seed rates, keyed by name, and leaves any
 * stay that already has a rate untouched.
 *
 *   npx tsx scripts/backfill-hotel-rates.ts
 */

import mongoose from "mongoose";
import { HotelModel } from "../src/models/hotel.model";
import { RoomTypeModel } from "../src/models/room-type.model";
import { hotelSeedData } from "../src/data/hotel-seed.data";

async function main() {
  const uri = process.env.MONGODB_URL ?? "mongodb://localhost:27017/pahuna_college";
  await mongoose.connect(uri);

  let hotelsUpdated = 0;
  let roomsUpdated = 0;

  for (const seed of hotelSeedData) {
    if (!seed.priceMin) continue;

    const hotel = await HotelModel.findOne({ name: seed.name });
    if (!hotel) continue;

    if (!hotel.priceMin || !hotel.priceMax) {
      hotel.priceMin = seed.priceMin;
      hotel.priceMax = seed.priceMax;
      await hotel.save();
      hotelsUpdated += 1;
    }

    // The default room type was derived from the old zero price.
    const result = await RoomTypeModel.updateMany(
      { hotelId: hotel._id, $or: [{ pricePerNight: 0 }, { pricePerNight: null }] },
      { $set: { pricePerNight: hotel.priceMin } },
    );
    roomsUpdated += result.modifiedCount;
  }

  console.log(`hotels updated: ${hotelsUpdated}, room types repriced: ${roomsUpdated}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
