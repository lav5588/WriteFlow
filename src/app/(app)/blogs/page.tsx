'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/blogs');
                console.log("Data fetched: ", response);
                setData(response.data.data);
            } catch (error) {
                console.log("Error in fetching data: ", error);
            }
        }
        fetchData()
    }, [])

    if (!data || data.length == 0) {
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
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]" onClick={() => { handleClick(blog.slug) }}>
                        <CardHeader>
                            <CardTitle className="leading-6" ><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                            <p className="text-right">~{blog.author.username}</p>
                        </CardHeader>
                        <CardContent >
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content,200) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default Page