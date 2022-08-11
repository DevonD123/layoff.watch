import React from "react";
// import { EditorState } from "draft-js";
import { Editor, EditorState } from "react-draft-wysiwyg";
import { useTheme } from "@mui/material";

interface IProps {
  state: EditorState;
  onChange: (newState: EditorState) => void;
}

/* This is holding us back from using react 18 - lots of functionality broken with 18 */
function WSIWG(props: IProps) {
  const theme = useTheme();
  const borderColor = "rgba(0, 0, 0, 0.23)"; // theme.palette.text.secondary
  return (
    <Editor
      editorState={props.state}
      onEditorStateChange={props.onChange}
      wrapperClassName="editor-wrapper"
      editorClassName="editor-class"
      toolbarClassName="editor-toolbar-class"
      toolbarStyle={{
        backgroundColor: theme.palette.background.default,
        borderColor: borderColor,
        borderBottom: "none",
        marginBottom: 0,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
      }}
      editorStyle={{
        border: `1px solid ${borderColor}`,
        borderTopColor: "transparent",
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      }}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "list",
          "textAlign",
          "link", // custom validation added to make sure nothing bad happens
          "history",
        ],
        inline: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ["bold", "italic", "underline", "strikethrough"],
        },
        blockType: {
          inDropdown: true,
          options: [
            "Normal" /*"H1" no h1 because the title will be used for that*/,
            ,
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "Blockquote",
          ],
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
        },
        list: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ["unordered", "ordered", "indent", "outdent"],
        },
        textAlign: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ["left", "center", "right", "justify"],
        },

        link: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          popupClassName: undefined,
          dropdownClassName: undefined,
          showOpenOptionOnHover: true,
          defaultTargetOption: "_self",
          options: ["link", "unlink"],
          linkCallback: undefined,
        },

        history: {
          inDropdown: false,
          className: undefined,
          component: undefined,
          dropdownClassName: undefined,
          options: ["undo", "redo"],
        },
      }}
    />
  );
}

export default WSIWG;
