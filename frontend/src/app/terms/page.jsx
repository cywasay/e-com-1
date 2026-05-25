import LegalPageShell from "@/components/LegalPageShell";

export const metadata = {
  title: "Terms of Service | uniforms.ae",
  description: "Terms and conditions for using uniforms.ae.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <p className="text-sm text-[#6b6560] mb-8">Last updated: May 2026</p>

      <h2>Agreement</h2>
      <p>
        By using uniforms.ae, you agree to these terms. If you do not agree, please do
        not use the site.
      </p>

      <h2>Accounts</h2>
      <p>
        Retail (B2C) accounts may browse, add items to cart, and checkout online.
        Corporate (B2B) accounts may apply for wholesale access; approved buyers receive
        tier pricing and use quote-based ordering as described on product pages.
      </p>

      <h2>Orders and quotes</h2>
      <p>
        Online checkout is available for eligible retail orders. B2B quote requests are
        subject to review; prices and availability confirmed in writing are binding for
        acceptance. We reserve the right to refuse or cancel orders in cases of error,
        suspected fraud, or stock unavailability.
      </p>

      <h2>Pricing</h2>
      <p>
        List prices are shown on the storefront. Logged-in wholesale customers may see
        contract or tier pricing after approval. All prices are in AED unless stated
        otherwise and exclude shipping and applicable taxes where relevant.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Site content, branding, and product imagery are owned by uniforms.ae or its
        licensors and may not be copied or reused without permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided as-is. To the extent permitted by law, uniforms.ae is not
        liable for indirect or consequential damages arising from use of the platform.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after
        changes constitutes acceptance of the revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, please use our{" "}
        <a href="/contact" className="text-[#c8a96e] font-semibold hover:underline">
          contact page
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
