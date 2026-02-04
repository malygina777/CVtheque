"use client";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ====== TOP BAR ====== */}
      <header className="h-14 w-full  border-b-2  bg-white flex items-center justify-between px-4">
        <div className="text-lg font-semibold">Logo</div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Nom</span>
          <button className="underline text-muted-foreground">
            se déconnecter
          </button>
        </div>
      </header>

      {/* ====== BODY (SIDEBAR + CONTENT) ====== */}
      <div className="flex">
        {/* ====== LEFT SIDEBAR ====== */}
        <aside className="w-64 border-r-2 bg-white p-4">
          <nav className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Configuration
            </div>

            <button className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted">
              Recherche
            </button>

            <button className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted">
              Utilisateur
            </button>

            <button className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted">
              Mon profile
            </button>
          </nav>
        </aside>

        {/* ====== MAIN CONTENT ====== */}
        <main className="flex-1 p-6">
          {/* внешний контейнер, как рамка */}
          <div className="h-[calc(100vh-56px-48px)] border-2 rounded-2xl bg-white p-4">
            {/* внутренняя область, как большой прямоугольник */}
            <div className="h-full rounded-2xl border bg-muted/30"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
