"use client";
import * as React from "react";
import { useEffect } from "react";
import { getCandidate } from "@/lib/types/getCandidate";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

export type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export function DiplomaMultiple({ value, onChange }: Props) {
  const [diplomas, setDiplomas] = React.useState<string[]>([]);

  useEffect(() => {
    async function loadDiplomas() {
      try {
        const res = await fetch("/api/getDiplomaCandidate");
        const data = (await res.json()) as getCandidate[];

        if (data.length > 0) {
          const titles = data.map((d) => d.intitule);
          setDiplomas(titles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loadDiplomas();
  }, []);

  return (
    <Combobox items={diplomas} multiple value={value} onValueChange={onChange}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Diplôme" />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
