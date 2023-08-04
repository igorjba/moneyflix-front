import { useEffect, useState } from "react";
import chargePink from "../../assets/Charge-Pink.svg";
import charge from "../../assets/Charge.svg";
import clientePink from "../../assets/Client-Pink.svg";
import client from "../../assets/Client.svg";
import homePink from "../../assets/Home-Pink.svg";
import home from "../../assets/Home.svg";
import setBottom from "../../assets/chevron-down.svg";
import ChargesListPage from "../../components/Charges/ChargesListPage";
import RegisterChargesModal from '../../components/Charges/RegisterChargesModal';
import ClientDetail from "../../components/Clients/ClientDetail";
import ClientListPage from "../../components/Clients/ClientListPage";
import EditClientModal from '../../components/Clients/EditClientModal';
import RegisterClientModal from "../../components/Clients/RegisterClientModal";
import HomePage from "../../components/Dashboard/HomePage";
import LogoutEditUserModal from "../../components/Dashboard/LogoutEditUserModal";
import EditUserModal from "../../components/Users/EditUserModal";
import SuccessEditUserModal from "../../components/Users/SuccessEditUserModal";
import "../../global/styleModal.css";
import useUser from '../../hooks/useUser';
import "./style.css";

function Main() {
  const [modalExit, setModalExit] = useState(false);
  const [imageNavHome, setimageNavHome] = useState(false);
  const [imageNavClient, setimageNavClient] = useState(true);
  const [imageNavCharge, setimageNavCharge] = useState(true);
  const [resumeName, setResumeName] = useState("");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const {
    openModalRegister,
    openModalEditPerfil,
    openModalEditProfile,
    openModalEditProfileSuccess,
    setOpenModalEditProfileSuccess,
    title,
    setTitle,
    nameUser,
    openModalEditClient,
    openModalRegisterCharges,
    idClientDetail,
    setIdClientDetail,
    setTitleNameSecond,
    setClientDetailPage,
    titleNameSecond
  } = useUser();

  function onClickNavLeft(event) {
    const divs = document.querySelectorAll("div");
    divs.forEach((element) => {
      element.classList.remove("atived");
    });
    event.currentTarget.classList.add("atived");
  }

  function toTitleCase(name) {
    return name == null
      ? ""
      : name.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }

  async function fetchUserPerfil() {
    const userNameWords = nameUser.split(" ");
    if (userNameWords.length === 1) {
      return setResumeName(userNameWords[0].charAt(0).toUpperCase());
    } else {
      const lastWord = userNameWords[userNameWords.length - 1];
      return setResumeName(
        userNameWords[0].charAt(0).toUpperCase() +
        lastWord.charAt(0).toUpperCase()
      );
    }
  }

  function titleAtived() {
    if (!imageNavHome) {
      setTitle("Resumo de Cobranças");
    }
    if (!imageNavClient) {
      setTitle("Clientes");
    }
    if (!imageNavCharge) {
      setTitle("Cobranças");
    }
  }

  async function verifyTextHeader(e) {
    if (title === 'Clientes  ') {
      setTitleNameSecond(" "),
        setimageNavClient(false),
        setClientDetailPage(false),
        setIdClientDetail(false)
    }
  }

  useEffect(() => {
    titleAtived();
  }, []);

  useEffect(() => {
    fetchUserPerfil();
  }, [nameUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalExit &&
        !document.getElementById("modalExit").contains(event.target)
      ) {
        setModalExit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalExit]);

  return (
    <div className="initial mainBody">
      <nav className="initial navegation">
        <div
          className="initial nav-icons atived mousePointer"
          onClick={(event) => {
            onClickNavLeft(event),
              setimageNavClient(true),
              setimageNavHome(false),
              setimageNavCharge(true),
              setTitleNameSecond('')
          }}
        >
          <img src={imageNavHome ? home : homePink} alt="Inicio" />
        </div>
        <div
          className="initial nav-icons mousePointer"
          onClick={(event) => {
            onClickNavLeft(event),
              setimageNavClient(false),
              setimageNavHome(true),
              setimageNavCharge(true);
            setTitleNameSecond('')

            setIdClientDetail(false);
          }}
        >
          <img src={imageNavClient ? client : clientePink} alt="Cliente" />
        </div>
        <div
          className="initial nav-icons mousePointer"
          onClick={(event) => {
            onClickNavLeft(event),
              setimageNavClient(true),
              setimageNavHome(true),
              setimageNavCharge(false),
              setTitleNameSecond('')
          }}
        >
          <img src={imageNavCharge ? charge : chargePink} alt="Cobranças" />
        </div>
      </nav>
      <div className="center">

        {openModalEditClient && <div className="backgroundModal initial">
          {openModalEditClient && (<EditClientModal />)}
        </div>}
        {openModalRegister && <div className="backgroundModal initial">
          {openModalRegister && (<RegisterClientModal />)}
        </div>}
        {openModalRegisterCharges.status && <div className="background-modal initial">
          {openModalRegisterCharges.status && (<RegisterChargesModal />)}
        </div>}
        {openModalEdit && <div className="background-modal initial">
          {openModalEditProfile && (<EditUserModal setOpenModalEdit={setOpenModalEdit} />)}
        </div>}
        {openModalEditProfileSuccess && (
          <div className="background-modal initial">
            <SuccessEditUserModal setOpenModalEditProfileSuccess={setOpenModalEditProfileSuccess} />
          </div>
        )}
        <header>
          <div className="text-header-perfil">
            <h2 onClick={(e) => verifyTextHeader(e)} className={`initial ${title == "Resumo de Cobranças" ? "" : "titleSecond"} ${!imageNavClient && idClientDetail ? 'mousePointer' : ''}`} >
              {title}
            </h2>
            <span className="detail-client-span">{titleNameSecond}</span>
          </div>
          <div className="initial header-perfil">
            <div className="title circle-perfil">
              <h1>{resumeName}</h1>
            </div>
            <div className="profile initial">
              <h1>{toTitleCase(nameUser)}</h1>
              <img
                src={setBottom}
                alt="seta"
                onClick={() => setModalExit(!modalExit)}
              />
            </div>
          </div>
          {modalExit && (
            <LogoutEditUserModal
              setModalExit={setModalExit}
              setOpenModalEdit={setOpenModalEdit}
            />
          )}
        </header>
        <div className="main">
          {!imageNavClient && !idClientDetail && <ClientListPage />}
          {!imageNavClient && idClientDetail && <ClientDetail />}
          {!imageNavHome && <HomePage />}
          {!imageNavCharge && <ChargesListPage />}
        </div>
      </div>
    </div>
  );
}
export default Main;
