import { redirect } from "next/navigation";
import { isAuthenticated } from "../lib/auth";

export default function Home() {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
  return null;
}
