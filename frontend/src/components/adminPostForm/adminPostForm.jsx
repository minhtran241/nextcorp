'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { addPost } from '@/lib/action';
import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SquarePen, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { commands } from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';

// import * as commands from '@uiw/react-md-editor/commands';

const help = {
    name: 'help',
    keyCommand: 'help',
    buttonProps: { 'aria-label': 'Insert help' },
    icon: (
        <svg viewBox="0 0 16 16" width="12px" height="12px">
            <path
                d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z"
                fill="currentColor"
            />
        </svg>
    ),
    execute: (state, api) => {
        window.open('https://www.markdownguide.org/basic-syntax/', '_blank');
    },
};

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// const RichTextEditor = dynamic(
//     () => import('@/components/richtextEditor/richtextEditor'),
//     {
//         ssr: false,
//     }
// );

const AdminPostForm = ({ userId }) => {
    let [state, formAction] = useFormState(addPost, undefined);
    const [editorValue, setEditorValue] = useState('');
    const { theme } = useTheme();

    useEffect(() => {
        if (state && state.result?.status === 201) {
            document.getElementById('postForm').reset();
            setEditorValue('');
            toast.success('Post added successfully');
        }
        // Show error message by toast
        else if (state && state.error) {
            toast.error(state.error);
        }
    }, [state]);

    // check if dark mode is enabled in local storage
    // const darkMode = localStorage ? localStorage.getItem('dark') : false;

    return (
        // {/* switch the data-color-mode attribute to dark when dark */}
        <form action={formAction} className="flex flex-col gap-5" id="postForm">
            <div className="flex flex-row">
                <SquarePen className="mr-4" />{' '}
                <h1 className="mb-4 text-xl font-medium leading-none">
                    Create new blog
                </h1>
            </div>
            <input type="hidden" name="userId" value={userId.toString()} />
            <Input
                type="text"
                placeholder="Title"
                name="title"
                className="p-5"
                id="title"
            />
            <Input
                type="text"
                placeholder="Description"
                name="description"
                className="p-5"
                id="desc"
            />
            <Input
                type="text"
                placeholder="Image"
                name="thumbnail"
                className="p-5"
                id="img"
            />
            {/* <RichTextEditor
                name="content"
                value={editorValue}
                onChange={setEditorValue}
            /> */}
            <div data-color-mode={theme}>
                <input type="hidden" name="content" value={editorValue} />
                <MDEditor
                    name="content"
                    value={editorValue}
                    onChange={setEditorValue}
                    // preview="edit"
                    commands={[...commands.getCommands(), help]}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="isPublished" name="isPublished" />
                <label
                    htmlFor="isPublished"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Published
                </label>
            </div>
            <Button
                type="submit"
                className="p-5 bg-[#0033A0] text-white hover:bg-blue-800"
                disabled={state?.loading}
            >
                Submit
            </Button>
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
        </form>
    );
};

export default AdminPostForm;
