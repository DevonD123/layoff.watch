import React, { useState } from "react";
import { Text, Button, Container, Drawer, Textarea } from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import showMsg from "@h/msg";

interface Props {
  type: "layoff" | "company" | "csuit" | "position";
  id: string;
}

export default function ReportButton({ type, id }: Props) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState("");

  async function handleSave() {
    if (!info) {
      return showMsg(
        "Please add a reason/some information about why you are reporting this.",
        "error"
      );
    }
    const { error } = await supabaseClient.from("report").insert(
      {
        report_id: id,
        type,
        info,
      },
      { returning: "minimal" }
    );
    if (error) {
      console.error(error);
      return showMsg("Something happened please try again", "error");
    }
    showMsg(
      "success, thank you for your feedback we will look into this ASAP",
      "success"
    );
    setInfo("");
    setOpen(false);
  }
  return (
    <div style={{ margin: "5px auto", width: "100%", maxWidth: 300 }}>
      <Button color="red" fullWidth onClick={() => setOpen(true)}>
        Report{" "}
      </Button>
      <Drawer
        position="bottom"
        opened={open}
        onClose={() => setOpen(false)}
        title={<Text style={{ paddingLeft: 5 }}>Report</Text>}
      >
        <Container>
          <Textarea
            label="Why are you reporting?"
            description="Let us know what is wrong with this post, any information is appreciated."
            placeholder="info"
            required
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
          <Button
            color="red"
            onClick={handleSave}
            disabled={!info}
            style={{ marginTop: 5 }}
          >
            Submit
          </Button>
        </Container>
      </Drawer>
    </div>
  );
}
