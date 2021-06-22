import { useHistory } from "react-router-dom";

import { Button } from "../components";
import { useAuth } from "../hooks";
import { IllustrationImg, LogoImg, GoogleIconImg } from "../assets/images";

import "../styles/auth.scss";

export const Home = () => {
  const history = useHistory();
  const { signInWithGoogle, user } = useAuth();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
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
          <form>
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};
