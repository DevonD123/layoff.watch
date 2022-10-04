import React, { useState } from "react";
import CookieConsent from "react-cookie-consent";
import { useMantineTheme, MantineTheme, Text } from "@mantine/core";
import didConcent from "./didConcent";
import Script from "next/script";

type Props = {};

export default function ConcentProvider({}: Props) {
  const theme: MantineTheme = useMantineTheme();
  const [firstLoadBypass, setfirstLoadBypass] = useState(false);
  return (
    <>
      <CookieConsent
        buttonText="I accept"
        declineButtonText="I decline"
        enableDeclineButton
        disableButtonStyles
        customButtonProps={{
          style: {
            marginLeft: theme.spacing.md,
            marginRight: theme.spacing.md,
            backgroundColor:
               theme.colors.green[5],
            color:
               theme.colors.gray[1],
            border: `1px solid ${
               theme.colors.green[5]
            }`,
            cursor: "pointer",
            padding: theme.spacing.sm,
            borderRadius: theme.radius.sm,
          },
        }}
        customDeclineButtonProps={{
          style: {
            backgroundColor:
               theme.colors.red[6],
            color:
               theme.colors.gray[1],
            border: `1px solid ${
               theme.colors.red[5]
            }`,
            cursor: "pointer",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
          },
        }}
        buttonClasses="btn-hov"
        declineButtonClasses="btn-hov"
        onAccept={() => {
          setfirstLoadBypass(true);
        }}
      >
        <Text component="span">
          This website uses cookies to enhance the user experience.
        </Text>
      </CookieConsent>
      {!firstLoadBypass && didConcent() && (
        <Script
          id="analytics"
          strategy={"afterInteractive"}
          dangerouslySetInnerHTML={{
            __html: `
            (function(){console.log('loaded')})();
            `,
          }}
        />
      )}
      {firstLoadBypass && (
        <script>(function(){console.log("loaded")})();</script>
      )}
    </>
  );
}

/*

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', 'GTM-XXXXXX');

*/
