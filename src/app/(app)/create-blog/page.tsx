'use client'
import RichTextEditor from "@/components/RichtextEditor/richTextEditor"
import { setId, setIsPublished } from "@/components/store/slices/blogSlice"
import { RootState } from "@/components/store/store"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { blogSchema } from "@/schemas/blogSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import React, { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"



interface ICreateBlogProps {
    title?: string;
    slug?: string;
    content?: string;
    isUpdate?: boolean;
    id?: string | null;
}

type BlogFormData = z.infer<typeof blogSchema>;

const CreateBlog: React.FunctionComponent<ICreateBlogProps> = ({ title = '', slug = '', content = 'Whats on your mind', isUpdate = false, id = null }) => {


    const dispatch = useDispatch();
    const { toast } = useToast();
    const blogId = useSelector((state: RootState) => state.blogReducer.id);
    const isPublished = useSelector((state: RootState) => state.blogReducer.isPublished);


    useEffect(() => {
        dispatch(setId(id));
        dispatch(setIsPublished(isPublished));
        return () => {
            console.log('unmounted')
            dispatch(setId(null));
            dispatch(setIsPublished(false));
        }
    }, [dispatch])


    const slugValidation = z
        .string()
        .min(5, 'slug must be at least 5 characters')
        .refine(async (slug) => {
            try {
                const response = await axios.get(`/api/check-slug-unique?slug=${slug}?id=${id}`);
                console.log("response: ", response);

                return response.data.success;
            } catch (error) {
                console.log("Error checking slug: ", error);
                return false;  // Consider returning false if the API call fails
            }
        }, {
            message: 'slug is already taken',
        });

    const updateBlogSchema = z.object({
        title: z.string().min(5, 'title should be atleast 5 characters'),
        content: z.string(),
        slug: slugValidation,
        isPublished: z.boolean(),
    })

    const form = useForm<BlogFormData>({
        resolver: zodResolver(isUpdate ? updateBlogSchema : blogSchema),
        defaultValues: {
            title,
            slug,
            isPublished,
        }
    })

    const slugGenerate = () => {
        console.log('slugGenerate');
        const slug = form.getValues().title.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, '-')
        console.log('slug', slug)
        form.setValue('slug', slug)
        form.clearErrors()
    }

    const onUpdate = async (content: string) => {
        const data = { ...form.getValues(), content: content, isPublished: isPublished };
        console.log("data:", data);
        try {
            const isValid = await updateBlogSchema.parseAsync(data);
            //save the isvalid data to db
            const response = await axios.post('/api/update-blog', { ...isValid, id });
            console.log("response: ", response);
            if (!response) {
                console.log('Error updating blog data', response);
                toast({
                    variant: "destructive",
                    title: "Error updating blog data",
                });
                return;
            }

            toast({
                title: "Blog updated successfully",
            });
            return response;

        } catch (error: unknown) {
            console.log('Error', error);
            try {
                if (typeof error === 'string') {
                    const Error = JSON.parse(error) as { path: string[]; type: string; message: string }[];
                    Error.forEach((err) => {
                        const fieldName = err.path[0] as keyof z.infer<typeof blogSchema>;
                        if (fieldName in form.getValues()) { // Ensure it's a valid form field
                            form.setError(fieldName, {
                                type: err.type,
                                message: err.message,
                            });
                        }
                    })
                } else if (error instanceof Error && error.message) {
                    console.log("Standard Error:", error.message);
                }

            }
            catch (err: unknown) {
                console.log('error: ', err);
            }
            console.log('Error', error);

            toast({
                variant: "destructive",
                title: "Error updating blog data",
                description: error instanceof Error ? error.message : 'Error in updating blog data',
            });
        }

    };

    const onSave = async (content: string) => {
        const data = { ...form.getValues(), content: content, isPublished }
        try {
            if (!id) {
                id = blogId;
            }
            if (id) {
                const response = await onUpdate(content)
                return response;
            }
            const isValid = await blogSchema.parseAsync(data);
            //save the isvalid data to db
            const response = await axios.post('/api/save-blog', isValid);
            console.log("response: ", response);
            if (!response) {
                console.log('Error saving blog data', response);
                toast({
                    variant: "destructive",
                    title: "Error saving blog data",
                });
                return;
            }
            console.log("response: ", response);
            id = response.data.data._id;
            dispatch(setId(id));
            console.log("id:", id);
            toast({
                title: "Blog saved successfully",
            });
            return response;
        } catch (error: unknown) {

            try {
                if (typeof error === "string") {
                    const Error = JSON.parse(error) as { path: string[]; type: string; message: string }[];
                    Error.forEach((err) => {
                        const fieldName = err.path[0] as keyof z.infer<typeof blogSchema>;
                        form.setError(fieldName, {
                            type: err.type,
                            message: err.message,
                        });
                    })
                } else if (error instanceof Error && error.message) {
                    console.log("Standard Error:", error.message);
                }

            }
            catch (err: unknown) {
                console.log("error: ", err);
            }

            console.log('Error', error);

            toast({
                variant: "destructive",
                title: "Error saving blog data",
                description: error instanceof Error ? error.message : 'Error while saving the blog',
            });
        }



    }



    const onTogglePublish = async (content: string) => {
        try {
            // console.log("hello");
            console.log("id: ", id)
            console.log("blogId: ", blogId);
            if (!id) {
                id = blogId
            }
            if (!id) {
                await onSave(content);
            }
            else {
                await onUpdate(content);
            }
            console.log("id: ", id)
            const response = await axios.get('/api/publish', { params: { id } });
            console.log("id: ", id)
            if (!response) {
                console.log('Error publishing blog', response);
                toast({
                    variant: "destructive",
                    title: "Error publishing blog",
                });
                return;
            }
            console.log(response)
            dispatch(setIsPublished(response?.data.data.isPublished));
            console.log("id: ", id)
            console.log('published', response?.data.data.isPublished);
            console.log(`Blog ${response?.data.data.isPublished ? 'published' : 'unpublished'} successfully`, response);
            console.log("id: ", id)
            toast({
                title: `Blog ${response?.data.data.isPublished ? 'published' : 'unpublished'} successfully`,
            });
        }
        catch (err: unknown) {
            console.log(err);
            toast({
                variant: "destructive",
                title: "Error publishing blog",
                description: err instanceof Error ? err.message : 'Error on toggling the publish blog',
            });
        }
    }

    return (
        <div className="flex justify-center">
            <div className="md:w-[70%] w-[95%]">
                <h1>Write Your Blog</h1>
                <div className="mb-5">
                    <Form {...form} >
                        <form className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter the title of Your Blog"  {...field} onChange={(e) => {
                                                field.onChange(e);
                                                slugGenerate();
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Update Your Slug If it is not unique" {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    form.clearErrors()
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <Button type="submit">Submit</Button> */}
                        </form>
                    </Form>
                </div>
                <RichTextEditor onSave={onSave} content={content} isUpdate={isUpdate} onUpdate={onUpdate} isPublished={isPublished} onTogglePublish={onTogglePublish} />
            </div>

        </div>
    )
}

export default CreateBlog