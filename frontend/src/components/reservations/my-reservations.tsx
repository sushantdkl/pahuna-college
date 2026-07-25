"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cancelReservation, getMyReservations, type Reservation } from "@/lib/api/reservations";

const labels: Record<Reservation["status"], string> = {
  PENDING: "Pending confirmation",
  CONFIRMED: "Confirmed",
  REJECTED: "Not available",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

function nameOf(value: Reservation["hotelId"]) {
  return typeof value === "object" ? value.name : "Stay";
}

function roomOf(value: Reservation["roomTypeId"]) {
  return typeof value === "object" ? value.name : "Room";
}

export function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await getMyReservations();
      setReservations(response.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load reservations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function cancel(id: string) {
    try {
      await cancelReservation(id);
      await load();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel reservation");
    }
  }

  return (
    <section id="reservations" className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Stays</p>
          <h2 className="mt-2 text-2xl font-black text-stone-950">My Reservations</h2>
        </div>
        <Link href="/hotels" className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
          Explore stays
        </Link>
      </div>
      {loading ? <p className="mt-5 text-sm font-semibold text-stone-500">Loading reservations...</p> : null}
      {error ? <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
      {!loading && !reservations.length ? (
        <p className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-sm leading-6 text-stone-600">
          No reservation requests yet. When you request a room from a stay detail page, it will appear here.
        </p>
      ) : null}
      <div className="mt-5 grid gap-3">
        {reservations.map((reservation) => (
          <article key={reservation._id} className="rounded-2xl border border-stone-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-stone-950">{nameOf(reservation.hotelId)}</h3>
                <p className="mt-1 text-sm text-stone-500">{roomOf(reservation.roomTypeId)} · {reservation.numberOfRooms} room(s)</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{labels[reservation.status]}</span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
              <span>{new Date(reservation.checkIn).toLocaleDateString()} to {new Date(reservation.checkOut).toLocaleDateString()}</span>
              <span>{reservation.adults} adult(s), {reservation.children} child(ren)</span>
              <span>NPR {reservation.estimatedTotal.toLocaleString("en-IN")}</span>
            </div>
            {["PENDING", "CONFIRMED"].includes(reservation.status) ? (
              <button onClick={() => cancel(reservation._id)} className="mt-4 rounded-full border border-red-100 px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">
                Cancel request
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
