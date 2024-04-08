"use client"
import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";

export default function Comment({comments} : any) {
  const [input, setInput] = useState("");
  console.log(comments);
  const onAddComment = () => {

  }
  return (
    <>
        <div>
            <Input
              type="text"
              placeholder="Comenta"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {comments.forEach((c: any) => {
                <Input
                  isReadOnly
                  type="text"
                  label={c.user.username}
                  variant="bordered"
                  defaultValue="junior@nextui.org"
                  className="max-w-xs"
                />
            })}
            <div className="reply comment" onClick={onAddComment}>

            </div>
        </div>
    </>
  )
}