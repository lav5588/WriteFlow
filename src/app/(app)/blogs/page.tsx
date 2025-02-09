'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Page = () => {
    const [data, setData] = useState([])
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/blogs');
                console.log("Data fetched: ", response);
                setData(response.data.data);
            } catch (error) {
                console.log("Error in fetching data: ", error);
                toast({
                    variant: "destructive",
                    title: error?.message,
                })
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return <div className="flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin" />
                </div>
    }

    if (!data || data.length === 0) {
        return <div>There is no blogs</div>
    }

    const handleClick = (slug) => {
        router.push(`blogs/${slug}`)
    };

    return (
        <>
            <h1 className="text-center font-extrabold text-3xl mb-5">Blogs</h1>
            <div className="flex flex-wrap gap-2 md:gap-5  justify-center items-center">
                {data.map((blog) => (
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]" >
                        <CardHeader>
                            <CardTitle onClick={() => { handleClick(blog.slug) }} className="leading-6 cursor-pointer" ><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            <p className="text-right"><Link href={`/u/${blog.author.username}`}>~{blog.author.username}</Link></p>
                        </CardHeader>
                        <CardContent onClick={() => { handleClick(blog.slug) }} className="cursor-pointer">
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content, 200) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default Page