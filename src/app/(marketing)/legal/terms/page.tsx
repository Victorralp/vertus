import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <FileText className="h-8 w-8 text-emerald-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Terms of Service
                        </h1>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                            Last updated: January 2026
                        </p>



                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            By accessing or using Vertex Credit Union services, you agree to be bound by these
                            Terms of Service. If you do not agree, please do not use our services.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            2. Account Registration
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            To use our services, you must create an account with accurate information.
                            You are responsible for maintaining the security of your account credentials.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            3. Service Usage
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You agree to use our services only for lawful purposes and in accordance
                            with these terms. You may not:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with the proper functioning of our services</li>
                            <li>Use automated systems to access our services without permission</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            4. Transactions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            All transactions are subject to verification. We reserve the right to
                            refuse or cancel transactions that appear fraudulent or violate these terms.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Vertex Credit Union shall not be liable for any indirect, incidental, or consequential
                            damages arising from your use of our services.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            6. Changes to Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We may modify these terms at any time. Continued use of our services after
                            changes constitutes acceptance of the modified terms.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            7. Contact
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Questions about these Terms should be directed to{" "}
                            <span className="text-emerald-600">legal@vertexcu.com</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
