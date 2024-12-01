'use client'

import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import CreateBlog from "../../create-blog/page";


const Page = () => {
  const params = useParams();
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/drafts/${params.slug}`);
        if (!response) {
          console.log("No draft found with this slug");
          return;
        }
        setData(response.data)
        console.log("Fetched draft: ", response.data);

      }
      catch (error) {
        console.log("Error fetching blog: ", error);
      }
    }
    fetchData();
  }, [])


  if (!data) {
    return <div>Blogs not found</div>  // Show loading state while data is being fetched
  }

  return (
    <div>
      <CreateBlog title={data.title} slug={data.slug} content={data.content} isUpdate={true} id = {data._id}/>
    </div>
  )
}

export default Page