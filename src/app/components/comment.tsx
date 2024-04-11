"use client"
import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import axios from "axios";

export default function Comment({comments, hide, eventId, userId} : any) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loadingCommentButton, setLoadingCommentButton] = useState(false);
  const [loadingEditButton, setLoadingEditButton] = useState(false);
  const [editingComment, setEditingComment] = useState<{ commentId: string, text: string } | null>(null);
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

  const onEditComment = async (commentId: string, newText: string) => {
    setLoadingEditButton(true);
    const response = await axios.post('/api/events/editComment', {
      commentId: commentId,
      newText: newText
    });
    if (response.status === 200) {
      //console.log('Comentario editado con éxito');
      const editedCommentIndex = comments.findIndex((comment: any) => comment._id === commentId);
      if (editedCommentIndex !== -1) {
        comments[editedCommentIndex].comment = newText;
      }
    } else {
      console.error('Error al editar comentario');
    }
    setEditingComment(null);
    setLoadingEditButton(false);
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
              return (
                <div key={c._id} className="flex items-start">
                  {editingComment && editingComment.commentId === c._id ? (
                    <>
                      <Input
                        type="text"
                        value={editingComment.text}
                        onChange={(e) => setEditingComment({ commentId: c._id, text: e.target.value })}
                        variant="bordered"
                        className="max-w-xs mt-2 mr-2"
                      />
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => onEditComment(c._id, editingComment.text)}
                        isLoading={loadingEditButton}
                        className="inline-block mt-4 ml-1"
                      >
                        Confirmar edición
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        isReadOnly
                        type="text"
                        label={`${c.user.username} dice:`}
                        variant="bordered"
                        className="max-w-xs mt-2"
                        value={c.comment}
                      />
                      {c.user._id === userId && (
                        <Button
                          color="success"
                          variant="flat"
                          onPress={() => setEditingComment({ commentId: c._id, text: c.comment })}
                          className="inline-block mt-4 ml-2"
                        >
                          Editar
                        </Button>
                      )}
                    </>
                  )}
                </div>
              );
          })}
        </div>
      )}
    </>
  )
}