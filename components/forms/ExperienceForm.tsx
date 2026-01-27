"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formSchema = z.object({
  domain: z.string().min(1, "Champ obligatoire"),
  natureOfActivity: z.string().min(1, "Champ obligatoire"),
  typeOfStructure: z.string().min(1, "Champ obligatoire"),
  nameOfStructure: z.string().min(1, "Champ obligatoire"),
  startDate: z
    .string()
    .min(1, "Champ obligatoire")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Veuillez saisir une date au format AAAA-MM-JJ.",
    ),
  endDate: z
    .string()
    .min(1, "Champ obligatoire")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Veuillez saisir une date au format AAAA-MM-JJ.",
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExperienceForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      natureOfActivity: "",
      typeOfStructure: "",
      nameOfStructure: "",
      startDate: "",
      endDate: "",
    },
  });

  type GeneralDomain = {
    id: number;
    fullname: string;
    shortname: string | null;
  };

  type NatureOfActivity = {
    id: number;
    fullname: string;
    shortname: string | null;
  };

  type TypeOfStructure = {
    id: number;
    fullname: string;
    shortname: string | null;
  };

  type NameOfStructure = {
    id: number;
    fullname: string;
  };

  type ExperienceRow = {
    domainId: string;
    domainName: string;

    activityId: string;
    activityName: string;

    typeId: string;
    typeName: string;

    structureName: string;
    startDate: string;
    endDate: string;
  };

  const [domains, setDomains] = useState<GeneralDomain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [activities, setActivities] = useState<NatureOfActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [typeOfStructure, setTypeOfStructure] = useState<TypeOfStructure[]>([]);
  const [typeOfStructureLoading, setTypeOfStructureLoading] = useState(true);
  const [nameOfStructure, setNameOfStructure] = useState<NameOfStructure[]>([]);
  const [NameOfStructureLoading, setNameOfStructureLoading] = useState(true);
  const selectedDomainId = form.watch("domain");

  useEffect(() => {
    let cancelled = false;

    async function loadDomains() {
      try {
        setDomainsLoading(true);
        const res = await fetch("/api/generalDomains", { cache: "no-store" });

        if (!res.ok) throw new Error("Failed to fetch general domains");

        const data: GeneralDomain[] = await res.json();
        if (!cancelled) setDomains(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setDomains([]);
      } finally {
        if (!cancelled) setDomainsLoading(false);
      }
    }
    loadDomains();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadActivities(domainId: string) {
      try {
        setActivitiesLoading(true);

        const res = await fetch(
          `/api/natureOfActivities?domainId=${domainId}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw Error("Feiled to fetch nature of avtivities");
        const data: NatureOfActivity[] = await res.json();
        if (!cancelled) setActivities(data);
      } catch (e) {
        console.log(e);
        if (!cancelled) setActivities([]);
      } finally {
        if (!cancelled) setActivitiesLoading(false);
      }
    }

    if (!selectedDomainId) {
      setActivities([]);
      form.setValue("natureOfActivity", "");
      setActivitiesLoading(false);
      return;
    }

    loadActivities(selectedDomainId);

    return () => {
      cancelled = true;
    };
  }, [selectedDomainId, form]);

  useEffect(() => {
    let cancelled = false;

    async function loadTypeOfStructure(domainId: string) {
      try {
        setTypeOfStructureLoading(true);

        const res = await fetch(`/api/typeOfStructure?domainId=${domainId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw Error("Feiled to fetch type of structure");
        const data: TypeOfStructure[] = await res.json();
        if (!cancelled) setTypeOfStructure(data);
      } catch (e) {
        console.log(e);
        if (!cancelled) setTypeOfStructure([]);
      } finally {
        if (!cancelled) setTypeOfStructureLoading(false);
      }
    }

    if (!selectedDomainId) {
      setTypeOfStructure([]);
      form.setValue("typeOfStructure", "");
      setTypeOfStructureLoading(false);
      return;
    }

    loadTypeOfStructure(selectedDomainId);

    return () => {
      cancelled = true;
    };
  }, [selectedDomainId, form]);

  useEffect(() => {
    let cancelled = false;

    async function loadNameStructure() {
      try {
        setNameOfStructureLoading(true);
        const res = await fetch("/api/nameOfStructure", { cache: "no-store" });

        if (!res.ok) throw new Error("Failed to fetch name of structure");

        const data: NameOfStructure[] = await res.json();
        if (!cancelled) setNameOfStructure(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setNameOfStructure([]);
      } finally {
        if (!cancelled) setNameOfStructureLoading(false);
      }
    }
    loadNameStructure();

    return () => {
      cancelled = true;
    };
  }, []);

  const [diplomas, setDiplomas] = useState<ExperienceRow[]>([]);

  function addSubmit(values: FormValues) {
    const domainName =
      domains.find((d) => String(d.id) === values.domain)?.fullname ?? "";
    const activityName =
      activities.find((a) => String(a.id) === values.natureOfActivity)
        ?.fullname ?? "";
    const typeName =
      typeOfStructure.find((t) => String(t.id) === values.typeOfStructure)
        ?.fullname ?? "";

    const row: ExperienceRow = {
      domainId: values.domain,
      domainName: domainName,

      activityId: values.natureOfActivity,
      activityName: activityName,

      typeId: values.typeOfStructure,
      typeName: typeName,

      structureName: values.nameOfStructure,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    setDiplomas((prev) => [...prev, row]);
    form.reset();
  }

  async function saveAlleExperiences() {
    if (diplomas.length === 0) return;

    try {
      const payload = diplomas.map((d) => ({
        domainId: d.domainId,
        activityId: d.activityId,
        typeId: d.typeId,
        structureName: d.structureName,
        startDate: d.startDate,
        endDate: d.endDate,
      }));

      const res = await fetch("/api/saveExperience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setDiplomas([]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form className="w-full px-4 md:px-6 md:p-6">
        {/* CARD */}
        <div className="w-full max-w-2xl mx-auto rounded-lg border bg-background p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-foreground">Experience</h3>

          {/* FIELDS */}
          <fieldset className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Domain général
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">
                        {domainsLoading ? "Chargement..." : "--Choisir--"}
                      </option>

                      {domains.map((d) => (
                        <option key={d.id} value={String(d.id)}>
                          {d.fullname}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="natureOfActivity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Nature de l'activité
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={!selectedDomainId || activitiesLoading}
                    >
                      <option value="">
                        {activitiesLoading ? "Chargement..." : "--Choisir--"}
                      </option>

                      {activities.map((a) => (
                        <option key={a.id} value={String(a.id)}>
                          {a.fullname}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeOfStructure"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Type de structure
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">
                        {typeOfStructureLoading
                          ? "Chargement..."
                          : "--Choisir--"}
                      </option>

                      {typeOfStructure.map((t) => (
                        <option key={t.id} value={String(t.id)}>
                          {t.fullname}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameOfStructure"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Nom de structure
                  </FormLabel>
                  <FormControl>
                    <div>
                      <input
                        {...field}
                        list="structures-list"
                        placeholder="Saisir ou choisir une structure"
                        className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <datalist id="structures-list">
                        {nameOfStructure.map((s) => (
                          <option key={s.id} value={s.fullname} />
                        ))}
                      </datalist>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Date de début
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-10 w-full" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Date de fin
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-10 w-full" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={form.handleSubmit(addSubmit)}
                className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ajouter
              </Button>

              <Button
                type="button"
                className="w-fit px-10 bg-green-600 hover:bg-green-700 text-white"
                onClick={saveAlleExperiences}
              >
                Enregistrer
              </Button>
            </div>

            {/* DESKTOP TABLE */}
            <div className="mt-6 rounded-lg border border-border overflow-hidden hidden md:block overflow-x-auto w-full">
              <div className="px-4 py-3 text-sm text-muted-foreground border-b border-border ">
                Ajouter vos expériences et retrouvez-les ci-dessous
              </div>

              <div className="max-h-64 overflow-y-auto overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-max border-r font-semibold text-center truncate whitespace-nowrap">
                        Domain général
                      </TableHead>
                      <TableHead className="w-max border-r font-semibold text-center truncate whitespace-nowrap">
                        Nature de l'activité
                      </TableHead>
                      <TableHead className="w-max border-r font-semibold text-center truncate whitespace-nowrap">
                        Type de structure
                      </TableHead>
                      <TableHead className="w-max border-r font-semibold text-center truncate whitespace-nowrap">
                        Nom de structure
                      </TableHead>
                      <TableHead className="w-max border-r text-center font-semibold truncate whitespace-nowrap">
                        Date de début
                      </TableHead>
                      <TableHead className="w-max border-r text-center font-semibold truncate whitespace-nowrap">
                        Date de fin
                      </TableHead>
                      <TableHead className="w-10 text-center font-semibold truncate whitespace-nowrap">
                        x
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {diplomas.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-6 text-center text-sm text-muted-foreground"
                        >
                          Aucune expérience ajoutée pour le moment
                        </TableCell>
                      </TableRow>
                    ) : (
                      diplomas.map((d, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.domainName}
                          </TableCell>
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.activityName}
                          </TableCell>
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.typeName}
                          </TableCell>
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.structureName}
                          </TableCell>
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.startDate}
                          </TableCell>
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.endDate}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setDiplomas((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                            >
                              ×
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="mt-6 md:hidden space-y-3">
              {diplomas.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground border border-border rounded-lg">
                  Aucune expérience ajoutée pour le moment
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {diplomas.map((d, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg border border-border bg-background p-4 shadow-sm"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setDiplomas((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ×
                      </Button>

                      <div className="space-y-2 pr-8">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Domain général:
                          </span>
                          <p className="text-sm">{d.domainName}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Nature de l'activité:
                          </span>
                          <p className="text-sm">{d.activityName}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Type de structure:
                          </span>
                          <p className="text-sm">{d.typeName}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Nom de structure:
                          </span>
                          <p className="text-sm">{d.structureName}</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground">
                              Début:
                            </span>
                            <p className="text-sm">{d.startDate}</p>
                          </div>
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-muted-foreground">
                              Fin:
                            </span>
                            <p className="text-sm">{d.endDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </form>
    </Form>
  );
}
