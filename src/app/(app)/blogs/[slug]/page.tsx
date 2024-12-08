'use client'

import { Card } from "@/components/ui/card";
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import '@/components/RichtextEditor/styles.scss';



const Page = () => {
    const params = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/api/blogs/${params.slug}`)
                const data = response.data;
                setBlog(data)
                console.log("blog: ", response);
            } catch (error) {
                console.log("error in fetching blog: ", error);
            }
        }
        fetchBlog()

    }, [params.slug])

    return (
        <div className="flex justify-center">
            <Card className="w-[60vw]  leading-7 min-w-[20rem] p-5">
                {blog && <h1 className="text-3xl text-center text-cyan-500 mb-5">{blog.title.toUpperCase()}</h1>}
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