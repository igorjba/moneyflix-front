import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/api';
import apiCep from '../../../api/apiCep';
import clientSFont from '../../../assets/Client(2).svg';
import success from '../../../assets/Success-Toast.svg';
import closed from '../../../assets/close.svg';
import toastError from '../../../assets/toastError.svg';
import useUser from '../../../hooks/useUser';
import { cellPhoneUnmask, cepMask, cepUnmask, cpfMask, cpfUnmask, phoneAndCelMask } from '../../../utils/inputMasks';
import { clearAll } from '../../../utils/localStorage';
import { validateCPF, validateEmail, validateName } from '../../../utils/validation';
import './style.css';

export default function RegisterClientModal() {
  const navigate = useNavigate();
  const { setOpenModalRegister, setClientRegisters, token, setCorArrowBottom, setCorArrowTop } = useUser();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
  });
  const [numberHouse, setNumberHouse] = useState('')
  const [formAdress, setFormAdress] = useState({
    logradouro: ''.concat(numberHouse),
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  let validate = 0
  const inputRef = useRef(null)
  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorCPF, setErrorCPF] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [validationInputDisabled, setValidationInputDisabled] = useState(false)
  function handleChangeForm(event) {
    if (event.target.name === 'nome' || event.target.name === 'email') {
      return setForm({ ...form, [event.target.name]: event.target.value });
    }
    if (event.target.name === 'logradouro' || event.target.name === 'complemento' || event.target.name === 'bairro' || event.target.name === 'cidade' || event.target.name === 'estado') {
      return setFormAdress({ ...formAdress, [event.target.name]: event.target.value })
    }
    if (event.target.name === 'cpf') {
      return setForm({ ...form, [event.target.name]: cpfMask(event.target.value) });
    }
    if (event.target.name === 'telefone') {
      /* const inputNumberTel = event.target.value.replace(/\D/g, '')

      if (inputNumberTel.length > 11) {
        return;
      }

      let value = inputNumberTel;
      let phone = '';
      if (value.length > 0) {
        phone += '(' + value.slice(0, 2);
      }
      if (value.length > 2) {
        if (value.length <= 10) {
          phone += ') ' + value.slice(2, 6);
        } else if (value.length === 11) {
          phone += ') ' + value.slice(2, 3) + ' ' + value.slice(3, 7);
        }
      }
      if (value.length > 6 && value.length <= 10) {
        phone += '-' + value.slice(6);
      } else if (value.length === 11) {
        phone += '-' + value.slice(7);
      } */

      

      return setForm({ ...form, [event.target.name]: phoneAndCelMask(phone)})
    }
    if (event.target.name === 'cep') {
      return setFormAdress({ ...formAdress, [event.target.name]: cepMask(event.target.value) });
    }
    if (event.target.name === 'numero') {
      const inputNumberTel = event.target.value.replace(/\D/g, '')
      setNumberHouse(inputNumberTel)
    }
  }
  async function searchCep(event) {
    try {
      const response = await apiCep.get(`${cepUnmask(event.target.value)}/json/`)
      setFormAdress({
        logradouro: (response.data.logradouro).concat(),
        bairro: response.data.bairro,
        cep: cepUnmask(response.data.cep),
        cidade: response.data.localidade,
        estado: response.data.uf
      })
      setValidationInputDisabled(true)
      if (response.data.erro) {
        toast.error("CEP não encontrado", {
          className: 'customToastify-error',
          icon: ({ theme, type }) => <img src={toastError} alt="" />
        });
        setValidationInputDisabled(false)
      }
    } catch (error) {
      toast.error("CEP inválido", {
        className: 'customToastify-error',
        icon: ({ theme, type }) => <img src={toastError} alt="" />
      });
      setValidationInputDisabled(false)
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    setErrorName('')
    setErrorEmail('')
    setErrorCPF('')
    setErrorPhone('')
    const validationName = validateName(form.nome)
    if (!validationName.isValid) {
      setErrorName(validationName.message)
      validate = +1
    }
    const validationEmail = validateEmail(form.email)
    if (!validationEmail.isValid) {
      setErrorEmail(validationEmail.message)
      validate = +1
    }
    const validationCPF = validateCPF(cpfUnmask(form.cpf))
    if (!validationCPF.isValid) {
      setErrorCPF(validationCPF.message);
      validate = +1
    }
    if (!form.telefone) {
      setErrorPhone('Este campo deve ser preenchido');
      validate = +1
    }
    if (validate === 0) {
      sendInformation()
      setOpenModalRegister(false)
    }
    setCorArrowBottom('#3F3F55')
    setCorArrowTop('#3F3F55')
  }
  async function sendInformation() {
    try {
      const response = await api.post("cliente", {
        nome: form.nome,
        cpf: cpfUnmask(form.cpf),
        email: form.email,
        telefone: cellPhoneUnmask(form.telefone),
        ...formAdress
      }, {
        headers: {
          authorization: token,
        }
      });
      ClientCadaster()
      toast.success(
        'Cliente Cadastro com Sucesso!', {
        className: 'customToastify-success',
        icon: ({ theme, type }) => <img src={success} alt="" />
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 && error.response.data.message === "token expirado") {
          clearAll()
          navigate("/login");
        } else if (error.response.status === 400 && error.response.data.message === "Não autorizado") {
          clearAll()
          navigate("/login");
        }
      }
      toast.error(
        error.response.data.message, {
        className: 'customToastify-error',
        icon: ({ theme, type }) => <img src={error} alt="" />
      });
    }
  }
  async function ClientCadaster() {
    try {
      const response = await api.get('cliente', {
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
      setClientRegisters((response.data));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 && error.response.data.message === "token expirado") {
          clearAll()
          navigate("/login");
        } else if (error.response.status === 400 && error.response.data.message === "Não autorizado") {
          clearAll()
          navigate("/login");
        }
      }
      toast.error(
        error.response.data.message, {
        className: 'customToastify-error',
        icon: ({ theme, type }) => <img src={error} alt="" />
      });
    }
  }
  return (
    <div className='main-Modal Modal-Register'>
      <img className='mousePointer closed-Modal-Register-Client' src={closed} alt="fechar" onClick={() => setOpenModalRegister(false)} />
      <div className='headerModal initial'>
        <div className='initial'>
          <img src={clientSFont} alt="" />
          <h2>Cadastro do Cliente</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='divs-inputs-form'>
          <label htmlFor="inputName" className='mousePointer'><h1>Nome*</h1></label>
          <input className={`${errorName ? 'errorLine' : ''}`} type="text" id='inputName' ref={inputRef} placeholder='Digite o nome' name='nome' value={form.name} maxLength={200} onChange={(event) => handleChangeForm(event)} />
          {errorName && <span className='mainModalRegister error'><h1>{errorName}</h1></span>}
          <label htmlFor="inputEmail" className='mousePointer'><h1>E-mail*</h1></label>
          <input className={`${errorEmail ? 'errorLine' : ''}`} type="email" id='inputEmail' ref={inputRef} placeholder='Digite o e-mail' name='email' value={form.email} maxLength={200} onChange={(event) => handleChangeForm(event)} />
          {errorEmail && <span className='error'><h1>{errorEmail}</h1></span>}
          <div className='formInformation'>
            <div>
              <label htmlFor="inputCPF" className='mousePointer'><h1>CPF*</h1></label>
              <input className={`${errorCPF ? 'errorLine' : ''}`} type="text" id='inputCPF' ref={inputRef} placeholder='Digite o CPF' name='cpf' maxLength={14} value={form.cpf} onChange={(event) => handleChangeForm(event)} />
              {errorCPF && <span className='error'><h1>{errorCPF}</h1></span>}
            </div>
            <div>
              <label htmlFor="inputPhone" className='mousePointer'><h1>Telefone*</h1></label>
              <input className={`${errorPhone ? 'errorLine' : ''}`} type="text" id='inputPhone' ref={inputRef} placeholder='Digite o telefone' name='telefone' value={form.telefone} maxLength={20} onChange={(event) => handleChangeForm(event)} />
              {errorPhone && <span className='error'><h1>{errorPhone}</h1></span>}
            </div>
          </div>
          <div className='formAndress'>
            <div>
              <label htmlFor="inputCEP" className='mousePointer'><h1>CEP</h1></label>
              <input type="text" maxLength={9} placeholder='Digite o CEP' id='inputCEP' ref={inputRef} name='cep' value={formAdress.cep} onBlur={(event) => searchCep(event)} onChange={(event) => handleChangeForm(event)} />
            </div>
            <div>
              <label htmlFor="inputNumber" className='mousePointer'><h1>Número da Residência</h1></label>
              <input type="text" maxLength={4} placeholder='Digite número da residência' id='inputNumber' ref={inputRef} name='numero' value={numberHouse} onChange={(event) => handleChangeForm(event)} />
            </div>
          </div>
          <label htmlFor="inputCompl" className='mousePointer'><h1>Complemento</h1></label>
          <input type="text" placeholder='Digite o complemento' id='inputCompl' ref={inputRef} name='complemento' value={formAdress.complemento} onChange={(event) => handleChangeForm(event)} />
          <div className='formInformation'>
            <div>
              <label htmlFor="inputAdress" className='mousePointer'><h1>Endereço</h1></label>
              <input type="text" placeholder='Digite o endereço' id='inputAdress' ref={inputRef} name='logradouro' disabled={validationInputDisabled} value={formAdress.logradouro} onChange={(event) => handleChangeForm(event)} />
            </div>
            <div>
              <label htmlFor="inputNeighborhood" className='mousePointer'><h1>Bairro</h1></label>
              <input type="text" placeholder='Digite o Bairro' name='bairro' id='inputNeighborhood' ref={inputRef} value={formAdress.bairro} disabled={validationInputDisabled} onChange={(event) => handleChangeForm(event)} />
            </div>
          </div>
          <div className='formAndress'>
            <div>
              <label htmlFor="inputCity" className='mousePointer'><h1>Cidade</h1></label>
              <input type="text" placeholder='Digite o Cidade' name='cidade' id='inputCity' ref={inputRef} disabled={validationInputDisabled} value={formAdress.cidade} onChange={(event) => handleChangeForm(event)} />
            </div>
            <div>
              <label htmlFor="inputUF" className='mousePointer'><h1>UF</h1></label>
              <input type="text" placeholder='Digite o UF' name='estado' id='inputUF' ref={inputRef} disabled={validationInputDisabled} value={formAdress.estado} onChange={(event) => handleChangeForm(event)} />
            </div>
          </div>
        </div>
        <div className='formButton initial'>
          <button type='button' onClick={() => setOpenModalRegister(false)}>Cancelar</button>
          <button type='submit'>Aplicar</button>
        </div>
      </form>
    </div>
  )
}
