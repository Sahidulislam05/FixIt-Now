"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormAlert } from "@/components/forms/form-alert";
import { useAuth } from "@/hooks/use-auth";
import { createBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { formatTaka } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DayOfWeek, User } from "@/lib/types";

const DAY_INDEX_TO_ENUM: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

function hourlySlots(start: string, end: string): string[] {
  const startH = Number(start.split(":")[0]);
  const endH = Number(end.split(":")[0]);
  if (Number.isNaN(startH) || Number.isNaN(endH) || endH <= startH) return [];
  return Array.from({ length: endH - startH }, (_, i) => `${String(startH + i).padStart(2, "0")}:00`);
}

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Choose a service"),
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((v) => v >= todayISO(), "Choose today or a later date"),
  time: z.string().min(1, "Pick a time"),
  address: z
    .string()
    .trim()
    .min(10, "Add the full address (house, road, area)")
    .max(300, "Keep the address under 300 characters"),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm({
  technician,
  defaultServiceId,
}: {
  technician: User;
  defaultServiceId?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const services = technician.services ?? [];
  const availabilities = useMemo(() => technician.availabilities ?? [], [technician.availabilities]);
  const hasSchedule = availabilities.length > 0;

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      serviceId:
        services.find((s) => s.id === defaultServiceId)?.id ?? services[0]?.id ?? "",
      date: "",
      time: "",
      address: "",
    },
  });

  const [serviceId, date, time] = useWatch({
    control: form.control,
    name: ["serviceId", "date", "time"],
  });
  const selectedService = services.find((s) => s.id === serviceId);

  const slots = useMemo(() => {
    if (!date || !hasSchedule) return [];
    const day = DAY_INDEX_TO_ENUM[new Date(`${date}T00:00:00`).getDay()];
    const schedule = availabilities.find((a) => a.dayOfWeek === day && a.isActive);
    return schedule ? hourlySlots(schedule.startTime, schedule.endTime) : [];
  }, [date, hasSchedule, availabilities]);

  const isDayOff = hasSchedule && !!date && slots.length === 0;

  async function onSubmit(values: BookingValues) {
    setServerError(null);
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      await createBooking({
        serviceId: values.serviceId,
        scheduledDate: `${values.date}T${values.time}:00`,
        address: values.address,
      });
      toast.success("Request sent! The technician will confirm shortly.");
      router.push("/dashboard/customer/bookings");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Couldn't send the booking request.");
    }
  }

  if (services.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        This technician has no active services to book right now.
      </p>
    );
  }

  if (user && user.role !== "CUSTOMER") {
    return (
      <FormAlert
        tone="info"
        message={`You're logged in as ${user.role.toLowerCase()}. Log in with a customer account to book.`}
      />
    );
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-1.5">
        <Label htmlFor="booking-service" className="text-[0.82rem] font-semibold">
          Service
        </Label>
        <Controller
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="booking-service" className="w-full" aria-invalid={!!errors.serviceId}>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title} · {formatTaka(s.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceId && <p className="text-[0.8rem] text-destructive">{errors.serviceId.message}</p>}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="booking-date" className="text-[0.82rem] font-semibold">
          Date
        </Label>
        <Input
          id="booking-date"
          type="date"
          min={todayISO()}
          aria-invalid={!!errors.date}
          {...form.register("date", {
            onChange: () => form.setValue("time", ""),
          })}
        />
        {errors.date && <p className="text-[0.8rem] text-destructive">{errors.date.message}</p>}
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[0.82rem] font-semibold">Start time</legend>
        <AnimatePresence mode="wait" initial={false}>
          {!date ? (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-muted-foreground">
              Pick a date to see open times.
            </motion.p>
          ) : isDayOff ? (
            <motion.div
              key="off"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground"
            >
              <CalendarX2 className="mt-0.5 size-4 shrink-0" />
              {technician.name.split(" ")[0]} doesn&apos;t work on this day. Try another date.
            </motion.div>
          ) : hasSchedule ? (
            <motion.div key={date} className="grid grid-cols-3 gap-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.025 } } }}>
              {slots.map((slot) => (
                <motion.button
                  key={slot}
                  type="button"
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => form.setValue("time", slot, { shouldValidate: true })}
                  aria-pressed={time === slot}
                  className={cn(
                    "h-10 rounded-lg border font-mono text-sm transition-colors",
                    time === slot
                      ? "border-foreground bg-foreground text-background"
                      : "hover:border-foreground/50",
                  )}
                >
                  {slot}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <p className="text-xs text-muted-foreground">
                No weekly schedule yet — suggest a time and the technician will confirm.
              </p>
              <Input type="time" aria-label="Preferred start time" {...form.register("time")} />
            </motion.div>
          )}
        </AnimatePresence>
        {errors.time && !isDayOff && <p className="text-[0.8rem] text-destructive">{errors.time.message}</p>}
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="booking-address" className="text-[0.82rem] font-semibold">
          Address
        </Label>
        <Textarea
          id="booking-address"
          rows={2}
          className="min-h-20"
          placeholder="House 12, Road 7, Banani, Dhaka"
          aria-invalid={!!errors.address}
          {...form.register("address")}
        />
        {errors.address && <p className="text-[0.8rem] text-destructive">{errors.address.message}</p>}
      </div>

      {selectedService && (
        <div className="flex items-baseline justify-between border-t border-dashed pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <motion.span
            key={selectedService.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold"
          >
            {formatTaka(selectedService.price)}
          </motion.span>
        </div>
      )}

      <FormAlert tone="error" message={serverError} />

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isDayOff}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Sending request…
          </>
        ) : isAuthenticated ? (
          "Send booking request"
        ) : (
          <>
            <LogIn /> Log in to book
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">You won&apos;t be charged until the technician accepts.</p>
    </form>
  );
}
