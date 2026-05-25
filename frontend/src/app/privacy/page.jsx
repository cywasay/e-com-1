import LegalPageShell from "@/components/LegalPageShell";

export const metadata = {
  title: "Privacy Policy | uniforms.ae",
  description: "How uniforms.ae collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p className="text-sm text-[#6b6560] mb-8">Last updated: May 2026</p>

      <h2>Overview</h2>
      <p>
        uniforms.ae (&quot;we&quot;, &quot;us&quot;) provides corporate uniforms and
        workwear to customers in the UAE and GCC. This policy describes how we handle
        personal information when you browse our site, create an account, request a
        quote, or place an order.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Account details: name, email, phone, company name, and tax ID for B2B accounts</li>
        <li>Order and quote information: products, quantities, shipping address, and messages</li>
        <li>Payment data: processed securely by Stripe; we do not store full card numbers</li>
        <li>Usage data: standard server logs and cookies required for authentication and cart</li>
      </ul>

      <h2>How we use your information</h2>
      <p>
        We use your information to process orders and quote requests, manage wholesale
        applications, communicate about your account, improve our catalog, and comply
        with legal obligations.
      </p>

      <h2>Sharing</h2>
      <p>
        We share data only with service providers necessary to operate the platform
        (e.g. payment processing, hosting) and when required by law. We do not sell
        personal information.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your account data by
        contacting us through the{" "}
        <a href="/contact" className="text-[#c8a96e] font-semibold hover:underline">
          contact page
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent via our contact form or to the email
        address listed on the Contact page.
      </p>
    </LegalPageShell>
  );
}
