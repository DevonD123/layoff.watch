import React from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import showMsg from "../msg";
import QSP from "../qsp";

type QProps = {
  children?: React.ReactNode;
};

export function handleVisible(response: any) {
  if (response.error) {
    if (response.error === "string") {
      showMsg(response.error, "error");
    }
    throw response.error;
  }
  if (response.data?.[QSP.msg] && response.data?.[QSP.sev]) {
    showMsg(response.data?.[QSP.msg], response.data?.[QSP.sev]);
  }
  return response.data;
}

export function handleNonVisible(response: any) {
  if (response.error) {
    throw response.error;
  }
  return response.data;
}

export function handleVisibleGenericErr(response: any) {
  if (response.error) {
    showMsg("Something went wrong please try again later.", "error");
    throw response.error;
  }
  return response.data;
}

export const client = new QueryClient();

export function QueryClientProvider({ children }: QProps) {
  return (
    <QueryClientProviderBase client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProviderBase>
  );
}
