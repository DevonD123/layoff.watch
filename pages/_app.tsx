import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { CacheProvider, EmotionCache, useTheme } from "@emotion/react";
import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import theme from "../src/helpers/theme";
import createEmotionCache from "../src/helpers/createEmotionCache";
import { ConcentProvider, didConcent } from "@h/cookieconcent";
import { QueryClientProvider } from "@h/db/helper";
import { MantineProvider, useMantineTheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ThemeProvider } from "@emotion/react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const Comp = Component as any;
  didConcent();
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider>
        <UserProvider supabaseClient={supabaseClient}>
          <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <StyledProvider>
              <NotificationsProvider>
                <ConcentProvider />
                <Comp {...pageProps} />
              </NotificationsProvider>
            </StyledProvider>
          </MantineProvider>
        </UserProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

const StyledProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const theme = useMantineTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
