import React from "react";

// IMPORTANTE: Importe aqui o seu CSS global (Tailwind / Design System)
// Ajuste o caminho relativo caso o seu globals.css esteja em outro lugar:
import "../(frontend)/globals.css"; 

export default function BlockPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}