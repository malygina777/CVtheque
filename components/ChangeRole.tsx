"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserRow = {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
};

export function ChangeRole() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function loadeUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/getAllUsersWithRole");
        if (!res.ok) throw new Error("Fetch failed");
        const data = (await res.json()) as { users: UserRow[] };
        if (!cancelled) setUsers(data.users);
      } catch (e) {
        console.log(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadeUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const input = filter.trim().toLowerCase();
    if (!input) return users;

    return users.filter((u) =>
      `${u.firstname} ${u.lastname}`.toLowerCase().includes(input),
    );
  }, [filter, users]);

  async function saveRole(id: number, role: string) {
    const res = await fetch("/api/updateRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (!res.ok) alert("Error");
  }

  return (
    <div className=" min-h-screen overflow-x-hidden flex items-start justify-center p-4">
      <div className="w-full px-2 md:px-3">
        <div className="flex flex-wrap gap-4 justify-center w-full rounded-lg border bg-background p-3 md:p-6 shadow-sm mt-3">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Tapez un prénom ou un nom..."
            className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="w-full rounded-lg border bg-background p-3 md:p-3 shadow-sm mt-6">
          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-500">
                      <TableHead className="text-center font-semibold text-white">
                        Nom
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        Prénom
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        Rôle
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow
                        key={u.id}
                        className="bg-blue-50 hover:bg-blue-100"
                      >
                        <TableCell className="text-center">
                          {u.lastname}
                        </TableCell>
                        <TableCell className="text-center">
                          {u.firstname}
                        </TableCell>
                        <TableCell className="text-center">
                          <select
                            className="border border-gray-400 rounded px-2 py-1 text-sm mr-4"
                            value={u.role}
                            onChange={(e) => {
                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? { ...x, role: e.target.value }
                                    : x,
                                ),
                              );
                            }}
                          >
                            <option value="user">user</option>
                            <option value="teacher"> teacher</option>
                            <option value="admin">admin</option>
                          </select>

                          <Button
                            variant="outline"
                            className="ml-2 hover:bg-green-50"
                            onClick={() => saveRole(u.id, u.role)}
                          >
                            Enregistrer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
