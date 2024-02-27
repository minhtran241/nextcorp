'use client';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ name, value, onChange }) => {
    return (
        <div className="">
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
                        ],
                        ['link'],
                        ['clean'],
                    ],
                }}
                formats={[
                    'header',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'indent',
                    'link',
                ]}
                // className="h-[150px]"
                name={name}
                id="body"
            />
            <input type="hidden" name={name} value={value} />
        </div>
    );
};

export default RichTextEditor;
