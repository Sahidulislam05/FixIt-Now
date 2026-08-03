"use client";

import { useState, useEffect } from "react";
import {
  createService,
  deleteMyService,
  getMyServices,
  updateMyService,
} from "@/lib/api/services";
import { getAllCategories } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { Category, Service } from "@/lib/types";

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
import { Plus, Edit, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const fetchMyServices = async () => {
    try {
      setLoading(true);
      const res = await getMyServices();
      setServices(res.data.services);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error("Failed to load your services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchMyServices();
      void getAllCategories()
        .then((res) => setCategories(res.data.categories))
        .catch((error: unknown) =>
          console.error("Failed to load categories:", error),
        );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenModal = (service?: Service) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(formData.price);
    if (!formData.categoryId) {
      toast.error("Please select a service category.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid service price");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        price,
        categoryId: formData.categoryId,
      };

      if (editingService) {
        await updateMyService(editingService.id, payload);
        toast.success("Service updated successfully");
      } else {
        await createService(payload);
        toast.success("New service created successfully");
      }

      setIsModalOpen(false);
      void fetchMyServices();
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.issues?.map((issue) => issue.message).join(", ") ||
              error.message
          : "Failed to save service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate/delete this service?"))
      return;

    try {
      await deleteMyService(id);
      toast.success("Service removed successfully");
      void fetchMyServices();
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete service",
      );
    }
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
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : services.length > 0 ? (
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
                  {services.map((service) => (
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No services found. Click &quot;Add New Service&quot; to create
              your first offering.
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
              {/* Keep the field controlled by the category UUID, not its display name. */}
              <Input
                type="hidden"
                id="category"
                value={formData.categoryId}
                readOnly
              />
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
