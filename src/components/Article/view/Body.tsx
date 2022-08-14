import React, { useMemo } from "react";
import DOMPurify from "dompurify";

interface Props {
  content?: string;
}

export default function ArticleBody({ content }: Props) {
  const BodyContent = useMemo(() => {
    if (!content) {
      return <div style={{ width: "100%", height: 120 }} />;
    }
    const sanatized = DOMPurify.sanitize(content);
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanatized,
        }}
      />
    );
  }, [content]);

  return BodyContent;
}
