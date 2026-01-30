"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  diploma: z.string().min(1, "Champ obligatoire"),
  yearOfgraduation: z
    .string()
    .regex(/^\d{4}$/, "Entrez une année à 4 chiffres"),
});

type FormValues = z.infer<typeof formSchema>;

type OptionDiplomas = {
  id: number;
  intitule: string | null;
};

type AddedDiploma = {
  diplomaId: string;
  diplomaLabel: string;
  yearOfgraduation: string;
};

export default function DiplomaForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diploma: "",
      yearOfgraduation: "",
    },
  });

  const [diplomaOptions, setDiplomaOptions] = useState<OptionDiplomas[]>([]);
  const [addDiplomas, setAddDiplomas] = useState<AddedDiploma[]>([]);
  const [loadingDiplomas, setLoadingDiplomas] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function Load() {
      setLoadingDiplomas(true);

      try {
        const diplomsRes = await fetch("/api/diplomas");

        if (!diplomsRes.ok) throw new Error("diplomas " + diplomsRes.status);

        const diplomas = (await diplomsRes.json()) as OptionDiplomas[];
        setDiplomaOptions(diplomas);
      } catch (e) {
        console.log("Load error", e);
      } finally {
        setLoadingDiplomas(false);
      }
    }

    Load();
  }, []);

  function addDiploma(values: FormValues) {
    // values.diploma = "18558" (id из select)
    const label =
      diplomaOptions.find((x) => String(x.id) === values.diploma)?.intitule ??
      "";

    setAddDiplomas((prev) => [
      ...prev,
      {
        diplomaId: values.diploma,
        diplomaLabel: label,
        yearOfgraduation: values.yearOfgraduation,
      },
    ]);

    form.reset();
  }

  async function saveAll() {
    if (addDiplomas.length === 0) return;
    setSuccess(null);
    try {
      const payload = {
        diplomas: addDiplomas.map((d) => ({
          rncpId: Number(d.diplomaId),
          year: Number(d.yearOfgraduation),
        })),
      };

      const res = await fetch("/api/saveUserRncp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setSuccess(false);
        return;
      }

      setSuccess(true);
      setAddDiplomas([]);
    } catch (e) {
      console.log(e);
      setSuccess(false);
    }
  }

  return (
    <Form {...form}>
      <form className="w-full px-4 md:px-6 md:p-6">
        <div className="w-full max-w-2xl mx-auto rounded-lg border bg-background p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-foreground">Diplôme</h3>

          <fieldset className="mt-6 space-y-5">
            {/* Diplome */}
            <FormField
              control={form.control}
              name="diploma"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Diplôme
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {loadingDiplomas ? (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      ) : (
                        <>
                          <option value=""> --Choisir-- </option>
                          {diplomaOptions.map((d) => (
                            <option key={d.id} value={String(d.id)}>
                              {d.intitule ?? ""}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Year of Graduation */}
            <FormField
              control={form.control}
              name="yearOfgraduation"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Année d'obtention
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AAAA"
                      {...field}
                      className="h-10 w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={form.handleSubmit(addDiploma)}
                className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ajouter
              </Button>

              <Button
                type="button"
                className="w-fit px-10 bg-green-600 hover:bg-green-700 text-white"
                onClick={saveAll}
              >
                Enregistrer
              </Button>
            </div>

            {success !== null && (
              <div className={success ? "text-green-600" : "text-green-600"}>
                {success
                  ? "Le formulaire a été envoyé avec succès"
                  : "Use erreur est survenue. Le formulaire ne a pas été envoyé "}
              </div>
            )}

            {/* DESKTOP TABLE */}
            <div className="mt-6 rounded-lg border border-border overflow-hidden hidden md:block">
              <div className="px-4 py-3 text-sm text-muted-foreground border-b border-border">
                Ajouter vos diplômes et retrouvez-les ci-dessous
              </div>

              <div className="max-h-64 overflow-y-auto overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-1/1 border-r font-semibold text-center">
                        Diplôme
                      </TableHead>

                      <TableHead className="w-1/3 border-r text-center font-semibold">
                        Année
                      </TableHead>
                      <TableHead className="w-1/4 border-r text-center font-semibold">
                        x
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {addDiplomas.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-6 text-center text-sm text-muted-foreground"
                        >
                          Aucun diplôme ajouté pour le moment
                        </TableCell>
                      </TableRow>
                    ) : (
                      addDiplomas.map((d, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.diplomaLabel || d.diplomaId}
                          </TableCell>

                          <TableCell className="border-r text-center truncate whitespace-nowrap">
                            {d.yearOfgraduation}
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setAddDiplomas((prev) =>
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
              {addDiplomas.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground border border-border rounded-lg">
                  Aucun diplôme ajouté pour le moment
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {addDiplomas.map((d, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg border border-border bg-background p-4 shadow-sm"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setAddDiplomas((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ×
                      </Button>

                      <div className="space-y-2 pr-8">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Diplôme:
                          </span>
                          <p className="text-sm">
                            {d.diplomaLabel || d.diplomaId}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Année:
                          </span>
                          <p className="text-sm">{d.yearOfgraduation}</p>
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
