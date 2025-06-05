import React from "react";

export default function TestPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Test Page</h1>
          <p className="text-muted-foreground">
            This is a test page to verify styling and functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Card 1</h2>
              <p className="text-muted-foreground">
                This is a test card with Tailwind styling.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Card 2</h2>
              <p className="text-muted-foreground">
                Another test card to verify styling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
