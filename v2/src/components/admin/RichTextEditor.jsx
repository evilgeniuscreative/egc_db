import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

function RichTextEditor({ value, onChange, height = 500 }) {
    const editorRef = useRef(null);

    return (
        <Editor
            apiKey="no-api-key"
            onInit={(evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={onChange}
            init={{
                height: height,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | code | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                code_dialog_height: 500,
                code_dialog_width: 800,
            }}
        />
    );
}

export default RichTextEditor;
