import {
    Zap,
    Shield,
    Smartphone,
    Lock,
    Wallet,
    Building2,
    TrendingUp,
    CreditCard,
} from "lucide-react";

export const features = [
    {
        icon: Zap,
        title: "Instant Transfers",
        description: "Move money between accounts in seconds with real-time processing.",
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "256-bit encryption, 2FA, and OTP verification for every transaction.",
    },
    {
        icon: Smartphone,
        title: "Mobile First",
        description: "Full banking experience optimized for any device, anywhere.",
    },
    {
        icon: Lock,
        title: "Privacy Protected",
        description: "Your data stays yours. We never sell your information.",
    },
];

export const products = [
    {
        icon: Wallet,
        title: "Personal Banking",
        description: "Checking and savings accounts with competitive rates and no hidden fees.",
        href: "/personal",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: Building2,
        title: "Business Banking",
        description: "Powerful tools for businesses of all sizes. Manage cash flow with ease.",
        href: "/business",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: TrendingUp,
        title: "Loans",
        description: "Personal and business loans with transparent terms and fast approval.",
        href: "/loans",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: CreditCard,
        title: "Cards",
        description: "Virtual and physical cards with rewards, cashback, and instant controls.",
        href: "/cards",
        color: "from-emerald-500 to-teal-500",
    },
];

export const rates = [
    { type: "Savings Rate", rate: "4.50%", label: "APY" },
    { type: "Personal Loan", rate: "6.99%", label: "APR" },
    { type: "Business Loan", rate: "5.49%", label: "APR" },
];

export const testimonials = [
    {
        content: "Vertex Credit Union transformed how I manage my finances. The instant transfers and mobile app are game-changers.",
        author: "Sarah Johnson",
        role: "Small Business Owner",
        rating: 5,
    },
    {
        content: "Finally, a bank that treats security seriously without making simple tasks complicated. Love the OTP verification.",
        author: "Michael Chen",
        role: "Software Engineer",
        rating: 5,
    },
    {
        content: "The business banking features are exactly what we needed. Managing multiple accounts has never been easier.",
        author: "Emily Rodriguez",
        role: "CFO, TechStart Inc.",
        rating: 5,
    },
];

export const faqs = [
    {
        question: "Is my money safe with Vertex Credit Union?",
        answer: "Absolutely. We use bank-grade 256-bit SSL encryption, require OTP verification for all sensitive actions, and implement strict security rules. All data is protected by Firebase's enterprise security.",
    },
    {
        question: "How do I transfer money between accounts?",
        answer: "Simply log into your dashboard, navigate to Transfers, select your source and destination accounts, enter the amount, and verify with OTP. The transfer happens instantly.",
    },
    {
        question: "What are your savings account rates?",
        answer: "We offer competitive rates starting at 4.50% APY on savings accounts. Rates are updated monthly and you can view current rates on our rates page.",
    },
    {
        question: "Can I manage my cards from the app?",
        answer: "Yes! You can view card details (securely masked), freeze/unfreeze cards instantly, and monitor all card activity from your dashboard.",
    },
    {
        question: "Is this a real bank?",
        answer: "Vertex Credit Union is a modern digital banking platform providing secure financial services with cutting-edge technology.",
    },
];
