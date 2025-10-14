import UrlShortener from "@/components/apps/url-shortener";
import { Link } from "lucide-react";

export function URLShortenerPage() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="font-mono text-primary flex gap-2 items-center mb-4">
                <Link /> URL Shortener
            </div>
            <UrlShortener />
        </section>
    )
}
