import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

function FallbackRender({ error, resetErrorBoundary }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Something went wrong!
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We apologize for the inconvenience. Our team has been notified and is working to resolve the issue.
        </p>
        <div className="mt-8">
          <Button
            onClick={() => resetErrorBoundary()}
            className="inline-flex items-center px-4 py-2"
          >
            Try again
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-sm text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}

export default FallbackRender;
