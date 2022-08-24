import { showNotification, cleanNotifications } from "@mantine/notifications";

const notificationColorAdapter = {
  error: "red",
  warning: "orange",
  success: "green",
  info: "blue",
};
type notificationStatus = "error" | "warning" | "success" | "info";

export default function showMsg(
  message: string,
  type?: notificationStatus,
  title?: string
) {
  showNotification({
    message,
    title,
    color: notificationColorAdapter[type || "error"],
    autoClose: 3000,
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
