"use client";

import { useState } from "react";
import { Gift, Search, Filter, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const grants = [
    {
        id: 1,
        name: "Small Business Growth Grant",
        amount: "$50,000",
        deadline: "Dec 31, 2024",
        category: "Business",
        description: "Support for small businesses looking to expand operations",
        eligibility: "Must have been in business for at least 2 years",
        status: "open"
    },
    {
        id: 2,
        name: "Education Excellence Grant",
        amount: "$10,000",
        deadline: "Jan 15, 2025",
        category: "Education",
        description: "Financial assistance for continuing education and professional development",
        eligibility: "Must be enrolled in an accredited program",
        status: "open"
    },
    {
        id: 3,
        name: "Green Energy Initiative",
        amount: "$25,000",
        deadline: "Feb 28, 2025",
        category: "Environment",
        description: "Funding for renewable energy projects and sustainability initiatives",
        eligibility: "Must demonstrate environmental impact",
        status: "open"
    },
    {
        id: 4,
        name: "Community Development Fund",
        amount: "$100,000",
        deadline: "Mar 31, 2025",
        category: "Community",
        description: "Support for community improvement and development projects",
        eligibility: "Must benefit local community",
        status: "open"
    }
];

export default function GrantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedGrant, setSelectedGrant] = useState<number | null>(null);

    const filteredGrants = grants.filter(grant => {
        const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            grant.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || grant.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (selectedGrant) {
        const grant = grants.find(g => g.id === selectedGrant);
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setSelectedGrant(null)} className="gap-2">
                    ← Back to Grants
                </Button>

                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{grant?.name}</h2>
                        <p className="text-purple-100 mb-4">{grant?.description}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-purple-100 text-sm">Grant Amount</p>
                                <p className="text-xl font-bold">{grant?.amount}</p>
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm">Deadline</p>
                                <p className="text-xl font-bold">{grant?.deadline}</p>
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm">Category</p>
                                <p className="text-xl font-bold">{grant?.category}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Eligibility Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-600 dark:text-gray-400">{grant?.eligibility}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Application Form</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Organization/Individual Name</label>
                            <Input placeholder="Enter name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Description</label>
                            <textarea
                                className="w-full min-h-32 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                                placeholder="Describe your project and how you plan to use the grant..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Requested Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <Input type="number" placeholder="0.00" className="pl-8" />
                            </div>
                        </div>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            Submit Application
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Gift className="h-6 w-6 text-purple-600" />
                    Grants & Funding
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Discover available grants and funding opportunities
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search grants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                    <option value="all">All Categories</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="environment">Environment</option>
                    <option value="community">Community</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                            <Gift className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{grants.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Available Grants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$185K</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Funding</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">45</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Days Left</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGrants.map((grant) => (
                    <Card key={grant.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedGrant(grant.id)}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-2">{grant.name}</CardTitle>
                                    <CardDescription>{grant.description}</CardDescription>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                                    Open
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                                    <p className="font-semibold text-purple-600">{grant.amount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{grant.deadline}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-1">Category</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{grant.category}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredGrants.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No grants found matching your criteria</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
