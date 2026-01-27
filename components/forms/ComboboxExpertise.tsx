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
  fullname: string;
};

export type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export function ExpertiseMultiple({ value, onChange }: Props) {
  const [expertise, setExpertise] = React.useState<string[]>([]);

  useEffect(() => {
    async function loaded() {
      try {
        const res = await fetch("/api/getExpertiseCandidate");
        const data = (await res.json()) as getCandidate[];
        if (data.length > 0) {
          const titles = data.map((ex) => ex.fullname);
          console.log(titles);
          setExpertise(titles);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loaded();
  }, []);

  return (
    <Combobox items={expertise} multiple value={value} onValueChange={onChange}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Expertise" />
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
