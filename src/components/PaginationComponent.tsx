import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";


const PaginationComponent = ({ totalBlogs}: { totalBlogs: number }) => {

    const {toast} = useToast()
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageno = searchParams.get('pageno') || 1;
    const pagesize = searchParams.get('pagesize') || 10;

    let arr = [-2, -1, 0, 1, 2];

    useEffect(() => {
        console.log("totalBlogs: ", totalBlogs);
        
    });

    const handleClick = (pageno:number) => {
        if(pageno < 1 || pageno > Math.ceil(totalBlogs/Number(pagesize))){
            toast({
                title: "Invalid page number",
                variant: "destructive"
            })
            return;
        }
        const params = new URLSearchParams(searchParams);
        params.set('pageno', pageno.toString());
        params.set('pagesize', pagesize.toString());
        router.push('?'+params)
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem onClick={()=>handleClick(Number(pageno) - 1)}>
                    <PaginationPrevious/>
                </PaginationItem>
                <PaginationItem>
                {Number(pageno) > 3 && <PaginationEllipsis />}
                </PaginationItem>
                {arr.map((item, index) => (
                    <PaginationItem key={index} onClick={()=>{handleClick(item + Number(pageno))}}>
                        {(item + Number(pageno) > 0 && item + Number(pageno) <= Math.ceil(totalBlogs/Number(pagesize))) 
                        &&<PaginationLink 
                        isActive={item + Number(pageno) == Number(pageno)}>
                            {item + Number(pageno)}
                            </PaginationLink>}
                    </PaginationItem>
                ))}
                <PaginationItem >
                    {Math.ceil(totalBlogs/Number(pagesize)) - 3 >= Number(pageno) && <PaginationEllipsis />}
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext onClick={()=>handleClick(Number(pageno) + 1)}/>
                </PaginationItem>
                

            </PaginationContent>

        </Pagination>
    )
}

export default PaginationComponent;