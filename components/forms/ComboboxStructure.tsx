"use client";
import * as React from "react";

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

import { useEffect } from "react";

export type getCandidate = {
  id: number;
  fullname: string;
};

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export function StructureMultiple({ value, onChange }: Props) {
  const [structure, seStructure] = React.useState<string[]>([]);

  useEffect(() => {
    async function loadStructure() {
      try {
        const res = await fetch("/api/getStructureCandidate");
        const data = (await res.json()) as getCandidate[];

        if (data.length > 0) {
          const titles = data.map((s) => s.fullname);
          seStructure(titles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loadStructure();
  }, []);

  return (
    <Combobox items={structure} multiple value={value} onValueChange={onChange}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Type de structure" />
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
