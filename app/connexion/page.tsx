"use client";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ConnexionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  async function handlSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorPassword(null);
    setErrorForm(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password")).trim();

      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        setErrorForm("Email ou mot de passe incorrect.");
        return;
      }
      router.replace("/redirect");
      router.refresh();
    } catch (e) {
      setErrorForm("Erreur server. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-sm border-black/30 divide-y divide-black/30 shadow-[0_12px_24px_rgba(15,23,42,0.18),0_30px_80px_-30px_rgba(15,23,42,0.45)]">
        <CardHeader>
          <CardTitle>Connectez-vous à votre compte</CardTitle>
          <CardDescription>
            Saisissez votre adresse e-mail ci-dessous pour vous connecter à
            votre compte
          </CardDescription>
          <CardAction>
            <Button asChild variant="link">
              <Link href="/register">S'enregistrer</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                  className="border-black/50 divide-y divide-black/30"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    T'as oublié ton mot de passe?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  onChange={() => setErrorPassword(null)}
                  className="border-black/40 divide-y divide-black/30 bg-white"
                />
                {errorPassword && (
                  <p className="text-red-600 text-left">{errorPassword}</p>
                )}

                <div className="flex-col gap-2">
                  <Button  variant="outline" type="submit" className="w-full text-white border-black/50 divide-y divide-black/30 bg-black hover:scale-[1.03] hover:text-amber-900 hover:bg-amber-100
cursor-pointer" disabled={loading}>
                    {loading ? "Connexion..." : "Login"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mt-2 text-white transition-all duration-150 border-black/40 divide-y divide-black/30 bg-black

hover:bg-amber-100
hover:scale-[1.02]
hover:text-amber-900
cursor-pointer"
                    type="button"
                    onClick={async () =>
                      await authClient.signIn.social({ provider: "google", callbackURL: "/redirect", })
                    }
                  >
                    Login with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mt-2 text-white transition-all duration-150 border-black/40 divide-y divide-black/30 bg-black

hover:bg-amber-100
hover:scale-[1.02]
hover:text-amber-900
cursor-pointer"
                    type="button"
                    onClick={async () =>
                      await authClient.signIn.social({ provider: "microsoft" })
                    }
                  >
                    Login with Microsoft
                  </Button>
                </div>

                {errorForm && (
                  <p className="text-red-600 text-center">{errorForm}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
