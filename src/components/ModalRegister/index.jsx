import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clientSFont from '../../assets/Client(2).svg';
import closed from '../../assets/close.svg';
import './style.css';

export default function ModalRegister({ setOpenModalRegister }) {

    const [form, setForm] = useState({
        name: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: '',
        complemento: '',
        cep: '',
        bairro: '',
        cidade: '',
        uf: ''
    });
    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorCPF, setErrorCPF] = useState('');
    const [errorPhone, setErrorPhone] = useState('');

    const [verifyCep, setVerifyCep] = useState({})
    let validate = 0

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrorName('')
        setErrorEmail('')
        setErrorCPF('')
        setErrorPhone('')
        if (!form.name) {
            setErrorName('O Nome é obrigatório')
            validate = + 1
        }
        if (!form.email) {
            setErrorEmail('O Email é obrigatório')
            validate = + 1
        }
        if (!form.cpf) {
            setErrorCPF('O CPF é obrigatório')
            validate = + 1
        }
        if (!form.telefone) {
            setErrorPhone('O Telefone é obrigatório')
            validate = + 1
        }

        if (validate === 0) {
            toast.success('Cliente Cadastro com Sucesso!', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
            setOpenModalRegister(false)
        }
    }

    async function searchCep(event) {

        try {
            const response = await apiCep.get(`${event.target.value}/json/`)

            setVerifyCep(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    function handleChangeForm(e) {
        setForm({ ...form, [e.target.id]: e.target.value });

        setErrorName('')
        setErrorEmail('')
        setErrorCPF('')
        setErrorPhone('')

        if (!form.name) {
            setErrorName('O Nome é obrigatório')
        }
        if (!form.email) {
            setErrorEmail('O Email é obrigatório')
        }
        if (!form.cpf) {
            setErrorCPF('O CPF é obrigatório')
        }
        if (!form.telefone) {
            setErrorPhone('O Telefone é obrigatório')
        }
    }

    return (
        <div className='mainModalRegister'>
            <div className='headerModal initial'>
                <div className='initial'>
                    <img src={clientSFont} alt="" />
                    <h2>Cadastro do Cliente</h2>
                </div>
                <img src={closed} alt="fechar" onClick={() => setOpenModalRegister(false)} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className='divs-inputs-form'>
                    <label htmlFor=""><h1>Nome*</h1></label>
                    <input className={`${errorName ? 'errorLine' : ''}`} type="text" placeholder='Digite o nome' id='name' maxLength={200} onChange={(event) => handleChangeForm(event)} />
                    {errorName && <span className='error'>{errorName}</span>}
                    <label htmlFor=""><h1>E-mail*</h1></label>
                    <input className={`${errorEmail ? 'errorLine' : ''}`} type="email" placeholder='Digite o e-mail' id='email' maxLength={200} onChange={(event) => handleChangeForm(event)} />
                    {errorEmail && <span className='error'>{errorEmail}</span>}
                    <div className='formInformation'>
                        <div>
                            <label htmlFor=""><h1>CPF*</h1></label>
                            <input className={`${errorCPF ? 'errorLine' : ''}`} type="number" placeholder='Digite o CPF' id='cpf' maxLength={11} onChange={(event) => handleChangeForm(event)} />
                            {errorCPF && <span className='error'>{errorCPF}</span>}
                        </div>
                        <div>
                            <label htmlFor=""><h1>Telefone*</h1></label>
                            <input className={`${errorPhone ? 'errorLine' : ''}`} type="number" placeholder='Digite o telefone' id='telefone' maxLength={11} onChange={(event) => handleChangeForm(event)} />
                            {errorPhone && <span className='error'>{errorPhone}</span>}
                        </div>
                    </div>
                    <label htmlFor=""><h1>Endereço</h1></label>
                    <input type="text" placeholder='Digite o endereço' value={verifyCep.logradouro} />
                    <label htmlFor=""><h1>Complemento</h1></label>
                    <input type="text" placeholder='Digite o complemento' />
                    <div className='formInformation'>
                        <div>
                            <label htmlFor=""><h1>CEP</h1></label>
                            <input type="text" placeholder='Digite o CEP' onBlur={(event) => searchCep(event)} />
                        </div>
                        <div>
                            <label htmlFor=""><h1>Bairro</h1></label>
                            <input type="text" placeholder='Digite o Bairro' value={verifyCep.bairro} defaultValue={verifyCep.bairro} />
                        </div>
                    </div>
                    <div className='formAndress'>
                        <div>
                            <label htmlFor=""><h1>Cidade</h1></label>
                            <input type="text" placeholder='Digite o Cidade' value={verifyCep.localidade} />
                        </div>
                        <div>
                            <label htmlFor=""><h1>UF</h1></label>
                            <input type="text" placeholder='Digite o UF' value={verifyCep.uf} />
                        </div>
                    </div>




                </div>
                <div className='formButton initial'>
                    <button onClick={() => setOpenModalRegister(false)}>Cancelar</button>
                    <button type='submit'>Aplicar</button>
                </div>
            </form>

        </div>
    )
}