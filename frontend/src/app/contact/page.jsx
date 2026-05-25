import ContactClient from "./ContactClient";
import { fetchPublicSettings } from "@/lib/fetchPublicSettings";

export const metadata = {
  title: "Contact Us | uniforms.ae",
  description: "Get in touch with our sales team for custom uniform quotes, bulk orders, and enterprise wholesale accounts in the UAE.",
};

export default async function ContactPage() {
  let settings = {};

  try {
    settings = await fetchPublicSettings();
  } catch (error) {
    console.error("Error fetching public settings:", error);
  }

  return <ContactClient settings={settings} />;
}
