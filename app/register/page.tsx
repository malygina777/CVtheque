"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function isStrongPassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/;
    return regex.test(password);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        firstName: String(formData.get("firstname") || ""),
        lastName: String(formData.get("lastname") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        confirmPassword: String(formData.get("confirmPassword") || ""),
      };
      const { email, password, confirmPassword, firstName, lastName } = payload;

      setErrorPassword(null);
      if (password !== confirmPassword) {
        setErrorPassword("Les mot de passe ne correspondent pas.");
        setLoading(false);
        return;
      }

      if (!isStrongPassword(password)) {
        setErrorPassword(
          "mot de passe: minimum 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spésial",
        );
        setLoading(false);
        return;
      }

      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });

      if (error) {
        setErrorForm(JSON.stringify(error, null, 2));
        return;
      }

      await authClient.signIn.email({ email, password });

      await fetch("/api/profileInit", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      setSuccess(true);
      router.push("/connexion");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>S’enregistrer</CardTitle>
          <CardDescription>
            Crée un compte en remplissant les informations ci-dessous.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success && (
            <p className="text-green-600 text-left">
              Compte créé avec succès 🎉 Redirection vers la connexion...
            </p>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input id="firstname" name="firstname" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastname">Nom</Label>
                  <Input id="lastname" name="lastname" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    onChange={() => setErrorPassword(null)}
                  />
                  {errorPassword && (
                    <p className="text-red-600 text-left">{errorPassword}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    onChange={() => setErrorPassword(null)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Création..." : "Créer un compte"}.
                </Button>
              </div>

              {errorForm && (
                <p className="text-red-600 text-left">{errorForm}</p>
              )}
            </form>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/connexion">J’ai déjà un compte</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
