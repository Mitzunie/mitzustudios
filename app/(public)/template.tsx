"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar/navbar";
import Footer from "@/components/Footer/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar/>
      {children}
      <Footer/>
    </>
    );
}