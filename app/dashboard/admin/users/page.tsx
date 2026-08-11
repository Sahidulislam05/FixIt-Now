"use client";

import { useState } from "react";
import Image from "next/image";
import { useAdminUsers } from "@/hooks/queries/use-admin";
import { useUpdateUserStatus } from "@/hooks/mutations/use-admin-mutations";
import { Role } from "@/lib/types";
import { getAvatarUrl } from "@/lib/avatar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { Search, Ban, CheckCircle2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  // ফিল্টার বদলালে পেজ ১-এ রিসেট — render-time adjustment প্যাটার্ন
  // (useEffect+setState নয়, react-hooks/set-state-in-effect lint rule এড়াতে)
  const filterKey = `${debouncedSearch}|${roleFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const { data, isLoading: loading } = useAdminUsers({
    searchTerm: debouncedSearch || undefined,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    page,
    limit: PAGE_SIZE,
  });
  const users = data?.users ?? [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalCount = data?.meta?.total ?? users.length;

  const updateStatus = useUpdateUserStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all registered platform users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>User Directory</span>
            <Badge variant="outline" className="font-normal">
              {totalCount} Users Found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as Role | "ALL")}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="TECHNICIAN">Technicians</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
                              <Image
                                src={getAvatarUrl(u.id || u.name)}
                                alt={u.name}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            {u.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {u.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.role === "ADMIN"
                                ? "default"
                                : u.role === "TECHNICIAN"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.activeStatus === "BLOCKED" ? (
                            <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                              BANNED
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              ACTIVE
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.role !== "ADMIN" && (
                            <Button
                              size="sm"
                              variant={
                                u.activeStatus === "BLOCKED"
                                  ? "outline"
                                  : "destructive"
                              }
                              className="gap-1 h-8 text-xs"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate({
                                  userId: u.id,
                                  activeStatus:
                                    u.activeStatus === "BLOCKED"
                                      ? "ACTIVE"
                                      : "BLOCKED",
                                })
                              }
                            >
                              {u.activeStatus === "BLOCKED" ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Unban
                                  User
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3.5 w-3.5" /> Ban User
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <SimplePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No users match your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
