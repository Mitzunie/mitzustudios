"use client";

import Navbar from "@/components/NavBar/navbar";
import Footer from "@/components/Footer/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Navbar/>
      {children}
      <Footer/>
    </>
    );
}