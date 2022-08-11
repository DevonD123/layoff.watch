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
    if (queryMsg) {
      setmsg(decodeURIComponent(queryMsg as string));
    }
  }, [queryMsg]);
  return (
    <>
      {msg && sev && (
        <Alert
          severity={sev as AlertColor}
          onClose={closeMsg}
          style={{ position: "fixed", bottom: 5, left: 5 }}
          variant="filled"
        >
          {msg}
        </Alert>
      )}
    </>
  );
}

export default MsgProvider;
