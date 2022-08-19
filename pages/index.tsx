import React, { useState } from "react";
import type { NextPage } from "next";
import ClickToEdit, { IEditToggleInputState } from "@c/Input/ClickToEdit";

const Home: NextPage = () => {
  const [inputState, setInputState] = useState<IEditToggleInputState>({
    value: "",
    isEdit: false,
    placeholder: "Title",
  });
  const [inputState2, setInputState2] = useState<IEditToggleInputState>({
    value: "",
    isEdit: false,
    placeholder: "Title",
  });

  return (
    <>
      <article style={{ width: "80%", margin: "1em auto" }}>
        <ClickToEdit
          canEdit
          showPlaceholder
          textElement={"xl"}
          setEdit={(isEdit: boolean) => {
            setInputState({ ...inputState, isEdit });
          }}
          onChange={(value: any) => setInputState({ ...inputState, value })}
          {...inputState}
        />
        <ClickToEdit
          canEdit
          showPlaceholder
          textElement={"md"}
          setEdit={(isEdit: boolean) => {
            setInputState2({ ...inputState2, isEdit });
          }}
          onChange={(value: any) => setInputState2({ ...inputState2, value })}
          {...inputState2}
        />
      </article>
    </>
  );
};

export default Home;
