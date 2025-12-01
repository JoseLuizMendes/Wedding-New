// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Componentes de Layout e Contexto (Serão criados ou migrados)
//import { ThemeProvider } from "@/_components/ui/theme-provider"; // Client Component para Dark Mode
import { GlobalProviders } from "@/_components/global-provider"; // NOVO: Client Component para contextos

// Importe sua Navigation e Footer (assumindo que serão Client Components devido à interatividade/links)
import { Navigation } from "@/_components/navigation"; // Ajuste o caminho conforme sua estrutura
import { Footer } from "@/_components/footer"; // Ajuste o caminho conforme sua estrutura

// OTIMIZAÇÃO SEO: Defina metadados específicos para o casamento aqui!
export const metadata: Metadata = {
  title: "José & Marjorie | Nosso Casamento",
  description: "Site oficial do casamento com RSVP, Galeria e Nossa História.",
  // Use o objeto de metadados para configurar OpenGraph e SEO avançado.
};

// Viewport configuration for better mobile experience
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="antialiased"
      >
        {/* Envolve o layout em ThemeProvider para gerenciar o dark mode */}
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem={false}> */}
          {/* GlobalProviders será o "guardião" dos contextos de cliente */}
          <GlobalProviders>
            
            {/* Componentes de Layout que você tinha no seu roteador antigo */}
            <Navigation />
            
            <main>
              {children} 
            </main>
            
            <Footer />
            
          </GlobalProviders>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}