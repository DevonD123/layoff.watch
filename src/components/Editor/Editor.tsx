import { RichTextEditor } from "@mantine/rte";

function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <RichTextEditor value={value} onChange={onChange} />;
}

export default Editor;
