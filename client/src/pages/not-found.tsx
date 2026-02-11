import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-2 border-red-100 shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 font-display uppercase">404 Error</h1>
          <p className="text-gray-500 mb-8 font-medium">The page you are looking for has been consumed.</p>
          
          <Link href="/" className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full uppercase tracking-wider shadow-lg shadow-primary/20">
            Return Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
