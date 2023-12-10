import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MagicProvider from '@/components/magic/MagicProvider'
import { ModalProvider } from "@/components/ui/ModalProvider";
import FormModal from "@/components/ui/FormModal";
import Header from "@/components/molecules/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crowdr",
  description: "Crowd funding app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" bg-auth-bg">
          <MagicProvider>
            <ModalProvider>
              <Header />
              <FormModal />
              {children}
            </ModalProvider>
          </MagicProvider>
        </div>
      </body>
    </html>
  );
}
