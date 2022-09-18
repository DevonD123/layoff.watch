import React, { useState } from "react";
import {
  Button,
  Container,
  Drawer,
  Textarea,
  TextInput,
  Text,
} from "@mantine/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import showMsg from "@h/msg";

interface Props {
  type: "layoff" | "company" | "csuit" | "position";
  id: string;
}

export default function MoreInfoButton({ type, id }: Props) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState("");
  const [from_email, setFromEmail] = useState("");

  async function handleSave() {
    if (!info) {
      return showMsg("Please fill out the information text field.", "error");
    }
    const { error } = await supabaseClient.from("more_info").insert({
      info_id: id,
      type,
      info,
      from_email,
    });
    if (error) {
      console.error(error);
      return showMsg("Something happened please try again", "error");
    }
    showMsg("success, thank you for your feedback we will look into this ASAP");
    setInfo("");
    setFromEmail("");
    setOpen(false);
  }
  return (
    <div style={{ margin: "5px auto", width: "100%", maxWidth: 300 }}>
      <Button fullWidth onClick={() => setOpen(true)}>
        Submit some more info
      </Button>
      <Drawer
        position="bottom"
        opened={open}
        onClose={() => setOpen(false)}
        title={
          <Text style={{ paddingLeft: 5 }}>
            Help us keep info up to date and accurate
          </Text>
        }
      >
        <Container>
          <Textarea
            label="Anything we should know goes here :)"
            placeholder="info"
            required
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
          <TextInput
            label="email"
            type="email"
            description="optional but will help us if we need to get in contact about further details"
            placeholder="example@example.com"
            value={from_email}
            onChange={(e) => setFromEmail(e.target.value)}
          />
          <Button
            color="cyan"
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
