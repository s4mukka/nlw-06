import { Fragment, useState } from "react";
import { useHistory, useParams } from "react-router";
import Modal from "react-modal";

import { DeleteSvg, LogoImg, EndRoomSvg } from "../assets/images";
import { Button, RoomCode, Question } from "../components";
import { useRoom } from "../hooks";
import { database } from "../services";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const { id: roomId } = useParams<RoomParams>();

  const history = useHistory();

  const { title, questions } = useRoom(roomId);

  const [endRoomModalIsOpen, setEndRoomModalIsOpen] = useState(false);
  const [questionIdModalIdOpen, setQuestionIdModalIdOpen] = useState<string | undefined>();

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  };

  const handleDeleteQuestion = (questionId: string) => async () => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

    closeQuestionModal();
  };

  const openQuestionModal = (questionId: string) => () => setQuestionIdModalIdOpen(questionId);
  const closeQuestionModal = () => setQuestionIdModalIdOpen(undefined);
  const openEndRoomModal = () => setEndRoomModalIsOpen(true);
  const closeEndRoomModal = () => setEndRoomModalIsOpen(false);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={openEndRoomModal}>
              Encerrar sala
            </Button>
            <Modal
              isOpen={endRoomModalIsOpen}
              onRequestClose={closeEndRoomModal}
              className="Modal"
              overlayClassName="Overlay"
            >
              <EndRoomSvg />
              <h1>Encerrar sala</h1>
              <span>Tem certeza que você deseja encerrar esta sala?</span>
              <div>
                <button type="button" onClick={closeEndRoomModal} className="cancel">
                  Cancelar
                </button>
                <button type="button" onClick={handleEndRoom} className="confirm">
                  Sim, encerrar
                </button>
              </div>
            </Modal>
          </div>
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

        <div className="question-list">
          {questions.map((question) => (
            <Fragment key={question.id}>
              <Question content={question.content} author={question.author}>
                <button type="button" onClick={openQuestionModal(question.id)} className="delete">
                  <DeleteSvg />
                </button>
              </Question>
              <Modal
                isOpen={questionIdModalIdOpen === question.id}
                onRequestClose={closeQuestionModal}
                className="Modal"
                overlayClassName="Overlay"
              >
                <DeleteSvg />
                <h1>Excluir pergunta</h1>
                <span>Tem certeza que você deseja excluir esta pergunta?</span>
                <div>
                  <button type="button" onClick={closeQuestionModal} className="cancel">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteQuestion(question.id)}
                    className="confirm"
                  >
                    Sim, excluir
                  </button>
                </div>
              </Modal>
            </Fragment>
          ))}
        </div>
      </main>
    </div>
  );
};
