import Link from "next/link";
import { VertexLogo } from "@/components/shared/vertex-logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2940&auto=format&fit=crop"
                    alt="Modern banking"
                    className="w-full h-full object-cover opacity-10 dark:opacity-5"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 via-teal-50/95 to-cyan-50/95 dark:from-gray-950/95 dark:via-gray-900/95 dark:to-gray-950/95" />
            </div>

            {/* Header */}
            <header className="relative p-6 z-10">
                <Link href="/">
                    <VertexLogo width={176} height={48} />
                </Link>
            </header>

            {/* Content */}
            <main className="relative flex-1 flex items-center justify-center px-4 py-12 z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative p-6 text-center text-sm text-gray-500 dark:text-gray-400 z-10">
                <p>© {new Date().getFullYear()} Vertex Credit Union.</p>
                <div className="mt-2 flex items-center justify-center gap-4">
                    <Link href="/legal/privacy" className="hover:text-emerald-600">Privacy</Link>
                    <Link href="/legal/terms" className="hover:text-emerald-600">Terms</Link>
                    <Link href="/contact" className="hover:text-emerald-600">Contact</Link>
                </div>
            </footer>
        </div>
    );
}
