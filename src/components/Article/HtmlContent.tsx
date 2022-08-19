import React, { useEffect, useRef } from "react";
import { TypographyStylesProvider } from "@mantine/core";

export default function HtmlContent({ html }: { html?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      const origin = e.target.closest(`a`);

      if (origin) {
        console.clear();
        console.log(`You clicked ${origin.href}`);
        const didAccept = window.confirm(
          `Are you sure you want to openthis url? ${origin.href}`
        );
        if (didAccept && typeof window !== "undefined" && origin?.href) {
          window.open(origin.href, "_blank").focus();
        }
      }
    };

    if (divRef.current) {
      divRef.current.addEventListener(`click`, handler);
    }

    return () => divRef.current?.removeEventListener(`click`, handler);
  }, []);
  return (
    <TypographyStylesProvider>
      <div
        ref={divRef}
        id="#content"
        dangerouslySetInnerHTML={{ __html: html || "" }}
      />
    </TypographyStylesProvider>
  );
}
