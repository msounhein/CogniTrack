import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">CogniTrack</h1>
          <p className="text-muted-foreground">Keep on track with your tasks and notes.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Create and manage your markdown notes.</p>
              <Link 
                href="/notes/welcome" 
                className={buttonVariants({ className: "w-full" })}
              >
                Go to Welcome Note
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-all">
            <CardHeader>
              <CardTitle>Global Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">View all extracted tasks from your notes.</p>
              <Link 
                href="/tasks" 
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                View Task Dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
