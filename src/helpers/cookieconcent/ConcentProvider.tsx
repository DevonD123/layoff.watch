import React, { useState } from "react";
import CookieConsent from "react-cookie-consent";
import { Typography, useTheme } from "@mui/material";
import didConcent from "./didConcent";
import Script from "next/script";

type Props = {};

export default function ConcentProvider({}: Props) {
  const theme = useTheme();
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
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            border: `1px solid ${theme.palette.info.main}`,
            cursor: "pointer",
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
          },
        }}
        customDeclineButtonProps={{
          style: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            border: `1px solid ${theme.palette.error.main}`,
            cursor: "pointer",
            padding: theme.spacing(0.75),
            borderRadius: theme.shape.borderRadius,
          },
        }}
        buttonClasses="btn-hov"
        declineButtonClasses="btn-hov"
        onAccept={() => {
          setfirstLoadBypass(true);
        }}
      >
        <Typography component="span">
          This website uses cookies to enhance the user experience.
        </Typography>
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
