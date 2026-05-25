import QuotesClient from "./QuotesClient";

export const metadata = {
  title: "Quote Requests | uniforms.ae",
  description: "View your submitted quote requests and bulk pricing inquiries.",
};

export default function QuotesPage() {
  return <QuotesClient />;
}
