
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ username: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const username = (await params).username;
    return {
        title: `verify | ${username} | WriteFlow`,
    }
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
