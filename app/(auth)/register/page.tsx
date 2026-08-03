import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Link href="/" className="mb-2 text-lg font-semibold">
                        FixItNow 🔧
                    </Link>
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>Book trusted technicians or offer your services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    );
}
