import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="section-dark flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <Image src="/brand/nabhindu-mark.png" alt="Nabhindu Technologies" width={140} height={68} />
      <h1 className="display-lg mt-10">Page not found</h1>
      <p className="lede mt-4 max-w-[40ch] text-haze">The page you were looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Go to the homepage
      </Link>
    </main>
  );
}
