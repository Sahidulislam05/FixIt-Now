import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Link href="/" className="mb-2 text-lg font-semibold">
                        FixItNow 🔧
                    </Link>
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Log in to book a technician or manage your services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
