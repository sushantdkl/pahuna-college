"use client";

import { useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/admin-replica-dashboard";
import { ProfileSettingsPanel } from "@/components/profile-forms";
import { useAuth } from "@/context/AuthContext";

type SettingsTab = "profile" | "security" | "preferences" | "site";

type PreferenceState = {
  density: "comfortable" | "compact";
  landingPage: string;
  notifications: boolean;
};

type SiteSettingsState = {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  facebook: string;
  instagram: string;
};

const tabs: Array<{ key: SettingsTab; label: string }> = [
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "preferences", label: "Preferences" },
  { key: "site", label: "Site Settings" },
];

const preferenceDefaults: PreferenceState = {
  density: "comfortable",
  landingPage: "/dashboard",
  notifications: true,
};

const siteDefaults: SiteSettingsState = {
  siteName: "Pahuna",
  supportEmail: "support@pahuna.local",
  supportPhone: "",
  officeAddress: "Surkhet, Karnali Province, Nepal",
  footerDescription: "Local travel, stays, food, routes, and experiences for Karnali.",
  seoTitle: "Pahuna Travel",
  seoDescription: "Discover Karnali stays, routes, food, experiences, and destination guides.",
  facebook: "",
  instagram: "",
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardSettingsPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [preferences, setPreferences] = useState<PreferenceState>(() => {
    if (typeof window === "undefined") return preferenceDefaults;
    const savedPreferences = window.localStorage.getItem("pahuna-admin-preferences");
    return savedPreferences ? { ...preferenceDefaults, ...JSON.parse(savedPreferences) as Partial<PreferenceState> } : preferenceDefaults;
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettingsState>(() => {
    if (typeof window === "undefined") return siteDefaults;
    const savedSiteSettings = window.localStorage.getItem("pahuna-site-settings");
    return savedSiteSettings ? { ...siteDefaults, ...JSON.parse(savedSiteSettings) as Partial<SiteSettingsState> } : siteDefaults;
  });
  const [notice, setNotice] = useState("");

  const heading = useMemo(() => tabs.find((tab) => tab.key === activeTab)?.label || "Settings", [activeTab]);

  function savePreferences() {
    window.localStorage.setItem("pahuna-admin-preferences", JSON.stringify(preferences));
    setNotice("Preferences saved");
  }

  function saveSiteSettings() {
    window.localStorage.setItem("pahuna-site-settings", JSON.stringify(siteSettings));
    setNotice("Site settings saved");
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-stone-500">Manage administrator profile, password, preferences, and public contact details.</p>
          </div>
          <button onClick={() => logout("/admin/login")} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
            Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setNotice("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {notice ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</div> : null}

        {activeTab === "profile" || activeTab === "security" ? (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-stone-950">{heading}</h2>
            </div>
            <ProfileSettingsPanel compact section={activeTab === "profile" ? "profile" : "security"} />
          </section>
        ) : null}

        {activeTab === "preferences" ? (
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-950">Preferences</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Field label="Table density">
                <select value={preferences.density} onChange={(event) => setPreferences({ ...preferences, density: event.target.value as PreferenceState["density"] })} className={inputClassName}>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </Field>
              <Field label="Default dashboard page">
                <select value={preferences.landingPage} onChange={(event) => setPreferences({ ...preferences, landingPage: event.target.value })} className={inputClassName}>
                  <option value="/dashboard">Overview</option>
                  <option value="/dashboard/users">Users</option>
                  <option value="/dashboard/messages">Messages</option>
                  <option value="/dashboard/partners">Partners</option>
                </select>
              </Field>
              <label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700">
                <input type="checkbox" checked={preferences.notifications} onChange={(event) => setPreferences({ ...preferences, notifications: event.target.checked })} />
                Enable admin notifications
              </label>
            </div>
            <button onClick={savePreferences} className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Save preferences</button>
          </section>
        ) : null}

        {activeTab === "site" ? (
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-950">Site Settings</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.entries(siteSettings).map(([key, value]) => (
                <Field key={key} label={labelFor(key)}>
                  <input value={value} onChange={(event) => setSiteSettings({ ...siteSettings, [key]: event.target.value })} className={inputClassName} />
                </Field>
              ))}
            </div>
            <button onClick={saveSiteSettings} className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Save site settings</button>
          </section>
        ) : null}
      </div>
    </AdminReplicaFrame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function labelFor(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (first) => first.toUpperCase());
}
