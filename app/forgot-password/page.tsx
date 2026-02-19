"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (error) {
      setMessage("Erreur. Réessaie.");
      return;
    }

    setMessage("Si l'email existe, un lien a été envoyé.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 bg-gray-100">
      <Card className="w-full max-w-sm border-black/30 divide-y divide-black/30 shadow-[0_12px_24px_rgba(15,23,42,0.18),0_30px_80px_-30px_rgba(15,23,42,0.45)]">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="border-black/50 divide-y divide-black/30"/>
            </div>

            <Button type="submit" variant="outline" className="w-full mt-2 text-white transition-all duration-150 border-black/40 divide-y divide-black/30 bg-black

hover:bg-amber-100
hover:scale-[1.02]
hover:text-amber-900
cursor-pointer" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>

            {message && <p className="text-sm">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
