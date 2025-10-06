import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

export function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen w-full relative">
            <div
                className="absolute inset-0 -z-[1]"
                style={{
                    background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
                }}
            />
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}
