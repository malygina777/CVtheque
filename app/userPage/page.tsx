"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import CivilityForm from "@/components/forms/CivilityForm";
import DiplomaForm from "@/components/forms/DiplomaForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import MultiSelectForm from "@/components/forms/MultiSelectForm";
import UploadingDocuments from "@/components/forms/UploadingDocuments";

type Role = {
  role: string | null;
  name: string;
};

type ActiveMain = "profile";

export default function UserPage() {
  const [user, setUser] = useState<Role | null>(null);

  const [active, setActive] = useState<ActiveMain>("profile");
  const router = useRouter();
  const views = {
    profile: (
      <div>
        <CivilityForm />
        <DiplomaForm />
        <ExperienceForm />
        <MultiSelectForm />
        <UploadingDocuments />
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
    <div className="min-h-screen bg-[#ffe0ae]">
      {/* TOP BAR */}
      <header  className="h-14 w-full bg-[#e0843f] border-b border-[#eadfce] shadow-sm flex items-center justify-between px-4">
        <img src="/logo.png" alt="CVTHEQUE LOGO" className="h-30 w-40 pt-2 "/>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-black">{user?.name}</span>
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
            {/* user: только Mon profile */}
            {user?.role === "user" && (
              <button
                onClick={() => setActive("profile")}
                 className="w-full text-left rounded-md px-3 py-2 text-sm transition-all duration-150

hover:bg-amber-600
hover:scale-[1.02]
hover:text-white
cursor-pointer"
              >
                Mon profile
              </button>
            )}

            {/* пока роль не загрузилась */}
            {user?.role === null && (
              <div className="text-sm text-muted-foreground">Chargement...</div>
            )}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-hidden bg-[#ffe5bb]">
           <div className="w-full rounded-2xl border-1 border-[#eadfce] bg-[#fffdf8] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12),0_0_60px_rgba(15,23,42,0.18)] overflow-auto">
            {views[active]}
          </div>
        </main>
      </div>
    </div>
  );
}
