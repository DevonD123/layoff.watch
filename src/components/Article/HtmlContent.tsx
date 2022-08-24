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
          `Are you sure you want to openthis url we can not verify if it is safe or not? ${origin.href}`
        );
        if (
          didAccept &&
          window &&
          typeof window.open &&
          origin &&
          origin.href
        ) {
          const res = window.open(origin.href, "_blank");
          if (res) {
            res.focus();
          }
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
