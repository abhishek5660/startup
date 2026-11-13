import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { founder, site } from "@/lib/site";

const UPDATED = "13 November 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you share through our website, contact form and call booking.`,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { type: "website", url: "/privacy-policy", title: `Privacy Policy | ${site.name}`, images: ["/og-image.png"] },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      updated={UPDATED}
      lede="What information we collect when you contact us or book a call, why we need it, and the choices you have."
    >
      <p>
        This Privacy Policy explains how <strong>{site.name}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;),
        based in {site.address.full}, handles personal information collected through this website ({site.url}). We follow the
        Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 of India. By using this website or
        submitting a form, you agree to the practices described here.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Contact / project inquiry form:</strong> your full name, email address, phone number, company name (optional),
          the service you are interested in, your budget range (optional) and your project details.
        </li>
        <li>
          <strong>Free consultation call booking:</strong> your full name, phone number, email address (optional), preferred date
          and time slot, call mode and what you would like to discuss.
        </li>
        <li>
          <strong>WhatsApp, phone and email:</strong> if you contact us directly, we receive the details you choose to share, such
          as your name, number and messages. WhatsApp conversations are also subject to WhatsApp&rsquo;s own privacy policy.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Spam and abuse protection:</strong> when you submit a form, we store a one-way, scrambled (hashed) version of your
          IP address and your browser&rsquo;s user-agent string. We use these only to limit repeated or automated submissions; the
          hash cannot be turned back into your IP address.
        </li>
        <li>
          <strong>Server logs:</strong> our hosting provider may keep standard technical logs (such as IP address, browser type and
          pages requested) for security and reliability.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To reply to your inquiry, prepare a quote and discuss your project.</li>
        <li>To schedule, confirm and hold the consultation call you booked.</li>
        <li>To deliver and support the services you hire us for.</li>
        <li>To keep our website and forms secure and free from spam.</li>
        <li>To meet legal, tax and accounting obligations.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell, rent or trade your personal information, and we do not use it to send marketing messages
        unless you have asked us to.
      </p>

      <h2>3. Cookies and browser storage</h2>
      <p>
        This website does not use advertising or tracking cookies. We use your browser&rsquo;s session storage only to remember
        small preferences for the current visit — for example, so the intro animation and WhatsApp chat bubble are not shown
        again on every page. This information stays on your device and is cleared when you close the browser tab. The
        password-protected admin area uses a secure login cookie for our own staff only.
      </p>
      <p>
        If we add analytics or advertising tools (such as Google Analytics or Google Ads conversion tracking) in future, we will
        update this policy before doing so and explain what they collect and how you can opt out.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We share your information only with trusted service providers who help us run this website, and only as needed:</p>
      <ul>
        <li><strong>Vercel</strong> — website hosting.</li>
        <li><strong>Supabase</strong> — secure database where inquiries and bookings are stored.</li>
        <li><strong>Google (Gmail)</strong> — email delivery of inquiry and booking notifications to our team.</li>
      </ul>
      <p>
        These providers may store or process data on servers outside India. They are bound by their own security and privacy
        commitments. We may also disclose information if required by law, court order or a government authority.
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        We keep inquiry and booking details for up to <strong>24 months</strong> after our last contact with you, so we can
        follow up on your project. If you become a client, we keep project and billing records for as long as required by
        Indian tax and accounting laws. After that, we delete or anonymise the information.
      </p>

      <h2>6. How we protect it</h2>
      <p>
        The website is served over HTTPS, the database is not publicly accessible, and only authorised members of our team can
        view submissions through a password-protected admin area. No method of transmission or storage is completely secure, but
        we take reasonable steps to protect your information.
      </p>

      <h2>7. Your rights</h2>
      <p>Under Indian data protection law you can:</p>
      <ul>
        <li>ask what personal information we hold about you;</li>
        <li>ask us to correct or update inaccurate information;</li>
        <li>ask us to delete your information (unless we must keep it by law);</li>
        <li>withdraw your consent at any time; and</li>
        <li>raise a grievance with us, and with the Data Protection Board of India if it is not resolved.</li>
      </ul>
      <p>
        To use any of these rights, email us at <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond within 30
        days.
      </p>

      <h2>8. Children</h2>
      <p>
        Our services are meant for businesses and adults. We do not knowingly collect personal information from anyone under 18.
        If you believe a child has sent us their details, please contact us and we will delete them.
      </p>

      <h2>9. Links to other websites</h2>
      <p>
        Our website links to other services such as WhatsApp, LinkedIn and Google Maps. We are not responsible for their privacy
        practices, so please read their policies before sharing information with them.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it was last
        changed. Significant changes will be highlighted on this page.
      </p>

      <h2>11. Contact and grievance officer</h2>
      <p>
        For any question, request or complaint about your personal information, contact our Grievance Officer:
        <br />
        <strong>{founder.name}</strong>, {founder.jobTitle}, {site.name}
        <br />
        Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        <br />
        Phone: <a href={site.phoneHref}>{site.phone}</a>
        <br />
        Address: {site.address.full}
      </p>
    </LegalPage>
  );
}
