'use client'

import PaginationComponent from "@/components/PaginationComponent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { truncateHTML } from "@/lib/truncateHtml"
import { IBlog } from "@/types/blog"
import axios from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"



const Blogs:React.FC = () => {
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
                    <Card key={blog._id} className="h-[28rem]  w-[20rem]" >
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


const Page:React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Blogs />
        </Suspense>
    )
}

export default Page