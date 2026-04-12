import {
  ArrowUturnCcwLeft,
  ArrowUturnCwRight,
  Bold,
  Italic,
  Strikethrough,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  Underline,
} from "@gravity-ui/icons";
import { Button, ButtonGroup, Input } from "@heroui/react";
import { useApp } from "./AppContext";
import { useEffect, useRef } from "react";

export const Editor = () => {
  const { focused, editFocused, submitFocused } = useApp();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [focused?.offset]);

  if (!focused) return null;

  return (
    <div className="sticky bottom-0 left-0 w-screen pb-3 flex flex-col gap-1 p-3">
      <div className="flex gap-1">
        <ButtonGroup variant="outline">
          <Button className="bg-white">
            <ArrowUturnCcwLeft />
          </Button>

          <Button className="bg-white">
            <ArrowUturnCwRight />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outline">
          <Button className="bg-white">
            <Bold />
          </Button>

          <Button className="bg-white">
            <Italic />
          </Button>

          <Button className="bg-white">
            <Underline />
          </Button>

          <Button className="bg-white">
            <Strikethrough />
          </Button>
        </ButtonGroup>
        <ButtonGroup variant="outline">
          <Button className="bg-white">
            <TextAlignLeft />
          </Button>

          <Button className="bg-white">
            <TextAlignCenter />
          </Button>

          <Button className="bg-white">
            <TextAlignRight />
          </Button>

          <Button className="bg-white">
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitFocused();
        }}
      >
        <ButtonGroup variant="outline" className="w-full">
          <Input
            fullWidth
            value={focused.value}
            onChange={(e) => editFocused(e.target.value)}
            className="rounded-r-none border border-border"
            ref={ref}
          />
          <Button variant="primary">Submit</Button>
        </ButtonGroup>
      </form>
    </div>
  );
};
