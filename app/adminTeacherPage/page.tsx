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
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
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
    <div className="min-h-screen overflow-hidden bg-background">
      {/* TOP BAR */}
      <header className="h-14 w-full border-b-2 bg-white flex items-center justify-between px-4">
        <div className="text-lg font-semibold">CVTheque</div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{user.name}</span>
          <button
            type="button"
            onClick={handlLogout}
            className="underline text-muted-foreground transition-transform hover:scale-110"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)] min-h-0">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r-2 bg-white p-4 overflow-auto">
          <nav className="space-y-2">
            {isAdmin && (
              <>
                <div>
                  <button
                    className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setOpenConfig((v) => !v)}
                    type="button"
                  >
                    Configuration {openConfig ? "▾" : "▸"}
                  </button>

                  {openConfig && (
                    <div className="ml-4">
                      <button
                        className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => setOpenAssoc((v) => !v)}
                        type="button"
                      >
                        Association {openAssoc ? "▾" : "▸"}
                      </button>

                      {openAssoc && (
                        <div className="ml-4">
                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setActive("structure")}
                            type="button"
                          >
                            Domain-Structure
                          </button>

                          <button
                            className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
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
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                  type="button"
                >
                  Recherche
                </button>

                <button
                  onClick={() => setActive("utilisateur")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                  type="button"
                >
                  Utilisateur
                </button>

                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
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
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
                  type="button"
                >
                  Recherche
                </button>

                <button
                  onClick={() => setActive("profile")}
                  className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted"
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
        <main className="flex-1 min-h-0 p-5 overflow-hidden">
          <div className="h-full w-full rounded-2xl border bg-muted/30 p-4 overflow-auto">
            {content}
          </div>
        </main>
      </div>
    </div>
  );
}
