import { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

let currentRaw: string

export function TextEditor({ value, onChange, ...props }: any) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const onEditorStateChange = (est: EditorState) => {
        setEditorState(est)
        if (onChange) {
            const html = draftToHtml(convertToRaw(est.getCurrentContent()))
            currentRaw = html
            onChange(html.trim() === "<p></p>" ? "" : html)
        }
    }

    useEffect(() => {
        if (currentRaw !== value) {
            const blocksFromHtml = htmlToDraft(value || "");
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const nst = EditorState.createWithContent(contentState);
            setEditorState(nst)
        }
        return () => {
        }
    }, [value])

    const wrapperClassName = `${props.wrapperClassName || "text-editor-wrapper border"} ${props.isInvalid ? "is-invalid" : ""} ${props.readOnly ? "readonly" : ""}`

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName={wrapperClassName}
            editorClassName="text-editor-editor"
            toolbarClassName="text-editor-toolbar"
            {...props}
        />
    )
}
