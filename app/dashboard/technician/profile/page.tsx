"use client";

import { useState, useEffect } from "react";
import { getMyProfile } from "@/lib/api/users";
import { updateMyTechnicianProfile } from "@/lib/api/technicians";
import { ApiError } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Briefcase, Wrench, Save } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    experience: 0,
    skills: "", // Comma-separated string (e.g. "AC Repair, Plumbing, Wiring")
  });

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const data = res.data.profile.technicianProfile;
        setFormData({
          bio: data?.bio || "",
          experience: data?.experienceYears || 0,
          skills: data?.skills?.join(", ") || "",
        });
      })
      .catch((err: Error) => {
        console.error(err);
        toast.error("Failed to load profile details");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        bio: formData.bio,
        experienceYears: Number(formData.experience),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await updateMyTechnicianProfile(payload);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Technician Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your bio, skills, and experience visible to customers
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Details
            </CardTitle>
            <CardDescription>
              Keep your information updated to get more service requests
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Experience (In Years) */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />{" "}
                Experience (Years)
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-muted-foreground" /> Skills
                (Comma-separated)
              </Label>
              <Input
                id="skills"
                placeholder="e.g. AC Maintenance, Circuit Repair, Electric Wiring"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Write a short summary about your services, work ethics, and availability..."
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
