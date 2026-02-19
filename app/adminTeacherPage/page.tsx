"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import CivilityForm from "@/components/forms/CivilityForm";
import DiplomaForm from "@/components/forms/DiplomaForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import MultiSelectForm from "@/components/forms/MultiSelectForm";
import UploadingDocuments from "@/components/forms/UploadingDocuments";
import FlashChangeCardActivity from "@/components/appariement/FlashChangeCardDomainActivity";
import FlashChangeCardStructure from "@/components/appariement/FlashChangeCardDomainStructure";
import { ChangeRole } from "@/components/ChangeRole";
import { CandidateSearch } from "@/components/forms/CandidateSearch";

type RoleValue = "admin" | "teacher" | "user" | null;

type RoleResponse = {
  role: RoleValue;
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
  const router = useRouter();

  const [user, setUser] = useState<RoleResponse | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  const [active, setActive] = useState<ActiveMain>("profile");
  const [openConfig, setOpenConfig] = useState(false);
  const [openAssoc, setOpenAssoc] = useState(false);

  async function handlLogout() {
    await authClient.signOut();
    router.push("/connexion");
    router.refresh();
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadRole() {
      setLoadingRole(true);
      setRoleError(null);

      try {
        const res = await fetch("/api/getRole", { signal: controller.signal });

        // если не залогинена
        if (res.status === 401) {
          if (!cancelled) {
            setUser(null);
            setLoadingRole(false);
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`getRole failed: ${res.status}`);
        }

        const data = (await res.json()) as RoleResponse;

        if (!cancelled) {
          setUser(data);
          setLoadingRole(false);
        }
      } catch (e: any) {
        if (cancelled) return;
        setRoleError(e?.message ?? "Erreur inconnue");
        setLoadingRole(false);
      }
    }

    loadRole();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const content = useMemo(() => {
    switch (active) {
      case "configuration":
        return <div>⚙️ Configuration</div>;
      case "recherche":
        return <CandidateSearch />;
      case "utilisateur":
        return <ChangeRole />;
      case "profile":
        return (
          <>
            <CivilityForm />
            <DiplomaForm />
            <ExperienceForm />
            <MultiSelectForm />
            <UploadingDocuments />
          </>
        );
      case "structure":
        return <FlashChangeCardStructure />;
      case "activity":
        return <FlashChangeCardActivity />;
      default:
        return null;
    }
  }, [active]);

  // Пока роль грузится — показываем понятный экран, а не “пустоту”
  if (loadingRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Chargement du rôle...
      </div>
    );
  }

  // Если роль не загрузилась из-за ошибки
  if (roleError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 p-6">
        <div className="text-sm text-red-600">Erreur: {roleError}</div>
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-blue"
          onClick={() => router.refresh()}
          type="button"
        >
          Recharger
        </button>
      </div>
    );
  }

  // Если не залогинена — можно мягко редиректнуть
  if (!user) {
    router.push("/connexion");
    return null;
  }

  const isAdmin = user.role === "admin";
  const isTeacher = user.role === "teacher";

  return (
     <div className="min-h-screen ">
      {/* TOP BAR */}
      <header  className="h-14 w-full bg-[#e0843f] border-b border-[#eadfce] shadow-sm flex items-center justify-between px-4">
        
         <img src="/logo.png" alt="CVTHEQUE LOGO" className="h-30 w-40 pt-2 "/>
       

        <div className="flex items-center gap-4 text-sm">
          <span className="text-black">{user.name}</span>
          <button
            type="button"
            onClick={handlLogout}
            className="underline text-muted-foreground transition-transform  hover:scale-150
  hover:shadow-[0_0_40px_15px_rgba(215,172,103,0.25),0_0_40px_15px_rgba(220,38,38,0.7)]"
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  fillRule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                />
                <path
                  fill-rule="evenodd"
                  fillRule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                />
              </svg>
            </div>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside  className="w-64 bg-[#e0843f] border-r border-[#eadfce] p-4">
          <nav className="space-y-2">
            {isAdmin && (
              <>
                <div>
                  <button
                    className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                    onClick={() => setOpenConfig((v) => !v)}
                    type="button"
                  >
                    Configuration {openConfig ? "▾" : "▸"}
                  </button>

                  {openConfig && (
                    <div className="ml-4">
                      <button
                        className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                        onClick={() => setOpenAssoc((v) => !v)}
                        type="button"
                      >
                        Association {openAssoc ? "▾" : "▸"}
                      </button>

                      {openAssoc && (
                        <div className="ml-4">
                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                            onClick={() => setActive("structure")}
                            type="button"
                          >
                            Domain-Structure
                          </button>

                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                            onClick={() => setActive("activity")}
                            type="button"
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
                  className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                  type="button"
                >
                  Recherche
                </button>

                <button
                  onClick={() => setActive("utilisateur")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                  type="button"
                >
                  Utilisateur
                </button>

                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                  type="button"
                >
                  Mon profil
                </button>
              </>
            )}

            {isTeacher && (
              <>
                <button
                  onClick={() => setActive("recherche")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                  type="button"
                >
                  Recherche
                </button>

                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
                  type="button"
                >
                  Mon profil
                </button>
              </>
            )}

            {!isAdmin && !isTeacher && (
              <div className="text-sm text-muted-foreground">
                Rôle non autorisé: {String(user.role)}
              </div>
            )}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-hidden bg-[#ffe5bb]">
           <div className="w-full rounded-2xl border-1 border-[#eadfce] bg-[#fffdf8] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12),0_0_60px_rgba(15,23,42,0.18)] overflow-auto">
                {content}
           </div>
        </main>


      </div>
    </div>
  );
}
