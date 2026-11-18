"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormAlert } from "@/components/forms/form-alert";
import type { CreateServicePayload } from "@/lib/api/services";
import type { Category, Service } from "@/lib/types";

const DESCRIPTION_MAX = 2000;

const serviceSchema = z.object({
  title: z.string().trim().min(4, "Give the service a clear name (4+ characters)").max(255),
  categoryId: z.string().min(1, "Choose a category"),
  price: z
    .string()
    .min(1, "Enter a price")
    .refine((v) => Number(v) > 0, "Price must be more than 0")
    .refine((v) => Number(v) <= 1_000_000, "That price looks too high"),
  location: z.string().trim().max(120, "Keep the area short").optional(),
  description: z
    .string()
    .trim()
    .min(30, "Describe what's included (30+ characters) so customers know what they're paying for")
    .max(DESCRIPTION_MAX, `Keep it under ${DESCRIPTION_MAX} characters`),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service | null;
  categories: Category[];
  pending: boolean;
  serverError?: string | null;
  onSubmit: (payload: CreateServicePayload) => void;
  onCancel: () => void;
}

/** Create and edit form for a technician's service listing. */
export function ServiceForm({ service, categories, pending, serverError, onSubmit, onCancel }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    mode: "onTouched",
    defaultValues: {
      title: service?.title ?? "",
      categoryId: service?.categoryId ?? "",
      price: service ? String(Number(service.price)) : "",
      location: service?.location ?? "",
      description: service?.description ?? "",
    },
  });

  const descriptionLength = useWatch({ control: form.control, name: "description" })?.length ?? 0;

  function submit(values: ServiceFormValues) {
    onSubmit({
      title: values.title,
      categoryId: values.categoryId,
      price: Number(values.price),
      location: values.location || undefined,
      description: values.description,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} noValidate className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Full AC servicing (up to 2 ton)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <FormDescription>No categories yet — ask an admin to add one.</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (৳)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={1} placeholder="1500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Area <span className="font-normal text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Gulshan, Dhaka" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-baseline justify-between">
                <FormLabel>What&apos;s included</FormLabel>
                <span className="font-mono text-xs text-muted-foreground">
                  {descriptionLength}/{DESCRIPTION_MAX}
                </span>
              </div>
              <FormControl>
                <Textarea rows={4} placeholder="List the work covered by this price, and anything that costs extra." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormAlert tone="error" message={serverError} />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {pending ? "Saving…" : service ? "Save changes" : "Publish service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
