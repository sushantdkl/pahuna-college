"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  createReservation,
  getRoomTypes,
  type RoomType,
} from "@/lib/api/reservations";

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  return Math.max(Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000), 0);
}

export function ReservationRequestCard({
  hotelId,
  hotelName,
  hotelSlug,
}: {
  hotelId: string;
  hotelName: string;
  hotelSlug: string;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGuestName((current) => current || user?.fullName || "");
      setEmail((current) => current || user?.email || "");
      setPhone((current) => current || user?.phoneNumber || "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setLoadingRooms(true);
    }, 0);
    getRoomTypes(hotelId)
      .then((response) => {
        if (cancelled) return;
        const data = response.data || [];
        setRooms(data);
        setRoomTypeId((current) => current || data[0]?._id || "");
      })
      .catch(() => setRooms([]))
      .finally(() => {
        if (!cancelled) setLoadingRooms(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [hotelId]);

  const selectedRoom = rooms.find((room) => room._id === roomTypeId);
  const nights = nightsBetween(checkIn, checkOut);
  const estimate = useMemo(
    () => (selectedRoom ? selectedRoom.pricePerNight * numberOfRooms * nights : 0),
    [nights, numberOfRooms, selectedRoom],
  );

  async function submitReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/hotels/${hotelSlug}#reservation`)}`);
      return;
    }

    if (!roomTypeId || !checkIn || !checkOut || !guestName.trim() || !email.trim() || !phone.trim()) {
      setNotice("Please complete the required reservation fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        hotelId,
        roomTypeId,
        checkIn,
        checkOut,
        numberOfRooms,
        adults,
        children,
        guestName,
        email,
        phone,
        specialRequests,
      });
      setNotice("Your reservation request has been submitted. The stay provider or Pahuna team will confirm availability.");
      toast.success("Reservation request submitted");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to submit reservation request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="reservation" onSubmit={submitReservation} className="space-y-4 rounded-2xl border bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Request Reservation</h3>
          <p className="text-xs leading-5 text-muted-foreground">Submit dates and guest details. Confirmation happens after availability review.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomType">Room Type *</Label>
        <select id="roomType" value={roomTypeId} onChange={(event) => setRoomTypeId(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" disabled={loadingRooms}>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name} - NPR {room.pricePerNight.toLocaleString("en-IN")}/night
            </option>
          ))}
        </select>
        {!loadingRooms && !rooms.length ? <p className="text-xs text-muted-foreground">Room inventory will be confirmed by inquiry.</p> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Check-in *" id="checkIn"><Input id="checkIn" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></Field>
        <Field label="Check-out *" id="checkOut"><Input id="checkOut" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></Field>
        <Field label="Rooms *" id="rooms"><Input id="rooms" type="number" min={1} value={numberOfRooms} onChange={(e) => setNumberOfRooms(Number(e.target.value) || 1)} /></Field>
        <Field label="Adults *" id="adults"><Input id="adults" type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value) || 1)} /></Field>
        <Field label="Children" id="children"><Input id="children" type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value) || 0)} /></Field>
      </div>

      <div className="grid gap-3">
        <Field label="Full Name *" id="guestName"><Input id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} /></Field>
        <Field label="Email *" id="reservationEmail"><Input id="reservationEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Phone *" id="reservationPhone"><Input id="reservationPhone" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="Special Requests" id="specialRequests"><Textarea id="specialRequests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} /></Field>
      </div>

      <div className="rounded-xl bg-muted/50 p-4 text-sm">
        <div className="font-medium">{hotelName}</div>
        <div className="mt-1 text-muted-foreground">{selectedRoom?.name || "Select a room"} · {nights || 0} night(s)</div>
        <div className="mt-2 text-lg font-bold text-primary">Estimated total: NPR {estimate.toLocaleString("en-IN")}</div>
      </div>

      {notice ? <p className="rounded-xl bg-primary/5 p-3 text-sm font-medium text-primary">{notice}</p> : null}
      <Button type="submit" className="w-full" disabled={submitting || loadingRooms || !rooms.length}>
        {submitting ? "Submitting..." : "Request Reservation"}
      </Button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
