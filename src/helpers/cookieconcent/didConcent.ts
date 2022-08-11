import { getCookieConsentValue } from "react-cookie-consent";

export default function didConcent() {
  const val = getCookieConsentValue();
  if (!val || val === "false") {
    return false;
  }
  return true;
}
