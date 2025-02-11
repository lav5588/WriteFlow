'use client'

import './styles.scss'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color' // Importing the Chrome color picker
import { Button } from '../ui/button'
import {
    Bold, Brush, Code, CornerDownLeft, Eraser, FileCode, Heading1, Heading2, Heading3, Heading4, Heading5,
    Heading6, Italic, List, ListOrdered, Loader, Loader2, Minus, Palette, Quote, Redo2, Save, Send, Strikethrough, Type, Undo2
} from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useSelector} from 'react-redux'
import { useToast } from '@/hooks/use-toast'
import { RootState } from '../store/store'


interface IMenuBarProps{
    onSave: (content: string) => Promise<void>
    isUpdate: boolean
    onUpdate: (content: string) => Promise<void>
    onTogglePublish: (content:string) => Promise<void>
}

const MenuBar:React.FC<IMenuBarProps> = ({ onSave, isUpdate, onUpdate, onTogglePublish }) => {

    const { editor } = useCurrentEditor()
    const [color, setColor] = useState<string>('#000000') // Default color
    const [savingContent, setSavingContent] = useState<boolean>(false)
    const [publishingContent, setPublishingContent] = useState<boolean>(false)
    const [updatingContent, setUpdatingContent] = useState<boolean>(false)
    const {toast} = useToast()
    const isPublished = useSelector((state:RootState)=> state.blogReducer.isPublished);

    if (!editor) {
        return null
    }

    // Handler for color change
    const handleColorChange = (selectedColor: { hex: React.SetStateAction<string> }):void => {
        setColor(selectedColor.hex)
        editor.chain().setColor(selectedColor.hex.toString()).run()
    }

    const handleSave: React.MouseEventHandler<HTMLButtonElement> | undefined = async () => {
        setSavingContent(true)
        console.log("getText(): ", editor.getText())
        if (editor.getText().trim() === '') {
            console.log("Content is empty")
            toast({
                title: "Content is empty",
            })
            return
        }
        console.log("getHTML(): ", editor.getHTML())
        const formattedHTML:string = editor.getHTML().replace(/ {2,}/g, match => match.replace(/ /g, '&nbsp;')).replace(/<p><\/p>/g, '<br>');

        console.log("formatted: ", formattedHTML)

        await onSave(formattedHTML);
        setSavingContent(false)
    }
    const handleUpdate: React.MouseEventHandler<HTMLButtonElement> | undefined = async () => {
        setUpdatingContent(true)
        console.log("getText(): ", editor.getText())
        if (editor.getText().trim() === '') {
            console.log("Content is empty")
            toast({
                title: "Content is empty",
            })
            return
        }
        console.log("getHTML(): ", editor.getHTML())
        const formattedHTML:string = editor.getHTML().replace(/ {2,}/g, match => match.replace(/ /g, '&nbsp;')).replace(/<p><\/p>/g, '<br>');

        console.log("formatted: ", formattedHTML)

        await onUpdate(formattedHTML);
        setUpdatingContent(false)
    }
    const handlePublish: React.MouseEventHandler<HTMLButtonElement> | undefined = async (e) => {
        e.preventDefault(); 
        setPublishingContent(true)
        console.log("getText(): ", editor.getText())
        if (editor.getText().trim() === '') {
            console.log("Content is empty")
            toast({
                title: "Content is empty",
            })
            return
        }
        console.log("getHTML(): ", editor.getHTML())
        const formattedHTML:string = editor.getHTML().replace(/ {2,}/g, match => match.replace(/ /g, '&nbsp;')).replace(/<p><\/p>/g, '<br>');

        console.log("formatted: ", formattedHTML)
        await onTogglePublish(formattedHTML);
        setPublishingContent(false)
    }


    return (
        <div className="control-group sticky  top-0 z-10">
            <div className="button-group flex gap-1 flex-wrap">
                <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                >
                    <Bold />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                >
                    <Italic />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    variant={editor.isActive('strike') ? 'default' : 'outline'}
                >
                    <Strikethrough />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    variant={editor.isActive('code') ? 'default' : 'outline'}
                >
                    <Code />
                </Button>
                <Button onClick={() => editor.chain().focus().unsetAllMarks().run()} variant='outline'>
                    <Eraser />
                </Button>
                <Button onClick={() => editor.chain().focus().clearNodes().run()} variant='outline'>
                    <Brush />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    variant={editor.isActive('paragraph') ? 'default' : 'outline'}
                >
                    <Type />
                </Button>
                {/* Heading Buttons */}
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                >
                    <Heading1 />
                </Button>
                {/* Other heading and list Buttons... */}

                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                >
                    <Heading2 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                >
                    <Heading3 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'outline'}
                >
                    <Heading4 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    variant={editor.isActive('heading', { level: 5 }) ? 'default' : 'outline'}
                >
                    <Heading5 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    variant={editor.isActive('heading', { level: 6 }) ? 'default' : 'outline'}
                >
                    <Heading6 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                >
                    <List />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                >
                    <ListOrdered />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                >
                    <FileCode />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                >
                    <Quote />
                </Button>
                <Button onClick={() => editor.chain().focus().setHorizontalRule().run()} variant='outline'>
                    <Minus />
                </Button>
                <Button onClick={() => editor.chain().focus().setHardBreak().run()} variant='outline'>
                    < CornerDownLeft />
                </Button>
                <Popover>
                    <PopoverTrigger >
                        <Button variant='outline' asChild>
                            <div>
                                <Palette />
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <ChromePicker
                            color={color}
                            onChange={handleColorChange}
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    variant='outline'
                >
                    <Undo2 />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    variant='outline'
                >
                    <Redo2 />
                </Button>
                {!isUpdate && <Button
                    disabled={savingContent}
                    onClick={handleSave}
                >
                    {
                        savingContent ? <><Loader2 className='animate-spin' />Saving</> : <><Save />Save</>
                    }

                </Button>}
                {isUpdate && <Button
                    disabled={savingContent}
                    onClick={handleUpdate}
                >
                    {
                        updatingContent ? <><Loader2 className='animate-spin' />Updating</> : <><Save />Update</>
                    }

                </Button>}
                {!isPublished && <Button
                    disabled={publishingContent}
                    onClick={handlePublish}
                >
                    {
                        publishingContent ? <><Loader2 className='animate-spin' /> Publishing</> : <><Send />Publish</>
                    }
                </Button>}
                {isPublished && <Button
                    disabled={publishingContent}
                    onClick={handlePublish}
                >
                    {
                        publishingContent ? <><Loader2 className='animate-spin' /> UnPublishing</> : <><Send />UnPublish</>
                    }
                </Button>}
            </div>
        </div>
    )
}

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }), // TODO: this line is same as documentation but why it is given types error
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
]


interface IRichTextEditorProps{
    onSave: (content: string) => Promise<void>
    isUpdate: boolean
    onUpdate: (content: string) => Promise<void>
    onTogglePublish: (content:string) => Promise<void>
    content: string;
    isPublished: boolean;
}

const RichTextEditor:React.FC<IRichTextEditorProps> = ({ onSave, content, isUpdate, onUpdate, isPublished, onTogglePublish }) => {
    return (

        <EditorProvider slotBefore={<MenuBar
            onSave={onSave}
            isUpdate={isUpdate}
            onUpdate={onUpdate}
            // isPublished={isPublished}
            onTogglePublish={onTogglePublish}
        />} extensions={extensions} content={content}></EditorProvider>
    )
}

export default RichTextEditor;
