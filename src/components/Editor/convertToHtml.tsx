import { convertToHTML as oldConvertToHtml } from "draft-convert";
import { ContentState } from "draft-js";

// Repeated on server side for saving
const urlRegex =
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
export const isValidURl = (url: string) => !!urlRegex.test(url);
const preRedirectAppend = (url: string) => `/redirectout?to=${encodeURI(url)}`;
const extractStyles = (data: any) => {
  const styles: any = {};
  if (data["text-align"]) {
    styles["textAlign"] = data["text-align"];
    styles.display = "block";
  }
  return styles;
};
const convertToHtml = (state: ContentState, isAdminCreated: boolean) => {
  return oldConvertToHtml({
    styleToHTML: (style) => {
      if (style === "STRIKETHROUGH") {
        return <span style={{ textDecoration: "line-through" }} />;
      }
    },
    blockToHTML: (block) => {
      if (!block.text) {
        return <br />;
      }
      if (block.type === "unstyled") {
        return <p style={extractStyles(block.data)} />;
      }
      if (block.type === "header-one") {
        return <h1 style={extractStyles(block.data)} />;
      }
      if (block.type === "header-two") {
        return <h2 style={extractStyles(block.data)} />;
      }
      if (block.type === "header-three") {
        return <h3 style={extractStyles(block.data)} />;
      }
      if (block.type === "header-four") {
        return <h4 style={extractStyles(block.data)} />;
      }
      if (block.type === "header-five") {
        return <h5 style={extractStyles(block.data)} />;
      }
      if (block.type === "header-six") {
        return <h6 style={extractStyles(block.data)} />;
      }
      if (block.type === "blockquote") {
        return <blockquote style={extractStyles(block.data)} />;
      }
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === "LINK") {
        if (isValidURl(entity.data.url)) {
          return (
            <a
              target="__blank"
              rel={`${!isAdminCreated ? "ugc," : ""}nofollow`}
              href={preRedirectAppend(entity.data.url)}
            >
              {originalText}
            </a>
          );
        }
      }

      return originalText;
    },
  })(state);
};
export default convertToHtml;
