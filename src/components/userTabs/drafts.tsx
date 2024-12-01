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

const Drafts = () => {
    const [data, setData] = useState([])
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/drafts');
                console.log("Data fetched: ", response);
                setData(response.data);
            } catch (error) {
                console.log("Error in fetching data: ", error);
            }
        }
        fetchData()
    }, [])

    if (data.length == 0) {
        return <div>There is no drafts</div>
    }

    const handleClick = (slug) => {
        router.push(`/draft/${slug}`)
    };

    return (
        <div className="mt-5">
            <h1 className="text-center font-extrabold text-3xl mb-5">Drafts</h1>
            <div className="flex flex-wrap gap-5  justify-center items-center">
                {data.map((blog) => (
                    <Card key={blog._id} className="h-[20rem]  w-[20rem]" onClick={() => { handleClick(blog.slug) }}>
                        <CardHeader>
                            <CardTitle className="leading-6" ><h5>{blog.title.toUpperCase()}</h5></CardTitle>
                        </CardHeader>
                        <CardContent >
                            <div
                                dangerouslySetInnerHTML={{ __html: truncateHTML(blog.content,200) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Drafts