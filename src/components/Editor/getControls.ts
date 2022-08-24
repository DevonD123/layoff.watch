// import { ToolbarControl } from "@mantine/rte/lib/components/Toolbar/controls";
export default function getControls(isAdmin?: boolean) {
  return [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code", "h2", "h3", "h4", "h5", "h6", "link"],
    isAdmin
      ? ["orderedList", "unorderedList", "image"]
      : ["orderedList", "unorderedList"],
    ["alignLeft", "alignCenter", "alignRight"],
  ];
}
