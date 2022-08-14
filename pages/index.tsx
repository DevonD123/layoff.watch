import React, { useState, useEffect, createRef } from "react";
import type { NextPage } from "next";
import { IconButton, InputBase, Typography, useTheme } from "@mui/material";
import { Clear, Save } from "@mui/icons-material";
import Head from "next/head";
interface IInputState {
  value: any;
  isEdit?: boolean;
  placeholder?: string;
}
interface IInputProps extends IInputState {
  canEdit?: boolean;
  onChange?: (newValue: any) => void;
  textElement: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  setEdit?: (val: boolean) => void;
  showPlaceholder: boolean;
  //ref: any;
}

const Home: NextPage = () => {
  const [inputState, setInputState] = useState<IInputState>({
    value: "",
    isEdit: false,
    placeholder: "Title",
  });
  //const inputRef = createRef<any>(null);
  return (
    <>
      <article style={{ width: "80%", margin: "1em auto" }}>
        <Input
          //ref={inputRef}
          canEdit
          showPlaceholder
          textElement="h6"
          setEdit={(isEdit: boolean) => {
            setInputState({ ...inputState, isEdit });
            //inputRef?.current?.focus();
          }}
          onChange={(value: any) => setInputState({ ...inputState, value })}
          {...inputState}
        />
      </article>
    </>
  );
};

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<any, IInputProps>(
  (
    {
      value,
      isEdit,
      placeholder,
      canEdit,
      onChange,
      setEdit,
      textElement,
      showPlaceholder,
    },
    ref
  ) => {
    // const [height, setheight] = useState("auto");
    function adjustHeight(el: any) {
      // setheight(
      //   el.scrollHeight > el.clientHeight ? el.scrollHeight + "px" : "60px"
      // );
    }

    const theme = useTheme();
    if (!showPlaceholder && !value) {
      return null;
    }
    if (isEdit && canEdit) {
      return (
        <div style={{ position: "relative" }}>
          <InputBase
            fullWidth
            autoFocus
            multiline
            // wrap="soft"
            maxRows={Infinity}
            inputRef={ref}
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                return typeof setEdit === "function" ? setEdit(false) : null;
              }
              adjustHeight(e.target);
            }}
            onChange={(e) => {
              if (typeof onChange === "function") {
                console.log(e.target.value);
                onChange(e.target.value);
              }
            }}
            onFocus={(e) => e.target.select()}
            inputProps={{
              style: {
                fontSize: theme.typography[textElement].fontSize,
                fontFamily: theme.typography[textElement].fontFamily,
                fontWeight: theme.typography[textElement].fontWeight,
                lineHeight: theme.typography[textElement].lineHeight,
                letterSpacing: theme.typography[textElement].letterSpacing,
                padding: 0,
                //height: height,
                //wrap: "soft",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
              },
            }}
            onBlur={() =>
              typeof setEdit === "function" ? setEdit(false) : null
            }
            type="text"
            placeholder={placeholder}
          />
          <div style={{ position: "fixed", bottom: 25, right: 25 }}>
            <IconButton>
              <Save color="success" />
            </IconButton>
            <IconButton
              onClick={() =>
                typeof onChange === "function" ? onChange("") : null
              }
            >
              <Clear color="error" />
            </IconButton>
          </div>
        </div>
      );
    }
    if (!value) {
      return (
        <Typography
          style={{ opacity: 0.75, cursor: "pointer", whiteSpace: "unset" }}
          color="text.secondary"
          variant={textElement}
          onClick={() => {
            return canEdit && typeof setEdit === "function"
              ? setEdit(true)
              : null;
          }}
        >
          {placeholder}
        </Typography>
      );
    }
    console.log(value);
    return (
      <Typography
        variant={textElement}
        onClick={() =>
          canEdit && typeof setEdit === "function" ? setEdit(true) : null
        }
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </Typography>
    );
  }
);

export default Home;
