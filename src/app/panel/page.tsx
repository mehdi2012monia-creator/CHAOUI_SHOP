import { redirect } from "next/navigation";

/** رابط مختصر ودائم للوحة التحكم: /panel */
export default function PanelPage() {
  redirect("/admin");
}
