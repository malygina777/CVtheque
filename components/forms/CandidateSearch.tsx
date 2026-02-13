"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FirstNameMultiple } from "./ComboboxName";
import { LastNameMultiple } from "./ComboboxLastname";
import { DiplomaMultiple } from "./ComboboxDiploma";
import { ExpertiseMultiple } from "./ComboboxExpertise";
import { StructureMultiple } from "./ComboboxStructure";

type AllCandidates = {
  id: number;
  firstname: string;
  lastname: string;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  diplomas: string[];
  expertises: string[];
  structures: string[];
  cvFileName: string;
  enable: boolean;
};

export function CandidateSearch() {
  const [allCandidates, setAlleCandidates] = useState<AllCandidates[]>([]);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [role, setRole] = useState<string>("");

  const [selectedDiploma, setSelectedDiploma] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedLastName, setSelectedLastName] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadeAllCandidates() {
      try {
        setLoading(true);
        const res = await fetch("/api/getAllCandidates");
        if (!res.ok) throw new Error("Candidates fetch failed");
        const payload = (await res.json()) as {
          role: string;
          candidates: AllCandidates[];
        };
        if (!cancelled) {
          setRole(payload.role);
          setAlleCandidates(payload.candidates);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      } finally {
        if (cancelled) setLoading(false);
      }
    }
    loadeAllCandidates();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasAnyFilter =
    selectedDiploma.length > 0 ||
    selectedExpertise.length > 0 ||
    selectedLastName.length > 0 ||
    selectedName.length > 0 ||
    selectedStructure.length > 0;

  const filteredCandidates = useMemo(() => {
    if (!hasAnyFilter) return [];

    return allCandidates.filter((c) => {
      const okFirst =
        selectedName.length === 0 || selectedName.includes(c.firstname);
      const okLastName =
        selectedLastName.length === 0 || selectedLastName.includes(c.lastname);
      const okDiploma =
        selectedDiploma.length === 0 ||
        selectedDiploma.some((d) => c.diplomas?.includes(d));
      const okExpertise =
        selectedExpertise.length === 0 ||
        selectedExpertise.some((e) => c.expertises?.includes(e));
      const okStructure =
        selectedStructure.length === 0 ||
        selectedStructure.some((s) => c.structures?.includes(s));
      return okFirst && okLastName && okDiploma && okExpertise && okStructure;
    });
  }, [
    hasAnyFilter,
    allCandidates,
    selectedDiploma,
    selectedExpertise,
    selectedLastName,
    selectedName,
    selectedStructure,
  ]);

  async function ToggleCandidate(id: number) {
    if (role !== "admin") return;
    try {
      const res = await fetch("/api/toggleCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: id }),
      });
      const data = (await res.json()) as { res: { enable: boolean } };

      if (data.res) {
        return setAlleCandidates((prev) =>
          prev.map((c) => {
            if (c.id === id) {
              return { ...c, enable: data.res.enable };
            }
            return c;
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className=" min-h-screen overflow-x-hidden flex items-start justify-center p-4">
      <div className="w-full px-2 md:px-3">
        <div className="flex flex-wrap gap-4 justify-center w-full rounded-lg border bg-background p-3 md:p-6 shadow-sm mt-3">
          <div className="flex flex-wrap gap-4 justify-center ">
            <FirstNameMultiple
              value={selectedName}
              onChange={setSelectedName}
            />

            <LastNameMultiple
              value={selectedLastName}
              onChange={setSelectedLastName}
            />

            <DiplomaMultiple
              value={selectedDiploma}
              onChange={setSelectedDiploma}
            />

            <ExpertiseMultiple
              value={selectedExpertise}
              onChange={setSelectedExpertise}
            />

            <StructureMultiple
              value={selectedStructure}
              onChange={setSelectedStructure}
            />
          </div>
        </div>
        <div className="w-full rounded-lg border bg-background p-3 md:p-3 shadow-sm mt-6">
          <div className="relative">
            <div className="w-full overflow-x-scroll [-webkit-overflow-scrolling:touch]">
              <div className="min-w-[1100px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-blue-500  hover:bg-blue-500">
                      <TableHead className="border-r text-center font-semibold text-white">
                        Candidate
                      </TableHead>

                      <TableHead className="border-r text-center font-semibold text-white">
                        Téléphone
                      </TableHead>
                      <TableHead className="border-r text-center font-semibold text-white">
                        Diplôme
                      </TableHead>
                      <TableHead className="border-r text-center font-semibold text-white">
                        Expertise
                      </TableHead>
                      <TableHead className="border-r text-center font-semibold text-white">
                        Structure
                      </TableHead>
                      <TableHead className="border-r text-center font-semibold text-white">
                        CV
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white w-20">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {!hasAnyFilter ? (
                      <TableRow className="bg-blue-50">
                        <TableCell
                          colSpan={6}
                          className="py-6 text-center text-sm text-slate-600"
                        >
                          Sélectionnez au moins un filtre pour afficher des
                          candidats.
                        </TableCell>
                      </TableRow>
                    ) : loading ? (
                      <TableRow className="bg-blue-50">
                        <TableCell
                          colSpan={6}
                          className="py-6 text-center text-sm text-slate-600"
                        >
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : filteredCandidates.length === 0 ? (
                      <TableRow className="bg-blue-50">
                        <TableCell
                          colSpan={6}
                          className="py-6 text-center text-sm text-slate-600"
                        >
                          Aucun candidat ne correspond aux filtres.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCandidates.map((c) => {
                        const hasPhoto =
                          typeof c.photoUrl === "string" &&
                          c.photoUrl.trim() !== "";

                        const cvFileName = c.cvFileName?.split("/").pop();

                        return (
                          <TableRow
                            key={c.id}
                            className={
                              c.enable
                                ? "bg-blue-50 hover:bg-blue-100 transition-colors"
                                : "bg-gray-200 text-gray-400 opacity-60"
                            }
                          >
                            {/* Candidate (photo + name + email) */}
                            <TableCell className="min-w-[80px]">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-blue-400 shrink-0">
                                  {hasPhoto ? (
                                    <Image
                                      src={`/api/img/photo/${c.photoUrl}`}
                                      alt={`${c.firstname} ${c.lastname}`}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                                      {`${c.firstname?.[0] ?? ""}${c.lastname?.[0] ?? ""}`.toUpperCase()}
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="truncate font-semibold">
                                    {c.firstname} {c.lastname}
                                  </div>
                                  <div className="truncate text-sm text-muted-foreground">
                                    {c.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="border-r text-center truncate whitespace-normal">
                              {c.phone ?? "-"}
                            </TableCell>

                            <TableCell className="border-r text-center truncate whitespace-normal">
                              {c.diplomas?.join(", ") ?? "-"}
                            </TableCell>

                            <TableCell className="border-r text-center truncate whitespace-normal">
                              {c.expertises?.join(", ") ?? "-"}
                            </TableCell>

                            <TableCell className="border-r text-center truncate whitespace-normal">
                              {c.structures?.join(", ") ?? "-"}
                            </TableCell>

                            <TableCell className="border-r text-center truncate whitespace-normal">
                              {cvFileName ? (
                                <a
                                  href={`/api/cv/${cvFileName}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center"
                                  title="Ouvrir le CV"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-file-earmark-person"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2v9.255S12 12 8 12s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h5.5z" />
                                  </svg>
                                </a>
                              ) : (
                                "-"
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              {role === "admin" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => ToggleCandidate(c.id)}
                                >
                                  {c.enable ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                    </svg>
                                  )}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
