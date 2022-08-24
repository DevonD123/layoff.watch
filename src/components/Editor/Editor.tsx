import { RichTextEditor } from "@mantine/rte";
import { ToolbarControl } from "@mantine/rte/lib/components/Toolbar/controls";

function Editor({
  value,
  onChange,
  isAdmin,
}: {
  value: string;
  onChange: (value: string) => void;
  isAdmin?: boolean;
}) {
  const controlLine3: ToolbarControl[] = isAdmin
    ? ["orderedList", "unorderedList", "image"]
    : ["orderedList", "unorderedList"];
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      controls={[
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code", "h2", "h3", "h4", "h5", "h6", "link"],
        controlLine3,
        ["alignLeft", "alignCenter", "alignRight"],
      ]}
    />
  );
}

export default Editor;
