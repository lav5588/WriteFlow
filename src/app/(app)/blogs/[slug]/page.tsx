'use client'

import { Card } from "@/components/ui/card";
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import '@/components/RichtextEditor/styles.scss';
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";



const Page = () => {
    const params = useParams();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/api/blogs/${params.slug}`)
                const data = response.data;
                setBlog(data)
                console.log("blog: ", response);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: error?.message,
                })
                console.log("error in fetching blog: ", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBlog()

    }, [params.slug])

    return (
        <div className="flex justify-center">
            <Card className="md:w-[60vw] w-[98vw]  leading-7 min-w-[20rem] p-5">
                <div className="flex justify-center items-center">
                    {isLoading && <Loader2 className="h-10 w-10 animate-spin" />}
                </div>
                {blog && <h1 className="text-3xl text-center text-cyan-500 mb-5">{blog.title.toUpperCase()}</h1>}
                {blog && <p className="text-right"><Link href={`/u/${blog.author.username}`} className="cursor-pointer">~{blog.author.username}</Link></p>}
                {blog && (
                    <div
                        className="whitespace-pre-wrap break-words content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                )}

            </Card>
        </div>
    )
}

export default Page