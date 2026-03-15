import { Accessibility } from "lucide-react";

export default function AccessibilityPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Accessibility className="h-8 w-8 text-emerald-500" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Accessibility Statement
                        </h1>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                            Last updated: January 2026
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Our Commitment
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Vertex Credit Union is committed to ensuring digital accessibility for people with
                            disabilities. We continually improve the user experience for everyone and
                            apply relevant accessibility standards.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Standards
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
                            at Level AA. These guidelines explain how to make web content more
                            accessible for people with disabilities.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Accessibility Features
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Keyboard navigation support throughout the application</li>
                            <li>Screen reader compatibility with proper ARIA labels</li>
                            <li>Sufficient color contrast ratios for text and interactive elements</li>
                            <li>Resizable text without loss of functionality</li>
                            <li>Clear focus indicators for interactive elements</li>
                            <li>Alternative text for images and icons</li>
                            <li>Consistent navigation and page structure</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Assistive Technologies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our website is designed to be compatible with assistive technologies
                            including screen readers, screen magnifiers, and speech recognition software.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Feedback
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We welcome your feedback on the accessibility of Vertex Credit Union. Please let us
                            know if you encounter accessibility barriers:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Email: <span className="text-emerald-600">accessibility@vertexcu.com</span></li>
                            <li>Phone: 1-800-VERTEX-0</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                            Continuous Improvement
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We regularly review our website and modify it to remove accessibility
                            barriers as they are identified. If you experience any difficulty accessing
                            any part of our website, please contact us for assistance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
