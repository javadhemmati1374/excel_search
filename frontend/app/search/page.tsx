"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "خطا",
        description: "لطفا عبارت جستجو را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement search functionality
      toast({
        title: "جستجو",
        description: "در حال جستجو...",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در جستجو",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>جستجوی هوشمند</CardTitle>
          <CardDescription>
            عبارت مورد نظر خود را وارد کنید تا در فایل‌های اکسل جستجو شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">عبارت جستجو</Label>
              <Input
                id="search"
                placeholder="عبارت مورد نظر را وارد کنید..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "در حال جستجو..." : "جستجو"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results section will be added here */}
    </div>
  );
}
