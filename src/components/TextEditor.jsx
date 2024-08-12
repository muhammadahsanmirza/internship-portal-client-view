import {
    ClassicEditor,
    Context,
    ContextWatchdog,
    Heading,
    Essentials,
    Bold,
    Italic,
    Link,
    Image,
    ImageInsert,
    Table,
    TableToolbar,
    MediaEmbed, 
    BlockQuote,
    List,
    Indent,    
    IndentBlock
} from "ckeditor5";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";

import "ckeditor5/ckeditor5.css";

function TextEditor() {
    return (
        <CKEditorContext context={Context} contextWatchdog={ContextWatchdog}>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    plugins: [
                        Essentials,
                        Heading,
                        Bold,
                        Italic,
                        Link,
                        List,  // Ensure List is before Indent and IndentBlock
                        Indent,
                        IndentBlock,
                        Image, 
                        ImageInsert,
                        Table,
                        TableToolbar,
                        BlockQuote,
                        MediaEmbed, 
                    ],
                    toolbar: [
                        "undo",
                        "redo",
                        "|",
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "|",
                        "link",
                        "insertImage",
                        "insertTable",
                        "blockQuote",
                        "mediaEmbed", 
                        "|",
                        "bulletedList",  // Use 'bulletedList' for bullet list
                        "numberedList",  // Use 'numberedList' for number list
                        "|",
                        "outdent", 
                        "indent",
                    ],
                }}
                data=""
                onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                }}
            />
        </CKEditorContext>
    );
}

export default TextEditor;
