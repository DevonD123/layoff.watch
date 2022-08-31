import { showNotification, cleanNotifications } from "@mantine/notifications";

const notificationColorAdapter = {
  error: "red",
  warning: "orange",
  success: "green",
  info: "blue",
};
type notificationStatus = "error" | "warning" | "success" | "info";
const closeTimes = {
  short: 2000,
  normal: 3000,
  long: 5000,
  extraLong: 8000,
};
export default function showMsg(
  message: string,
  type?: notificationStatus,
  title?: SVGFESpecularLightingElement,
  autoClose?: "short" | "normal" | "long" | "extraLong"
) {
  showNotification({
    message,
    title,
    color: notificationColorAdapter[type || "error"],
    autoClose: closeTimes[autoClose || "normal"],
  });
}

export const showStatusBasedMsg = (status: number, msg?: string) => {
  showMsg(
    msg || (status >= 400 ? "Error somethign happened" : "Success"),
    status <= 300 ? "success" : "error"
  );
};

export const showFetchResult = async (
  fetchResultPreJson: any,
  onSuccessCallback?: (jsonRes: any) => void,
  onFailCallback?: (status: number, jsonRes: any) => void
) => {
  const json = await fetchResultPreJson.json();
  showStatusBasedMsg(fetchResultPreJson.status, json?.msg);
  if (fetchResultPreJson.ok) {
    if (onSuccessCallback) {
      return onSuccessCallback(json);
    }
  } else {
    if (onFailCallback) {
      return onFailCallback(fetchResultPreJson.status, json);
    }
  }
};

export function closeMsg() {
  cleanNotifications();
}
