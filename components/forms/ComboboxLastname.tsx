"use client";
import * as React from "react";
import { useEffect } from "react";

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

type getCandidate = {
  id: number;
  lastname: string;
};

export type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export function LastNameMultiple({ value, onChange }: Props) {
  const [lastName, setLastName] = React.useState<string[]>([]);

  useEffect(() => {
    async function loadLastNames() {
      try {
        const res = await fetch("/api/getLastNameCandidate");
        const data = (await res.json()) as getCandidate[];

        if (data.length > 0) {
          const titles = data.map((u) => u.lastname);
          setLastName(titles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loadLastNames();
  }, []);

  return (
    <Combobox items={lastName} multiple value={value} onValueChange={onChange}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Nom" />
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
