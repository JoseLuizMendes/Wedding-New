// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Componentes de Layout e Contexto (Serão criados ou migrados)
//import { ThemeProvider } from "@/_components/ui/theme-provider"; // Client Component para Dark Mode
import { GlobalProviders } from "@/_components/global-provider"; // NOVO: Client Component para contextos

// Importe sua Navigation e Footer (assumindo que serão Client Components devido à interatividade/links)
import { Navigation } from "@/_components/navigation"; // Ajuste o caminho conforme sua estrutura
import { Footer } from "@/_components/footer"; // Ajuste o caminho conforme sua estrutura


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// OTIMIZAÇÃO SEO: Defina metadados específicos para o casamento aqui!
export const metadata: Metadata = {
  title: "José & Marjorie | Nosso Casamento",
  description: "Site oficial do casamento com RSVP, Galeria e Nossa História.",
  // Use o objeto de metadados para configurar OpenGraph e SEO avançado.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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