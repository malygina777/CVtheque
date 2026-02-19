"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
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
const ACCEPTED_TYPES = ["application/pdf"];

const fileSchema = z
  .custom<File>((v) => v instanceof File, "Fichier obligatoire.")
  .refine((file) => file.size > 0, "Fichier vide.")
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max 5MB.")
  .refine((file) => ACCEPTED_TYPES.includes(file.type), "Formats: PDF");

const formSchema = z.object({
  cv: fileSchema,
  coverLetter: fileSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadingDocuments() {
  const [resetKey, setResetKey] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 👇 важно: никаких File тут
    defaultValues: {
      cv: undefined as any,
      coverLetter: undefined as any,
    },
  });

  async function onSubmit(values: FormValues) {
    setSuccess(false);
    setError(null);

    const fd = new FormData();

    fd.append("cv", values.cv);
    fd.append("coverLetter", values.coverLetter);

    const res = await fetch("/api/uploadingDocuments", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      setSuccess(true);
      form.reset();
      setResetKey((k) => k + 1); // ✅ реально очищает file input
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError("Erreur lors de l'envoi du formulaire");
      setTimeout(() => setError(null), 5000);
    }
  }

  return (
    <Form {...form}>
      <form
        key={resetKey}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mt-6 px-4 md:px-6 md:p-6"
      >
        <div className="w-full max-w-2xl mx-auto rounded-lg border bg-background p-6 shadow-sm border-black/40 divide-y divide-black/30 bg-white">
          <h3 className="text-lg font-semibold text-foreground">
            Téléchargement de fichiers
          </h3>

          <fieldset className="mt-6 space-y-5">
            {/* CV */}
            <FormField
              control={form.control}
              name="cv"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">CV</FormLabel>
                  <FormControl>
                    <div className="w-full rounded-md border bg-background px-3 py-2 shadow-sm border-black/40 divide-y divide-black/30 bg-white">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="h-10 w-full border-0 p-0 shadow-none focus-visible:ring-0 "
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Cover letter */}
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    Lettre de motivation
                  </FormLabel>
                  <FormControl>
                    <div className="w-full rounded-md border bg-background px-3 py-2 shadow-sm border-black/40 divide-y divide-black/30 bg-white">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="h-10 w-full border-0 p-0 shadow-none focus-visible:ring-0 "
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-2 flex">
              <Button
                type="submit"
                className="w-fit px-10bg-black ml-2 hover:bg-[#9cbe3f]  hover:scale-[1.08] hover:text-black transition-all duration-150 cursor-pointer border-black/40 divide-y divide-black/30"
              >
                Enregistrer
              </Button>
            </div>

            {success && (
              <p className="mt-3 text-sm text-green-600">
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
