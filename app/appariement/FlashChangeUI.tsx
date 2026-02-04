"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Domain = { id: string; label: string };
type ST = { id: string; label: string };

type FlashChangeUIProps = {
  domainsUrl: string;
  structureTypesUrl: string;
  linkSelectedDomain: (domainId: string) => string;
  linkSave: (activeDomainId: string) => string;
};

export default function FlashChangeUI({
  domainsUrl,
  structureTypesUrl,
  linkSelectedDomain,
  linkSave,
}: FlashChangeUIProps) {
  // 1) данные
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [structureTypes, setStructureTypes] = React.useState<ST[]>([]);

  // 2) какой домен выбрали
  const [activeDomainId, setActiveDomainId] = React.useState<string | null>(
    null,
  );

  // 3) связи этого домена (центр)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // 4) чекбоксы для переноса
  const [checkedCenter, setCheckedCenter] = React.useState<string[]>([]);
  const [checkedRight, setCheckedRight] = React.useState<string[]>([]);

  // ======= FETCH (пока можешь заменить на мок) =======
  React.useEffect(() => {
    function firstLoad(domainsUrl: string, structureTypesUrl: string) {
      // 1) загрузить домены
      fetch(domainsUrl)
        .then((r) => r.json())
        .then(setDomains)
        .catch(() => setDomains([]));

      // 2) загрузить все structure_type
      fetch(structureTypesUrl)
        .then((r) => r.json())
        .then(setStructureTypes)
        .catch(() => setStructureTypes([]));
    }

    firstLoad(domainsUrl, structureTypesUrl);
  }, []);

  async function loadDomain(domainId: string) {
    setActiveDomainId(domainId);
    setCheckedCenter([]);
    setCheckedRight([]);

    // 3) загрузить связи для выбранного домена

    const res = await fetch(linkSelectedDomain(domainId));
    if (!res.ok) {
      // если 400/500 — не трогаем массив, сбрасываем
      setSelectedIds([]);
      console.error("API error", res.status);
      return;
    }

    const data = await res.json();
    setSelectedIds(Array.isArray(data) ? data : []);
  }

  // ======= вычисляем списки =======
  const center = structureTypes.filter((st) => selectedIds.includes(st.id));
  const right = structureTypes.filter((st) => !selectedIds.includes(st.id));

  // ======= перенос =======
  function addToCenter() {
    // переносим выбранные справа -> в центр
    setSelectedIds((prev) => [...new Set([...prev, ...checkedRight])]);
    setCheckedRight([]);
  }

  function removeFromCenter() {
    // переносим выбранные из центра -> вправо (удаляем связь)
    setSelectedIds((prev) => prev.filter((id) => !checkedCenter.includes(id)));
    setCheckedCenter([]);
  }

  // (позже) SAVE в БД — отдельной кнопкой
  async function save() {
    if (!activeDomainId) return;

    await fetch(linkSave(activeDomainId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIds }),
    });
  }

  // helper для чекбокса
  function toggle(
    id: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl p-4 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">Appariement</h1>
            <p className="text-sm text-muted-foreground">
              1) Choisis un domaine, 2) gère les types de structure liés.
            </p>
          </div>

          <Button
            onClick={save}
            disabled={!activeDomainId}
            className="shrink-0"
          >
            Enregistrer
          </Button>
        </div>

        {/* Layout: 1 colonne mobile / 3 colonnes lg */}
        <div className="mt-4 grid gap-4 min-w-0 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
          {/* LEFT */}
          <div className="rounded-xl border min-w-0 overflow-hidden">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold">General domains</p>
              <p className="text-xs text-muted-foreground">
                Double-clic pour charger
              </p>
            </div>

            <ul className="max-h-[320px] overflow-y-auto overflow-x-hidden p-2">
              {domains.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onDoubleClick={() => loadDomain(d.id)}
                    onClick={() => setActiveDomainId(d.id)}
                    className={[
                      "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted",
                      "min-w-0",
                      activeDomainId === d.id ? "bg-muted" : "",
                    ].join(" ")}
                    title="Double-clic pour ouvrir"
                  >
                    <span className="block truncate">{d.label}</span>
                    <span className="text-xs text-muted-foreground">
                      #{d.id}
                    </span>
                  </button>
                </li>
              ))}

              {domains.length === 0 && (
                <li className="p-3 text-sm text-muted-foreground">
                  Aucun domaine
                </li>
              )}
            </ul>
          </div>

          {/* CENTER */}
          <div className="rounded-xl border min-w-0 overflow-hidden">
            <div className="border-b px-4 py-3 flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold">Liés au domaine</p>
                <p className="text-xs text-muted-foreground truncate">
                  {activeDomainId
                    ? `Domaine: ${activeDomainId} `
                    : "Choisis un domaine"}
                </p>
              </div>

              {/* стрелки только на lg */}
              {activeDomainId && (
                <div className="hidden lg:flex gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeFromCenter}
                    disabled={checkedCenter.length === 0}
                    title="Retirer du domaine"
                  >
                    &gt;
                  </Button>
                  <Button
                    type="button"
                    onClick={addToCenter}
                    disabled={checkedRight.length === 0}
                    title="Ajouter au domaine"
                  >
                    &lt;
                  </Button>
                </div>
              )}
            </div>

            <div className="p-3 min-w-0">
              <div className="h-64 overflow-y-auto overflow-x-hidden rounded-lg border p-2 min-w-0">
                {activeDomainId && center.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    Aucun type lié
                  </p>
                )}

                {!activeDomainId && (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    Double-clic sur un domaine à gauche
                  </p>
                )}

                <ul className="space-y-1 min-w-0">
                  {center.map((st) => (
                    <li key={st.id} className="min-w-0">
                      <label className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted min-w-0">
                        <input
                          type="checkbox"
                          checked={checkedCenter.includes(st.id)}
                          onChange={() =>
                            toggle(st.id, checkedCenter, setCheckedCenter)
                          }
                          className="h-4 w-4 shrink-0"
                          disabled={!activeDomainId}
                        />
                        <span className="truncate min-w-0">{st.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* стрелки на мобилке */}
              {activeDomainId && (
                <div className="mt-3 flex gap-2 lg:hidden">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={removeFromCenter}
                    disabled={checkedCenter.length === 0}
                  >
                    Retirer &gt;
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={addToCenter}
                    disabled={checkedRight.length === 0}
                  >
                    &lt; Ajouter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-xl border min-w-0 overflow-hidden">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold">Disponibles</p>
              <p className="text-xs text-muted-foreground">Pas encore liés</p>
            </div>

            <div className="p-3 min-w-0">
              <div className="h-64 overflow-y-auto overflow-x-hidden rounded-lg border p-2 min-w-0">
                <ul className="space-y-1 min-w-0">
                  {right.map((st) => (
                    <li key={st.id} className="min-w-0">
                      <label className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted min-w-0">
                        <input
                          type="checkbox"
                          checked={checkedRight.includes(st.id)}
                          onChange={() =>
                            toggle(st.id, checkedRight, setCheckedRight)
                          }
                          className="h-4 w-4 shrink-0"
                          disabled={!activeDomainId}
                        />
                        <span className="truncate min-w-0">{st.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                {activeDomainId && right.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    Tout est déjà lié
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
