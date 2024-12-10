'use client'

import RichTextEditor from "@/components/RichtextEditor/richTextEditor"
import { setIsPublished } from "@/components/store/slices/blogSlice"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { blogSchema } from "@/schemas/blogSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Save } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"






const CreateBlog: React.FunctionComponent = ({ title = '', slug = '', content = 'Whats on your mind', isUpdate = false, id = null }) => {


    const dispatch = useDispatch();
    const isPublished = useSelector(state => state.blogReducer.isPublished);

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

    const form = useForm<z.infer<typeof blogSchema>>({
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

    const onSave = async (content) => {
        const data = { ...form.getValues(), content: content, isPublished }
        try {
            const isValid = await blogSchema.parseAsync(data);
            //save the isvalid data to db
            const response = await axios.post('/api/save-blog', isValid);
            console.log("response: ", response);
            if (!response) {
                console.log('Error saving blog data', response);
                return;
            }
            return response;
            console.log('isValid: ', isValid);
        } catch (error) {

            try {
                const Error = JSON.parse(error)
                Error.forEach((err) => {
                    form.setError(err.path[0], {
                        type: err.type,
                        message: err.message,
                    });
                })

            }
            catch (err) {
                console.log(err);
            }

            console.log('Error', error);
        }

    }

    const onUpdate = async (content) => {
        const data = { ...form.getValues(), content: content,isPublished:isPublished };
        console.log("data:",data);
        try {
            const isValid = await updateBlogSchema.parseAsync(data);
            //save the isvalid data to db
            const response = await axios.post('/api/update-blog', { ...isValid, id });
            console.log("response: ", response);
            if (!response) {
                console.log('Error updating blog data', response);
                return;
            }
            console.log('isValid: ', isValid);
        } catch (error) {
            console.log('Error', error);
            try {
                const Error = JSON.parse(error)
                Error.forEach((err) => {
                    form.setError(err.path[0], {
                        type: err.type,
                        message: err.message,
                    });
                })

            }
            catch (err) {
                console.log(err);
            }

            console.log('Error', error);
        }

    };

    const onTogglePublish = async (content) => {
        try {
            // console.log("hello");
            console.log(id)
            if(!id){
                const res = await onSave(content);
                id = res?.data.data._id;
                console.log("id: ",res.data.data._id);
            }
            else{
                await onUpdate(content);
            }
            const response = await axios.get('/api/publish', {  params: { id } });
            if (!response) {
                console.log('Error publishing blog', response);
                return;
            }
            dispatch(setIsPublished(response?.data.data.isPublished));
            console.log('published', isPublished);
            console.log(`Blog ${isPublished?'published':'unpublished'} successfully`, response);

        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-[60%]">
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
                                            <Input placeholder="shadcn"  {...field} onChange={(e) => {
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
                                            <Input placeholder="shadcn" {...field}
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
                <RichTextEditor onSave={onSave} content={content} isUpdate={isUpdate} onUpdate={onUpdate} isPublished = {isPublished} onTogglePublish = {onTogglePublish}/>
            </div>

        </div>
    )
}

export default CreateBlog