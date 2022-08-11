import Router from "next/router";
import QSP from "../qsp";

export default function showMsg(
  msg: string,
  type?: "error" | "warning" | "success" | "info",
  redirectTo?: string
) {
  Router.push(
    {
      pathname: redirectTo || Router.pathname,
      query: {
        ...Router.query,
        [QSP.sev]: type || "error",
        [QSP.msg]: encodeURI(msg),
      },
    },
    undefined,
    { shallow: redirectTo ? false : true }
  );
}

export function closeMsg() {
  const query = Router.query || {};
  delete query[QSP.sev];
  delete query[QSP.msg];

  Router.push(
    {
      pathname: Router.pathname,
      query,
    },
    undefined,
    { shallow: true }
  );
}
