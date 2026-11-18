"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash2, Wrench } from "lucide-react";

import { useMyServices } from "@/hooks/queries/use-services";
import { useCategories } from "@/hooks/queries/use-categories";
import {
  useCreateService,
  useDeleteService,
  useUpdateService,
} from "@/hooks/mutations/use-service-mutations";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ApiError } from "@/lib/api/client";
import type { CreateServicePayload } from "@/lib/api/services";
import { formatTaka } from "@/lib/format";
import type { Service } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceForm } from "@/components/forms/service-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { TableToolbar } from "@/components/shared/table-toolbar";

const PAGE_SIZE = 8;

const SORTS: Record<string, { label: string; compare: (a: Service, b: Service) => number }> = {
  newest: { label: "Newest first", compare: (a, b) => b.createdAt.localeCompare(a.createdAt) },
  "price-asc": { label: "Price: low to high", compare: (a, b) => Number(a.price) - Number(b.price) },
  "price-desc": { label: "Price: high to low", compare: (a, b) => Number(b.price) - Number(a.price) },
  title: { label: "Name: A to Z", compare: (a, b) => a.title.localeCompare(b.title) },
};

export default function TechnicianServicesPage() {
  const { data: services = [], isLoading } = useMyServices();
  const { data: categories = [] } = useCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 250);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const [prevKey, setPrevKey] = useState(`${debouncedSearch}|${sort}`);
  if (`${debouncedSearch}|${sort}` !== prevKey) {
    setPrevKey(`${debouncedSearch}|${sort}`);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    const list = term
      ? services.filter(
          (s) => s.title.toLowerCase().includes(term) || s.category?.name.toLowerCase().includes(term),
        )
      : services;
    return [...list].sort(SORTS[sort].compare);
  }, [services, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const saving = createService.isPending || updateService.isPending;

  function openForm(service?: Service) {
    setEditing(service ?? null);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSave(payload: CreateServicePayload) {
    setFormError(null);
    const options = {
      onSuccess: () => setFormOpen(false),
      onError: (err: unknown) =>
        setFormError(err instanceof ApiError ? err.message : "Couldn't save the service."),
    };
    if (editing) updateService.mutate({ id: editing.id, payload }, options);
    else createService.mutate(payload, options);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your listings</p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">My services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What customers can book from you, and at what price.
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus /> Add a service
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <TableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or category"
          statusValue={sort}
          onStatusChange={setSort}
          statusPlaceholder="Sort"
          statusOptions={Object.entries(SORTS).map(([value, s]) => ({ value, label: s.label }))}
        />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : rows.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((service) => (
                    <TableRow key={service.id} className="animate-rise">
                      <TableCell className="max-w-[260px] truncate font-semibold">{service.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{service.category?.name ?? "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{service.location || "—"}</TableCell>
                      <TableCell className="text-right font-display text-base font-semibold">
                        {formatTaka(service.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="icon-sm" variant="ghost" asChild aria-label={`View ${service.title}`}>
                            <Link href={`/services/${service.id}`} target="_blank">
                              <Eye />
                            </Link>
                          </Button>
                          <Button size="icon-sm" variant="ghost" onClick={() => openForm(service)} aria-label={`Edit ${service.title}`}>
                            <Pencil />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setToDelete(service)}
                            aria-label={`Delete ${service.title}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Wrench className="size-9 text-muted-foreground" strokeWidth={1.5} />
            <p className="font-display text-xl font-semibold">
              {debouncedSearch ? "No services match that search" : "You haven't listed anything yet"}
            </p>
            {!debouncedSearch && (
              <Button variant="outline" onClick={() => openForm()}>
                <Plus /> Add your first service
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => !saving && setFormOpen(open)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing ? "Edit service" : "Add a service"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Changes show on your public listing right away." : "It goes live as soon as you publish it."}
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            key={editing?.id ?? "new"}
            service={editing}
            categories={categories}
            pending={saving}
            serverError={formError}
            onSubmit={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this service?"
        description={
          <>
            <strong className="text-foreground">{toDelete?.title}</strong> will be removed from your public
            listings. Existing bookings for it are not affected.
          </>
        }
        confirmLabel="Delete service"
        pending={deleteService.isPending}
        onConfirm={() =>
          toDelete && deleteService.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }
      />
    </div>
  );
}
