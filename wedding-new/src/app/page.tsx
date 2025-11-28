//import BackgroundMusic from "@/_components/BackgroundMusic";
import { Footer } from "@/_components/footer";
import { Navigation } from "@/_components/navigation";
import { Toaster as Sonner } from "@/_components/ui/sonner";
import { Toaster } from "@/_components/ui/toaster";
import { TooltipProvider } from "@/_components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Casamento } from "../pages/Casamento";
import { ChaDePanela } from "../pages/ChaDePanela";
import { Contato } from "../pages/Contato";
import { Galeria } from "../pages/Galeria";
import { Home } from "../pages/Home";
import { NossaHistoria } from "../pages/NossaHistoria";
//import ConviteDownload from "../pages/ConviteDownload";
import NotFound from "../pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/casamento" element={<Casamento />} />
          <Route path="/cha-de-panela" element={<ChaDePanela />} />
          <Route path="/nossa-historia" element={<NossaHistoria />}/>
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contato" element={<Contato />} />
          {/*<Route path="/convite-download" element={<ConviteDownload />} />*/}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;