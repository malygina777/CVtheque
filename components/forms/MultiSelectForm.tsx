"use client";

import { MultiSelect } from "@/components/MultiSelect";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { OptionsGet } from "@/lib/types/typeOptions";

type MultiSelectOptions = {
  value: string;
  label: string;
};

export default function MultiSelectForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<MultiSelectOptions[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState<boolean | null>(null);

  useEffect(() => {
    async function getOptions() {
      const res = await fetch("/api/getExpertise");
      if (!res.ok) return;

      const data = (await res.json()) as OptionsGet[];

      const maped: MultiSelectOptions[] = data.map((o) => ({
        value: String(o.id),
        label: o.fullname,
      }));

      if (data.length > 0) {
        setOptions(maped);
      }
    }

    getOptions();
  }, []);

  async function saveOptionsExpertise(e: React.FormEvent) {
    e.preventDefault();

    setStatus(null);
    if (selected.length === 0) return;
    try {
      const payload = {
        expertisesId: selected.map((id) => Number(id)),
      };

      const res = await fetch("/api/saveExpertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSelected([]);
        setResetKey((k) => k + 1);
        setStatus(true);
      } else {
        setStatus(false);
      }
    } catch (e) {
      setStatus(false);
      console.error(e);
    }
  }

  return (
    <form onSubmit={saveOptionsExpertise}>
      <div className="w-full mb-6 px-4 md:px-6 md:p-6">
        <div className="w-full max-w-2xl mx-auto rounded-lg border bg-background p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Expertise d&apos;intervention
          </h3>

          <div
            className="
          w-full max-w-full
          overflow-x-hidden
          [min-width:0]
          [&_*]:min-w-0
          [&_*]:max-w-full
        "
          >
            <div className="[&_*]:flex-wrap">
              <MultiSelect
                key={resetKey}
                options={options}
                onValueChange={setSelected}
                responsive={true}
                variant="secondary"
                value={selected}
              />
              <Button
                type="submit"
                className="w-fit px-10 bg-green-600 hover:bg-green-700 text-white mt-7"
              >
                Enregistrer
              </Button>

              {status !== null && (
                <div className={status ? "text-green-600" : "text-red-600"}>
                  {status
                    ? "Le formulaire a été envoyée avec succès"
                    : "Une erreur est survenue. Le formulaire ne a pas été envoyée"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
