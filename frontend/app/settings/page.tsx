"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement settings save functionality
      toast({
        title: "تنظیمات",
        description: "تنظیمات با موفقیت ذخیره شد",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات</CardTitle>
          <CardDescription>تنظیمات برنامه و ترجیحات کاربری</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>اعلان‌ها</Label>
              <p className="text-sm text-muted-foreground">
                دریافت اعلان‌های برنامه
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>حالت تاریک</Label>
              <p className="text-sm text-muted-foreground">
                استفاده از تم تاریک
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            ذخیره تنظیمات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
