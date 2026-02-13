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

export type getCandidate = {
  id: number;
  firstname: string;
};

export type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export function FirstNameMultiple({ value, onChange }: Props) {
  const [name, setName] = React.useState<string[]>([]);

  useEffect(() => {
    async function loadedName() {
      try {
        const res = await fetch("/api/getNameCandidate");
        const data = (await res.json()) as getCandidate[];
        if (data.length > 0) {
          const titles = data.map((n) => n.firstname);

          setName(titles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loadedName();
  }, []);

  return (
    <Combobox items={name} multiple value={value} onValueChange={onChange}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Prénom" />
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
