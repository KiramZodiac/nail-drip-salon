
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 w-full h-[160px] overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-nail-pink/600 to-nail-lavender/60"></div>
           {/* <img 
            src="/public/nails.jpeg" 
            alt="Nail art background" 
            className="w-full h-full object-cover object-center opacity-40"
          />  */}
        </div>
        <Navbar />
      </div>
      <main className="flex-grow ">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
