"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Тут позже будет запрос на твой API: /api/auth/forgot-password
      // await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
      setSent(true);
    } catch (err) {
      console.log(err);
      // тут можно показать ошибку
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Mot de passe oublié ?</CardTitle>
          <CardDescription>
            Entre ton email et on t’enverra un lien pour réinitialiser ton mot
            de passe.
          </CardDescription>

          <CardAction>
            <Button asChild variant="link">
              <Link href="/registration">Se connecter</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="text-sm text-muted-foreground">
              ✅ Si un compte existe avec cet email, un lien de réinitialisation
              a été envoyé.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2">
          {!sent && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          )}

          <Button asChild variant="outline" className="w-full">
            <Link href="/registration">Retour</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
