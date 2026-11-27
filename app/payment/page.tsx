import { redirect } from "next/navigation";

// Paid plans are off while the service is unavailable. The home page shows the notice.
export default function Payment() {
  redirect("/");
}
