"use client";

import { useEffect, useState } from "react";
import { getAdminReservations, updateAdminReservation } from "@/lib/api/admin-reservations";
import type { Reservation } from "@/lib/api/reservations";

const statuses = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"];

function hotelName(reservation: Reservation) {
  return typeof reservation.hotelId === "object" ? reservation.hotelId.name : "Stay";
}

function roomName(reservation: Reservation) {
  return typeof reservation.roomTypeId === "object" ? reservation.roomTypeId.name : "Room";
}

export function AdminReservationsPanel() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  async function load() {
    setError("");
    try {
      const response = await getAdminReservations({ page: 1, limit: 10, status, search });
      setReservations(response.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load reservations");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 200);
    return () => window.clearTimeout(timer);
  }, [status, search]);

  async function updateStatus(id: string, nextStatus: string) {
    setSavingId(id);
    setError("");
    try {
      await updateAdminReservation(id, { status: nextStatus });
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update reservation");
    } finally {
      setSavingId("");
    }
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Reservations</h2>
          <p className="text-sm text-stone-500">Room requests submitted from stay detail pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest" className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {!reservations.length ? <p className="mt-4 rounded-xl border border-dashed border-stone-200 p-4 text-sm text-stone-500">No reservation requests yet.</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-stone-500">
              <th className="pb-2 pr-4 font-medium">Guest</th>
              <th className="pb-2 pr-4 font-medium">Stay</th>
              <th className="pb-2 pr-4 font-medium">Dates</th>
              <th className="pb-2 pr-4 font-medium">Rooms</th>
              <th className="pb-2 pr-4 font-medium">Total</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} className="border-b last:border-0">
                <td className="py-3 pr-4">
                  <p className="font-semibold text-stone-900">{reservation.guestName}</p>
                  <p className="text-xs text-stone-500">{reservation.email}</p>
                </td>
                <td className="py-3 pr-4">{hotelName(reservation)}<p className="text-xs text-stone-500">{roomName(reservation)}</p></td>
                <td className="py-3 pr-4">{new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}</td>
                <td className="py-3 pr-4">{reservation.numberOfRooms} / {reservation.adults + reservation.children} guests</td>
                <td className="py-3 pr-4">NPR {reservation.estimatedTotal.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4">
                  <select value={reservation.status} disabled={savingId === reservation._id} onChange={(event) => updateStatus(reservation._id, event.target.value)} className="rounded-lg border border-stone-200 px-2 py-1 text-xs font-semibold">
                    {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
