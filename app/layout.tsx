import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/contexts/I18nContext";
import TranslationGuard from "@/components/UI/TranslationGuard/translation-guard";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],  
  display: 'swap',
  variable: '--font-poppins',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "The Rings Method",
  description: "Created by Saucotec Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">

      {/*<Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>*/}
       
      <body className={`${poppins.variable} ${montserrat.variable} ${poppins.className}`}>
        <I18nProvider>
          <TranslationGuard>
            {children}
          </TranslationGuard>
        </I18nProvider>
      </body>
     
    </html>
  );
}