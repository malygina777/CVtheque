"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage("Lien invalide (token manquant).");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = String(formData.get("newPassword") || "").trim();

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    setLoading(false);

    if (error) {
      setMessage("Lien invalide ou expiré.");
      return;
    }

    setMessage("Mot de passe modifié. Tu peux te connecter.");
    router.push("/login"); 
  }

  return ( 
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
    <Card className="w-full max-w-sm border-black/30 shadow-[0_12px_24px_rgba(15,23,42,0.18),0_30px_80px_-30px_rgba(15,23,42,0.45)]">
      <CardHeader>
        <CardTitle>Nouveau mot de passe</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input className="border-black/50 divide-y divide-black/30" id="newPassword" name="newPassword" type="password" required />
          </div>

          <Button variant="outline" type="submit" className="w-full mt-2 text-white transition-all duration-150 border-black/40 divide-y divide-black/30 bg-black

hover:bg-[#e0843f]
hover:scale-[1.02]
hover:text-white-900
cursor-pointer" disabled={loading}>
            {loading ? "Changement..." : "Changer"}
          </Button>

          {message && <p className="text-sm">{message}</p>}
        </form>
      </CardContent>
    </Card>
  </div>
);
}