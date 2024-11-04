/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { Button } from "@mantine/core";

function ErrorFallback({ error, resetErrorBoundary }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="max-w-md text-center">
        <TbAlertTriangleFilled
          className="mx-auto h-24 w-24 text-destructive"
          aria-hidden="true"
          style={{ color: "#ab0f0f" }}
        />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Something went wrong!
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We apologize for the inconvenience. Our team has been notified and is
          working to resolve the issue.
        </p>

        {error?.message && (
          <p className="mt-4 text-sm text-destructive">
            <strong>Error Details:</strong> {error.message}
          </p>
        )}
        
        <div className="mt-8">
          <Button
            variant="filled"
            color="#22c55e" // Use a hex color value
            size="md"
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-4 py-2"
          >
            Try again
          </Button>
        </div>
        {error && error?.digest && (
          <p className="mt-4 text-sm text-muted-foreground">
            Error ID: {error?.digest}
          </p>
        )}
      </div>
    </main>
  );
}

export default ErrorFallback;
