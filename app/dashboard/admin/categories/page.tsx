"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FolderTree, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { createCategoryAdmin, getAllCategoriesAdmin, updateCategoryAdmin } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import type { Category } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormAlert } from "@/components/forms/form-alert";
import { CategoryIcon } from "@/components/shared/service-card";
import { TableToolbar } from "@/components/shared/table-toolbar";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().trim().max(500, "Keep it under 500 characters").optional(),
  icon: z.string().trim().max(8, "Use a single emoji").optional(),
});

type CategoryValues = z.infer<typeof categorySchema>;

function CategoryForm({
  category,
  onSaved,
  onCancel,
}: {
  category: Category | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
    },
  });

  async function onSubmit(values: CategoryValues) {
    setServerError(null);
    try {
      if (category) await updateCategoryAdmin(category.id, values);
      else await createCategoryAdmin(values);
      toast.success(category ? "Category updated" : "Category created");
      onSaved();
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Couldn't save the category.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_6rem]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Plumbing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <Input placeholder="🔧" className="text-center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="What kind of jobs belong here?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormAlert tone="error" message={serverError} />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            {category ? "Save changes" : "Create category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAllCategoriesAdmin()
      .then((res) => !cancelled && setCategories(res.data.categories))
      .catch(() => !cancelled && toast.error("Failed to load categories"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? categories.filter((c) => c.name.toLowerCase().includes(term)) : categories;
  }, [categories, search]);

  function openForm(category?: Category) {
    setEditing(category ?? null);
    setOpen(true);
  }

  function handleSaved() {
    setOpen(false);
    setLoading(true);
    setReloadKey((k) => k + 1);
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">The trades customers can browse and technicians can list under.</p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus /> New category
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <TableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search categories" />
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : visible.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Services</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((cat) => (
                  <TableRow key={cat.id} className="animate-rise">
                    <TableCell>
                      <span className="flex items-center gap-3 font-semibold">
                        <span className="grid size-8 place-items-center rounded-lg bg-deep text-deep-foreground">
                          <CategoryIcon category={cat.name} className="size-4" />
                        </span>
                        {cat.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-muted-foreground">{cat.description || "—"}</TableCell>
                    <TableCell className="text-right font-mono">{cat._count?.services ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon-sm" variant="ghost" onClick={() => openForm(cat)} aria-label={`Edit ${cat.name}`}>
                        <Pencil />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <FolderTree className="size-9 text-muted-foreground" strokeWidth={1.5} />
            <p className="font-display text-xl font-semibold">No categories found</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Category names must be unique.</DialogDescription>
          </DialogHeader>
          <CategoryForm key={editing?.id ?? "new"} category={editing} onSaved={handleSaved} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
