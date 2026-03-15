import { Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="h-8 w-8 text-emerald-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                            Last updated: January 2026
                        </p>



                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We collect information you provide directly to us, such as when you
                            create an account, make a transaction, or contact us for support.
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Account information (name, email, password)</li>
                            <li>Transaction history and account activity</li>
                            <li>Device and usage information</li>
                            <li>Communication records with support</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and send related notifications</li>
                            <li>Protect against fraud and unauthorized access</li>
                            <li>Respond to your inquiries and provide support</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            3. Information Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We implement appropriate security measures to protect your personal
                            information, including encryption, secure authentication, and access controls.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            4. Data Retention
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We retain your information for as long as your account is active or as
                            needed to provide you services and comply with legal obligations.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            5. Your Rights
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            You have the right to access, correct, or delete your personal information.
                            You can manage your account settings or contact us for assistance.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            6. Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you have questions about this Privacy Policy, please contact us at{" "}
                            <span className="text-emerald-600">privacy@vertexcu.com</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
