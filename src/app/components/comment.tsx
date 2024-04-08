"use client"
import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import axios from "axios";

export default function Comment({comments, hide, eventId, userId} : any) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loadingCommentButton, setLoadingCommentButton] = useState(false);
  //console.log(comments);
  const onAddComment = async () => {
    setError("");
    if(input.length == 0) {
      setError("Debes escribir algo!");
      return;
    }
    setLoadingCommentButton(true);
    const response = await axios.post('/api/events/addComment', {
      comment: input,
      userId: userId,
      _id: eventId
    });
    if (response.status == 200) {
      console.log('Evento comentado con éxito');
      const index = response.data.event.comments.length - 1;
      comments.push(response.data.event.comments[index]);
    } else {
      console.error('Error al comentar evento');
    }
    setInput("");
    setLoadingCommentButton(false);
  }
  return (
    <>
        {hide && (<div>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <Input
                type="text"
                placeholder="Comenta tu opinión"
                value={input}
                className="relative max-w-xs mr-2"
                onChange={(e) => setInput(e.target.value)}
                errorMessage={error}
              />
              <Button color="warning" variant="flat" onPress={onAddComment} isLoading={loadingCommentButton} className="inline-block mt-2">
                Publicar comentario
              </Button>
          </div>

          {comments.map((c: any) => {
              return (<Input
                key={c._id}
                isReadOnly
                type="text"
                label={`${c.user.username} dice:`}
                variant="bordered"
                className="max-w-xs mt-2"
                value={c.comment}
              />)
          })}
        </div>
      )}
    </>
  )
}