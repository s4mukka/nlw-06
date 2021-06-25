import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import { LogoImg, LikeSvg } from "../assets/images";
import { Button, RoomCode, Question } from "../components";
import { useAuth, useRoom } from "../hooks";
import { database } from "../services";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export const Room = () => {
  const { user } = useAuth();

  const { id: roomId } = useParams<RoomParams>();

  const { title, questions } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = useState("");

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  };

  const handleLikeQuestion = (questionId: string, likeId: string | undefined) => async () => {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} pergunta{questions.length > 1 && <>s</>}
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <button
                  className={`like-button ${question.likeId ? "liked" : ""}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={handleLikeQuestion(question.id, question.likeId)}
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <LikeSvg />
                </button>
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};
