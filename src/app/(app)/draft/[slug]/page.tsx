'use client'

import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import CreateBlog from "../../create-blog/page";
import { useDispatch } from "react-redux";
import { setIsPublished } from "@/components/store/slices/blogSlice";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { IBlog } from "@/types/blog";


const Page: React.FC = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const [data, setData] = useState<IBlog | null>(null)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/drafts/${params.slug}`);
        if (!response) {
          console.log("No draft found with this slug");
          toast({
            variant: "destructive",
            title: "No draft found with this slug",
          })
          return;
        }
        const resData: IBlog = response.data;
        setData(resData)
        dispatch(setIsPublished(resData.isPublished));
        console.log("Fetched draft: ", response.data);

      }
      catch (error: unknown) {
        console.log("Error fetching blog: ", error);
        toast({
          variant: "destructive",
          title: "Error fetching blog",
          description: error instanceof Error ? error.message : "Error occur while fetching the blog",
        })
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchData();
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  }

  if (!data) {
    return <div>Blogs not found</div>  // Show loading state while data is being fetched
  }

  return (
    <div>
      <CreateBlog title={data.title} slug={data.slug} content={data.content} isUpdate={true} id={data._id} />
    </div>
  )
}



export default Page