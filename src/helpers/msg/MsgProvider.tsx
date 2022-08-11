import React, { useEffect, useState } from "react";
import QSP from "../qsp";
import { useRouter } from "next/router";
import Alert, { AlertColor } from "@mui/material/Alert";
import { closeMsg } from "./msg";

function MsgProvider() {
  const [msg, setmsg] = useState("");
  const router = useRouter();
  const queryMsg = router.query[QSP.msg];
  const sev = router.query[QSP.sev];
  useEffect(() => {
    let timer: any;
    if (queryMsg) {
      setmsg(decodeURIComponent(queryMsg as string));
      timer = setTimeout(() => closeMsg(), 3000);
    }
    return () => timer && clearTimeout(timer);
  }, [queryMsg]);
  return (
    <>
      {msg && sev && (
        <Alert
          severity={sev as AlertColor}
          onClose={closeMsg}
          style={{ position: "fixed", bottom: 5, left: 5, zIndex: 9999 }}
          variant="filled"
        >
          {msg}
        </Alert>
      )}
    </>
  );
}

export default MsgProvider;
