
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Forgot Password | WriteFlow',
  description: 'This is a blog page',
}



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            { children }
        </div>
    );
}
