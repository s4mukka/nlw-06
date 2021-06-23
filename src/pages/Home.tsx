import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../components";
import { useAuth } from "../hooks";
import { IllustrationImg, LogoImg, GoogleIconImg } from "../assets/images";

import "../styles/auth.scss";
import { database } from "../services";

export const Home = () => {
  const history = useHistory();

  const { signInWithGoogle, user } = useAuth();

  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    // const toastId = toast.loading("Waitng...");
    // const roomRef = await database.ref(`rooms/${roomCode}`).get();
    // toast.dismiss(toastId);

    // if (!roomRef.exists()) {
    //   toast.error("Room does not exists.");
    //   return;
    // }

    // history.push(`/rooms/${roomCode}`);

    const joinRoom = new Promise((resolve, reject) => {
      database
        .ref(`rooms/${roomCode}`)
        .get()
        .then((roomRef) => {
          if (!roomRef.exists()) {
            reject("Room does not exists.");
          }
          resolve("");
          return roomRef;
        });
    });

    await toast.promise(
      joinRoom,
      {
        loading: "Waiting...",
        success: () => {
          history.push(`/rooms/${roomCode}`);
          return "Room found";
        },
        error: (err) => err.toString(),
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 500,
        },
      }
    );
  };

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={GoogleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};
