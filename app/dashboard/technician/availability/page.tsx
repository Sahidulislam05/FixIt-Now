"use client";

import { useState, useEffect } from "react";
import { getMyAvailability, setMyAvailability } from "@/lib/api/technicians";
import { ApiError } from "@/lib/api/client";
import type { DayOfWeek } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Save } from "lucide-react";
import { toast } from "sonner";

interface DaySchedule {
  day: DayOfWeek;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

const DEFAULT_DAYS: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export default function TechnicianAvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DEFAULT_DAYS.map((day) => ({
      day,
      isAvailable: true,
      startTime: "09:00",
      endTime: "18:00",
    })),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyAvailability()
      .then((res) => {
        const fetched = res.data.availabilities;
        if (fetched.length > 0) {
          // Merge with defaults to ensure all 7 days exist
          const map = new Map(fetched.map((item) => [item.dayOfWeek, item]));
          setSchedule(
            DEFAULT_DAYS.map((day) => {
              const found = map.get(day);
              return {
                day,
                isAvailable: found ? found.isActive : false,
                startTime: found?.startTime || "09:00",
                endTime: found?.endTime || "18:00",
              };
            }),
          );
        }
      })
      .catch((err: Error) => {
        console.error("Failed to load availability", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleDay = (dayIndex: number, checked: boolean) => {
    const updated = [...schedule];
    updated[dayIndex].isAvailable = checked;
    setSchedule(updated);
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const updated = [...schedule];
    updated[dayIndex][field] = value;
    setSchedule(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setMyAvailability(
        schedule.map((item) => ({
          dayOfWeek: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          isActive: item.isAvailable,
        })),
      );
      toast.success("Availability schedule saved successfully!");
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to save schedule",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Weekly Availability
        </h1>
        <p className="text-sm text-muted-foreground">
          Set your working days and daily working hours
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Working Hours
          </CardTitle>
          <CardDescription>
            Customers can only request bookings within your available slots
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 divide-y">
          {schedule.map((item, index) => (
            <div
              key={item.day}
              className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Day & Toggle Switch */}
              <div className="flex items-center gap-3 w-36">
                <Switch
                  checked={item.isAvailable}
                  onCheckedChange={(checked) => handleToggleDay(index, checked)}
                />
                <span
                  className={`font-medium text-sm ${item.isAvailable ? "text-foreground" : "text-muted-foreground line-through"}`}
                >
                  {item.day}
                </span>
              </div>

              {/* Working Hours Input */}
              {item.isAvailable ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={item.startTime}
                    onChange={(e) =>
                      handleTimeChange(index, "startTime", e.target.value)
                    }
                    className="w-32 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={item.endTime}
                    onChange={(e) =>
                      handleTimeChange(index, "endTime", e.target.value)
                    }
                    className="w-32 text-xs"
                  />
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Unavailable / Day Off
                </div>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving Schedule..." : "Save Schedule"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
