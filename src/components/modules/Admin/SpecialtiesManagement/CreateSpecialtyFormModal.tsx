"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, FileImage } from "lucide-react";
import { createSpecialty } from "@/services/specialty.services";

const CreateSpecialtyFormModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) => createSpecialty(formData),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a specialty title");
      return;
    }

    if (!file) {
      toast.error("Please select an icon file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    try {
      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create specialty");
        return;
      }

      toast.success(result.message || "Specialty created successfully");
      setOpen(false);
      setTitle("");
      setFile(null);

      void queryClient.invalidateQueries({ queryKey: ["specialties"] });
      void queryClient.refetchQueries({
        queryKey: ["specialties"],
        type: "active",
      });
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg px-5 py-2 shadow-sm transition-all duration-300 gap-2 cursor-pointer">
          <Plus className="h-4 w-4" /> Add Specialty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Specialty</DialogTitle>
          <DialogDescription>
            Create a new medical specialty category with a name and icon file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Specialty Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Cardiology, Neurology"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="rounded-lg focus-visible:border-[#047857] focus-visible:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon File</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-[20px] p-6 hover:bg-emerald-50/20 hover:border-[#047857] cursor-pointer relative transition-all border-slate-200 bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <FileImage className="h-8 w-8 text-[#047857]" />
                  <span className="text-sm font-medium text-foreground max-w-[250px] truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <Upload className="h-8 w-8 text-[#047857] mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    Upload Icon
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, or SVG up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
            >
              {isPending ? "Adding..." : "Add Specialty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpecialtyFormModal;
