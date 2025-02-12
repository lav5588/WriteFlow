'use client'

import PaginationComponent from "@/components/PaginationComponent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { IBlog } from "@/types/blog"
import axios from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

export const truncateHTML = (html: string, maxLength: number): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Extract first image
    const firstImg = tempDiv.querySelector("img");
    let imgTag = "";
    if (firstImg) {
        imgTag = `<img src="${firstImg.getAttribute("src")}" alt="${firstImg.getAttribute("alt") || ""}" style= 'border-radius:8px;height:11rem;margin:auto'>`;
        imgTag += '<br>'
    }

    // Extract and truncate text
    const text = tempDiv.innerText || tempDiv.textContent || "";
    const truncatedText = text.length > maxLength ? text.substring(0, imgTag == ""?3.5*maxLength:maxLength) + "..." : text;

    return imgTag + truncatedText;
};

const Page:React.FC = () => {
    const [data, setData] = useState< IBlog[] >([])
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const [totalBlogs,setTotalBlogs] = useState<number>(0)

    const fetchData = async () => {
        try {
            const params = new URLSearchParams(searchParams)
            console.log("searchparams: ",searchParams);
            const response = await axios.get(`/api/blogs${params.toString()== ""?"":'?'+params.toString()}`);
            const data:IBlog[] = response.data.data;
            console.log("data: ",response.data);
            setTotalBlogs(parseInt(response.data.totalBlogs));
            setData(data);
        } catch (error) {
            console.log("Error in fetching data: ", error);
            toast({
                variant: "destructive",
                title:error instanceof Error ?error?.message:"Error in fetching blogs",
            })
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [searchParams])

    if (isLoading) {
        return <div className="flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin" />
                </div>
    }

    if (!data || data.length === 0) {
        return <div>There is no blogs Found</div>
    }

    const handleClick = (slug:string) => {
        router.push(`blogs/${slug}`)
    };

    return (
        <>
            <h1 className="text-center font-extrabold text-3xl mb-5">Blogs</h1>
            <div className="flex flex-wrap gap-2 md:gap-5  justify-center items-center">
                {data.map((blog) => (
                    <Card key={blog._id} className="h-[26rem]  w-[20rem]" >
                        <CardHeader>
                            <CardTitle onClick={() => { handleClick(blog.slug) }} className="leading-6 cursor-pointer" ><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            <p className="text-right"><Link href={`/u/${blog.author.username}`}>~{blog.author.username}</Link></p>
                        </CardHeader>
                        <CardContent onClick={() => { handleClick(blog.slug) }} className="cursor-pointer">
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content, 100) }}
                            />
                        </CardContent>
                    </Card>
                ))}
                {data && <PaginationComponent totalBlogs = {totalBlogs}/>}
            </div>
        </>
    )
}

export default Page