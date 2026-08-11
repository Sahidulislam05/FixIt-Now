"use client";

import { useState, useMemo } from "react";
import { useMyServices } from "@/hooks/queries/use-services";
import { useCategories } from "@/hooks/queries/use-categories";
import {
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/mutations/use-service-mutations";
import { Service } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { Plus, Edit, Trash2, Wrench } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const PAGE_SIZE = 8;

export default function TechnicianServicesPage() {
  // ============================================================
  // TanStack Query — create/update/delete মিউটেশন সফল হলেই
  // queryKeys.services.all invalidate হয় (use-service-mutations.ts,
  // Phase 1-এ বানানো), তাই এই টেবিল reload ছাড়াই আপডেট হয়ে যায়।
  // ============================================================
  const { data: services = [], isLoading: loading } = useMyServices();
  const { data: categories = [] } = useCategories();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  // /api/services/my-services ব্যাকএন্ডে pagination সাপোর্ট করে না (পুরো
  // লিস্ট একবারে আসে), আর একজন টেকনিশিয়ানের সার্ভিস সংখ্যা স্বাভাবিকভাবেই
  // কম থাকে — তাই admin/categories পেজের মতো client-side search+pagination
  // যথেষ্ট (একই প্যাটার্ন, কনসিস্টেন্ট UX)।
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const [page, setPage] = useState(1);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const filteredServices = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.category?.name.toLowerCase().includes(term),
    );
  }, [services, debouncedSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / PAGE_SIZE),
  );
  const paginatedServices = filteredServices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [formError, setFormError] = useState("");

  const handleOpenModal = (service?: Service) => {
    setFormError("");
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.title,
        description: service.description || "",
        price: service.price.toString(),
        categoryId: service.categoryId,
      });
    } else {
      setEditingService(null);
      setFormData({ name: "", description: "", price: "", categoryId: "" });
    }
    setIsModalOpen(true);
  };

  const submitting = createService.isPending || updateService.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const price = Number(formData.price);
    if (!formData.categoryId) {
      setFormError("Please select a service category.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Please enter a valid service price.");
      return;
    }

    const payload = {
      title: formData.name,
      description: formData.description,
      price,
      categoryId: formData.categoryId,
    };

    if (editingService) {
      updateService.mutate(
        { id: editingService.id, payload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createService.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to deactivate/delete this service?"))
      return;
    deleteService.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage My Services
          </h1>
          <p className="text-sm text-muted-foreground">
            Add and manage services you offer to clients
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add New Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" /> My Service Offerings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search my services..."
          />

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginatedServices.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-semibold">
                          {service.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {service.category?.name || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ৳{service.price}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(service)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={deleteService.isPending}
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
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
              {debouncedSearch
                ? "No services match your search."
                : 'No services found. Click "Add New Service" to create your first offering.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Service Title</Label>
              <Input
                id="name"
                placeholder="e.g. AC Master Servicing"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-destructive">
                  No categories are available. Ask an administrator to create
                  one.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price (BDT ৳)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 1200"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed information about what is included in this service..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {formError && (
              <p className="text-xs text-destructive">{formError}</p>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingService
                    ? "Update Service"
                    : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
