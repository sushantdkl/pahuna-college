"use client";

import { useEffect, useRef, useState } from "react";

type LocationStatus = "idle" | "requesting" | "allowed" | "denied" | "unsupported" | "error" | "stopped";

type UserCoordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

const locationOptions: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
};

export function LiveLocationCard() {
  const watchIdRef = useRef<number | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [location, setLocation] = useState<UserCoordinates | null>(null);
  const [message, setMessage] = useState("Location is optional and only starts after you allow it.");
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  function updateFromPosition(position: GeolocationPosition) {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    });
    setIsTracking(true);
    setStatus("allowed");
    setMessage("Live location is active on this profile page.");
  }

  function handleLocationError(error: GeolocationPositionError) {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);

    if (error.code === error.PERMISSION_DENIED) {
      setStatus("denied");
      setMessage("Location permission was denied. You can enable it from browser settings.");
      return;
    }

    setStatus("error");
    setMessage(error.message || "Unable to read your current location.");
  }

  function allowLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setMessage("Location is not supported in this browser.");
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setStatus("requesting");
    setIsTracking(false);
    setMessage("Waiting for browser permission...");
    navigator.geolocation.getCurrentPosition(updateFromPosition, handleLocationError, locationOptions);
    watchIdRef.current = navigator.geolocation.watchPosition(updateFromPosition, handleLocationError, locationOptions);
  }

  function stopSharing() {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLocation(null);
    setIsTracking(false);
    setStatus("stopped");
    setMessage("Location sharing is stopped. No live tracking is active.");
  }

  const mapsLink = location ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}` : "";

  return (
    <section className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
      <div className="grid gap-0 xl:grid-cols-[1fr_320px]">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Live Location</p>
              <h2 className="mt-2 text-2xl font-black text-stone-950">Your Current Location</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                Allow location to personalize nearby stays, route planning, and travel suggestions. Pahuna does not start tracking until you click Allow Location.
              </p>
            </div>
            <StatusPill status={status} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={allowLocation}
              disabled={status === "requesting"}
              className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "requesting" ? "Requesting..." : "Allow Location"}
            </button>
            <button
              type="button"
              onClick={stopSharing}
              disabled={!isTracking && status !== "allowed"}
              className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Stop Sharing
            </button>
            {location ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
              >
                Open in Google Maps
              </a>
            ) : null}
          </div>

          <p className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${status === "denied" || status === "error" || status === "unsupported" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {message}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <LocationMetric label="Latitude" value={location ? location.latitude.toFixed(6) : "Not shared"} />
            <LocationMetric label="Longitude" value={location ? location.longitude.toFixed(6) : "Not shared"} />
            <LocationMetric label="Accuracy" value={location ? `${Math.round(location.accuracy)} meters` : "Not available"} />
          </div>
          <div className="mt-3">
            <LocationMetric label="Last updated" value={location ? new Date(location.timestamp).toLocaleString() : "Waiting for permission"} />
          </div>
        </div>

        <div className="border-t border-emerald-900/10 bg-[#f8f3e8] p-6 xl:border-l xl:border-t-0">
          <div className="relative flex min-h-64 overflow-hidden rounded-[24px] border border-emerald-900/10 bg-white">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative m-auto max-w-xs p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                <LocationIcon />
              </div>
              <h3 className="mt-4 text-lg font-black text-stone-950">{location ? "Location preview active" : "Map preview"}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {location ? "Use Google Maps to inspect the exact browser-provided point." : "Allow location to show coordinates and a Google Maps link."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: LocationStatus }) {
  const label: Record<LocationStatus, string> = {
    idle: "Optional",
    requesting: "Requesting",
    allowed: "Sharing",
    denied: "Denied",
    unsupported: "Unsupported",
    error: "Error",
    stopped: "Stopped",
  };

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-800">
      {label[status]}
    </span>
  );
}

function LocationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-[#fffaf0] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 break-words text-sm font-black text-stone-950">{value}</p>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}
