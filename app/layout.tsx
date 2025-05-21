import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],  
  display: 'swap'
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
       
      <body className={poppins.className}>{children}</body>
     
    </html>
  );
}