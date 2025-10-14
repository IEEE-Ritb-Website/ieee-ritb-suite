import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";

export function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-background text-foreground">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
