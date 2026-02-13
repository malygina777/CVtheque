"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import CivilityForm from "@/components/forms/CivilityForm";
import DiplomaForm from "@/components/forms/DiplomaForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import MultiSelectForm from "@/components/forms/MultiSelectForm";
import UploadingDocuments from "@/components/forms/UploadingDocuments";
import FlashChangeCardActivity from "@/components/appariement/FlashChangeCardDomainActivity";
import FlashChangeCardStructure from "@/components/appariement/FlashChangeCardDomainStructure";
import { ChangeRole } from "@/components/ChangeRole";
import { CandidateSearch } from "@/components/forms/CandidateSearch";

type Role = {
  role: string | null;
  name: string;
};

type ActiveMain =
  | "configuration"
  | "recherche"
  | "utilisateur"
  | "profile"
  | "structure"
  | "activity";

export default function AdminPage() {
  const [user, setUser] = useState<Role | null>(null);
  const [active, setActive] = useState<ActiveMain>("profile");
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const [openAssoc, setOpenAssoc] = useState<boolean>(false);
  const router = useRouter();

  const views = {
    configuration: <div>⚙️ Configuration</div>,
    recherche: (
      <div>
        <CandidateSearch />
      </div>
    ),
    utilisateur: (
      <div>
        <ChangeRole />
      </div>
    ),
    profile: (
      <div>
        <CivilityForm />
        <DiplomaForm />
        <ExperienceForm />
        <MultiSelectForm />
        <UploadingDocuments />
      </div>
    ),
    structure: (
      <div>
        <FlashChangeCardStructure />
      </div>
    ),
    activity: (
      <div>
        <FlashChangeCardActivity />
      </div>
    ),
  };

  async function handlLogout() {
    await authClient.signOut();
    router.push("/connexion");
    router.refresh();
  }

  useEffect(() => {
    async function loadRole() {
      const res = await fetch("/api/getRole");

      if (res.status === 401) {
        return;
      }

      const data = await res.json();

      setUser(data);
    }

    loadRole();
  }, []);

  return (
    <div className="min-screen overflow-hidden bg-background">
      {/* TOP BAR */}
      <header className="h-14 w-full border-b-2 bg-white flex items-center justify-between px-4">
        <div className="text-lg font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="180"
            viewBox="0 0 720 220"
            role="img"
            aria-label="CVTheque logo ribbon"
          >
            <defs>
              <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#111827" />
                <stop offset="0.5" stopColor="#64748B" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            <g transform="translate(52,44)">
              <path
                d={`M38 108
      C38 60, 78 28, 118 36
      C156 44, 170 86, 144 108
      C120 128, 82 120, 86 92
      C90 64, 128 64, 132 84`}
                fill="none"
                stroke="url(#g4)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d={`M132 84
      C148 92, 162 92, 174 82
      C168 102, 152 118, 132 122`}
                fill="none"
                stroke="#111827"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
            </g>

            <g transform="translate(360, 110)">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
                fontSize={56}
                fontWeight={800}
                fill="#111827"
              >
                CV
                <tspan fontWeight={600} fill="#374151">
                  Theque
                </tspan>
              </text>
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{user?.name}</span>
          <button
            type="button"
            onClick={handlLogout}
            className="underline text-muted-foreground transition-transform hover:scale-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
              />
              <path
                fillRule="evenodd"
                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex min-h-0">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r-2 bg-white p-4">
          <nav className="space-y-2">
            {/* admin */}
            {user?.role === "admin" && (
              <>
                <div>
                  <button
                    // onClick={() => setActive("configuration")}
                    className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setOpenConfig((openConfig) => !openConfig)}
                  >
                    Configuration {openConfig ? "▾" : "▸"}
                  </button>
                  {openConfig && (
                    <div className="ml-4">
                      <button
                        className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => setOpenAssoc((openAssoc) => !openAssoc)}
                      >
                        Association {openAssoc ? "▾" : "▸"}
                      </button>
                      {openAssoc && (
                        <div className="ml-4">
                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setActive("structure")}
                          >
                            Domain-Structure
                          </button>

                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setActive("activity")}
                          >
                            Domain-Activité
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActive("recherche")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Recherche
                </button>
                <button
                  onClick={() => setActive("utilisateur")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Utilisateur
                </button>
                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Mon profile
                </button>
              </>
            )}

            {/* teacher: Recherche + Mon profile */}
            {user?.role === "teacher" && (
              <>
                <button
                  onClick={() => setActive("recherche")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Recherche
                </button>
                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Mon profile
                </button>
              </>
            )}

            {user?.role === null && (
              <div className="text-sm text-muted-foreground">Chargement...</div>
            )}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1  p-5 overflow-hidden">
          <div className=" w-full rounded-2xl border bg-muted/30 p-4 overflow-auto">
            {views[active]}
          </div>
        </main>
      </div>
    </div>
  );
}
