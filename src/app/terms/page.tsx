import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { site } from "@/lib/site";

const UPDATED = "13 November 2026";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use the ${site.name} website or hire us for website and web application development.`,
  alternates: { canonical: "/terms" },
  openGraph: { type: "website", url: "/terms", title: `Terms & Conditions | ${site.name}`, images: ["/og-image.png"] },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms"
      updated={UPDATED}
      lede="The terms that apply when you use this website or work with us on a project."
    >
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) apply to your use of this website ({site.url}) and to the services
        provided by <strong>{site.name}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;), {site.address.full}.
        By using this website or engaging our services, you agree to these Terms. If a signed proposal, quotation or agreement
        for your project says something different, that document takes priority for that project.
      </p>

      <h2>1. Our services</h2>
      <p>
        We provide frontend web development, full-stack web development, custom website development, UI/UX design and website
        optimisation. The exact scope, features, number of pages, timeline and price for your project are set out in the written
        quotation or proposal we share with you.
      </p>

      <h2>2. Prices, estimates and quotations</h2>
      <ul>
        <li>
          Prices shown on this website are <strong>starting prices</strong>. The online project estimator gives an indicative
          figure only and is not a binding quote.
        </li>
        <li>
          Your final price is the one in our written quotation. Quotations are valid for 30 days unless stated otherwise.
        </li>
        <li>
          Work requested outside the agreed scope (new pages, features or major design changes) will be quoted and charged
          separately.
        </li>
        <li>
          Third-party costs such as domain names, hosting, paid plugins, fonts, stock images, email services or API usage are not
          included unless the quotation says so, and are paid by the client.
        </li>
        <li>Taxes, where applicable, are charged in addition to the quoted price.</li>
      </ul>

      <h2>3. Payments</h2>
      <ul>
        <li>
          Payments are made in the instalments set out in the quotation (for example, an advance before work starts and the
          balance before launch or handover).
        </li>
        <li>Work begins once the advance payment is received.</li>
        <li>
          We may pause work, or delay launch and handover, if a payment is overdue.
        </li>
        <li>
          Advance payments cover time already reserved and work started, so they are generally non-refundable once work has
          begun, except where the quotation says otherwise.
        </li>
      </ul>

      <h2>4. Your responsibilities</h2>
      <ul>
        <li>
          Provide the content (text, images, logos, product details) and feedback we need, on time. Delays in content or
          approvals may move the delivery date.
        </li>
        <li>
          Make sure you own or have permission to use everything you send us, and that it does not break any law or infringe
          anyone else&rsquo;s rights.
        </li>
        <li>Review each stage carefully and give clear, consolidated feedback.</li>
        <li>Keep login details for your domain, hosting and website secure once they are handed over to you.</li>
      </ul>

      <h2>5. Revisions and timelines</h2>
      <p>
        Each project includes the number of revision rounds stated in the quotation. Timelines are estimates based on receiving
        content and feedback on time; we will keep you informed if anything changes. We are not responsible for delays caused by
        late content, late payments or third-party services.
      </p>

      <h2>6. Ownership and intellectual property</h2>
      <ul>
        <li>
          Once the project is <strong>paid in full</strong>, you own the final website design and the custom code we wrote for
          your project.
        </li>
        <li>
          Open-source libraries, frameworks and third-party tools used in your project remain under their own licences.
        </li>
        <li>
          We keep ownership of our general know-how, tools and reusable components, and may reuse them in other projects.
        </li>
        <li>
          Unless you ask us not to in writing, we may show the completed project (name, screenshots and a short description) in
          our portfolio and marketing. We will never share your confidential information.
        </li>
      </ul>

      <h2>7. Confidentiality</h2>
      <p>
        We keep your business information, login details and unpublished material confidential and use them only to deliver
        your project. Personal information is handled as described in our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>8. Launch, hosting and support</h2>
      <p>
        After launch we fix bugs in the work we delivered, reported within the support period stated in the quotation, at no
        extra cost. New features, content updates, and issues caused by changes made by you or others, third-party services, or
        hosting providers are not covered and can be handled under a separate maintenance plan or quote.
      </p>

      <h2>9. Cancellation</h2>
      <p>
        Either party may end a project by giving written notice. If a project is cancelled, you pay for the work completed up to
        the date of cancellation, and we hand over the completed work once that payment is received.
      </p>

      <h2>10. Warranties and limitation of liability</h2>
      <ul>
        <li>
          We build every project with care and test it on modern browsers and devices, but we cannot guarantee that a website
          will be completely error-free or always available, or that it will achieve particular search rankings, traffic or
          sales.
        </li>
        <li>
          We are not liable for indirect or consequential losses, such as loss of profit, business or data, or for problems
          caused by third-party services (hosting, domains, payment gateways, plugins or APIs).
        </li>
        <li>
          Our total liability for any claim related to a project is limited to the amount you paid us for that project.
        </li>
      </ul>

      <h2>11. Using this website</h2>
      <ul>
        <li>
          The content, design, logos and graphics on this website belong to {site.name} and may not be copied without our
          permission.
        </li>
        <li>
          Do not misuse the website — for example, by sending spam or false information through our forms, or trying to break
          its security.
        </li>
        <li>
          Information on this website, including blog articles, is provided for general guidance and may change without notice.
        </li>
        <li>We are not responsible for the content of external websites we link to.</li>
      </ul>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute will first be discussed in good faith; if it cannot be
        resolved, it will be subject to the exclusive jurisdiction of the courts in Faridabad, Haryana.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The version on this page applies from the &ldquo;Last updated&rdquo; date
        shown above. Projects already under way continue under the terms in their quotation.
      </p>

      <h2>14. Contact us</h2>
      <p>
        Questions about these Terms? Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>
    </LegalPage>
  );
}
