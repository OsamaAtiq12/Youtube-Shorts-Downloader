"use client";

import { Copy, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractSchema, type ExtractFormValues } from "@/lib/validators";

interface UrlFormProps {
  onSubmit: (values: ExtractFormValues) => void;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const form = useForm<ExtractFormValues>({
    resolver: zodResolver(extractSchema),
    defaultValues: { url: "" },
  });

  const url = form.watch("url");

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();
    form.setValue("url", text, { shouldValidate: true });
  };

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="relative">
        <Input placeholder="Paste YouTube Shorts URL..." {...form.register("url")} />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleCopy} aria-label="Paste from clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => form.reset()} aria-label="Clear form">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {form.formState.errors.url ? <p className="text-sm text-red-500">{form.formState.errors.url.message}</p> : null}

      <Button className="w-full" type="submit" disabled={isLoading || !url}>
        <Search className="mr-2 h-4 w-4" />
        {isLoading ? "Fetching metadata..." : "Fetch Video Info"}
      </Button>
    </form>
  );
}
