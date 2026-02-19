"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  firstName: z.string().min(1, "Champ obligatoire"),
  lastName: z.string().min(1, "Champ obligatoire"),
  dateOfBirth: z
    .string()
    .min(1, "Champ obligatoire")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Veuillez saisir une date au format AAAA-MM-JJ.",
    ),
  phone: z
    .string()
    .min(1, "Champ obligatoire")
    .regex(/^\d{10}$/, "Veuillez saisir un numéro à 10 chiffres"),
  email: z.string().email("Email invalide"),
  photo: z
    .custom<File>((v) => v instanceof File, "Veuillez ajouter une photo.")
    .refine((file) => file.size > 0, "Fichier vide.")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formats acceptés: JPG, PNG, WEBP.",
    ),
  contractIntervation: z.string().min(1, "Champ obligatoire"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CivilityForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      photo: undefined as unknown as File,
      contractIntervation: "",
    },
  });

  type ContractType = { id: number; fullname: string };

  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contracts");
        const data = await res.json();
        setContracts(data);
      } catch (e) {
        console.error("Failed to load contracts", e);
      } finally {
        setLoadingContracts(false);
      }
    }
    load();
  }, []);

  async function onSubmit(values: FormValues) {
    const fd = new FormData();
    fd.append("firstName", values.firstName);
    fd.append("lastName", values.lastName);
    fd.append("dateOfBirth", values.dateOfBirth);
    fd.append("phone", values.phone);
    fd.append("email", values.email);
    fd.append("contractIntervation", values.contractIntervation);
    fd.append("photo", values.photo); // File

    const res = await fetch("/api/users", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setSuccess(true);
      setError(null);
      form.reset();

      setTimeout(() => {
        setSuccess(false);
      }, 8000);
    } else {
      setError("Erreur lors de l'envoi du formulaire");
      setTimeout(() => {
        setError(null);
      }, 8000);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mt-6  px-4 md:px-6 md:p-6"
      >
        {/* CARD */}
        <div className="w-full max-w-2xl mx-auto rounded-lg border bg-background p-6 shadow-sm border-black/40 divide-y divide-black/30 bg-white">
          <h3 className="text-lg font-semibold text-foreground">Civility</h3>

          <fieldset className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2 ">
                  <FormLabel className="text-sm font-semibold">
                    Prénom
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 w-full border-black/40 divide-y divide-black/30 bg-white" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">Nom</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 w-full border-black/40 divide-y divide-black/30 bg-white" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Date de naissance
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 w-full border-black/40 divide-y divide-black/30 bg-white" type="date" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10 w-full border-black/40 divide-y divide-black/30 bg-white"
                      placeholder="06..."
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10 w-full border-black/40 divide-y divide-black/30 bg-white"
                      placeholder="ex: nom@email.com"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Photo */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">Photo</FormLabel>
                  <FormControl>
                    {/* контейнер фиксирует внешний вид file input */}
                    <div className="w-full rounded-md border bg-background px-3 py-2 shadow-sm border-black/40 divide-y divide-black/30 bg-white">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="h-10 w-full border-0 p-0 shadow-none focus-visible:ring-0 border-black/40 divide-y divide-black/30 bg-white"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Contract */}
            <FormField
              control={form.control}
              name="contractIntervation"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Contrat d&apos;intervention souhaité
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-black/40 divide-y divide-black/30 bg-white"
                    >
                      {loadingContracts ? (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      ) : (
                        <>
                          <option value=""> --Choisir-- </option>
                          {contracts.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.fullname}
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

            {/* ACTION */}
            <div className="pt-2 flex">
              <Button
                type="submit"
                 className="w-fit bg-black ml-2 hover:bg-[#9cbe3f]  hover:scale-[1.08] hover:text-black transition-all duration-150 cursor-pointer border-black/40 divide-y divide-black/30 "
              >
                Enregistrer
              </Button>
            </div>

            {success && (
              <p className="mt-3 text-sm text-green-600">
                {" "}
                Le formulaire a été soumis avec succès
              </p>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </fieldset>
        </div>
      </form>
    </Form>
  );
}
