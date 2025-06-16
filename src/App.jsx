import React, { useEffect, useState } from 'react';
import './App.css';
import { usePilotosApi } from './UsePilotos';
import Input from './Input';

function App() {
  const { datas, sla } = usePilotosApi();

  const [nome, setNome] = useState('');
  const [equipe, setEquipe] = useState('');
  const [data, setData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const [nomeCamp, setNomeCamp] = useState('');
  const [voltas, setVoltas] = useState('');
  const [primeiro, setPrimeiro] = useState('');
  const [segundo, setSegundo] = useState('');
  const [terceiro, setTerceiro] = useState('');
  const [pista, setPista] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [pilotoEditando, setPilotoEditando] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');
  const [equipeEditada, setEquipeEditada] = useState('');

  const [modalCampAberto, setModalCampAberto] = useState(false);
  const [campEditando, setCampEditando] = useState(null);
  const [nomeCampEditado, setNomeCampEditado] = useState('');
  const [voltasEditado, setVoltasEditado] = useState('');
  const [pistaEditada, setPistaEditada] = useState('');
  const [primeiroEditado, setPrimeiroEditado] = useState('');
  const [segundoEditado, setSegundoEditado] = useState('');
  const [terceiroEditado, setTerceiroEditado] = useState('');
const [pilotosVitorias, setPilotosVitorias] = useState([]);

  const [mymodal, setMyModal] = useState(false);

  useEffect(() => {
  fetchPilotos();
  fetchCampeonatos();
  fetchPilotosVitorias();
}, []);

async function fetchPilotos() {
  try {
    const resp = await fetch("http://localhost:8080/pilotos");
    const json = await resp.json();
    setData(json);
  } catch (error) {
    console.error("Erro ao buscar pilotos:", error);
  }
}

async function fetchPilotosVitorias() {
  try {
    const resp = await fetch("http://localhost:8080/pilotos/vitorias");
    const json = await resp.json();
    setPilotosVitorias(json);
  } catch (error) {
    console.error("Erro ao buscar pilotos com vitórias:", error);
  }
}

async function fetchCampeonatos() {
  try {
    const resp = await fetch("http://localhost:8080/camp");
    const json = await resp.json();
    setSecondData(json);
    console.log(json);
  } catch (error) {
    console.error("Erro ao buscar campeonatos:", error);
  }
}

const handlePost = async (event) => {
  event.preventDefault();
  setMensagem('');

  const novoPiloto = { nome, equipe };

  try {
    const resposta = await fetch('http://localhost:8080/pilotos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPiloto),
    });

    if (resposta.ok) {
      await fetchPilotos();
      setMensagem("Piloto cadastrado");
      setNome('');
      setEquipe('');
    } else if (resposta.status === 409) {
      setMensagem("Piloto já cadastrado.");
    } else if (resposta.status === 422) {
      setMensagem("Dados inválidos. Verifique os campos.");
    } else {
      setMensagem("Erro desconhecido ao cadastrar piloto.");
    }
  } catch (erro) {
    console.error(erro);
    setMensagem("Erro de rede ou servidor indisponível.");
  }
};

const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:8080/pilotos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    await fetchPilotos();
  } catch (erro) {
    console.error(erro);
  }
};

const handlePostCamp = async (e) => {
  e.preventDefault();
  setMensagem('');

  const novoCamp = {
    nome: nomeCamp,
    NumeroDeVoltas: parseInt(voltas),
    pista,
    first: parseInt(primeiro),
    second: parseInt(segundo),
    third: parseInt(terceiro)
  };

  try {
    const resp = await fetch("http://localhost:8080/camp", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCamp)
    });

    if (resp.ok) {
      await fetchCampeonatos();
      await fetchPilotosVitorias();
      setMensagem("Campeonato cadastrado com sucesso.");
      setNomeCamp('');
      setVoltas('');
      setPista('');
      setPrimeiro('');
      setSegundo('');
      setTerceiro('');
    } else if (resp.status === 422) {
      setMensagem("Dados inválidos para campeonato.");
    } else {
      setMensagem("Erro ao cadastrar campeonato.");
    }
  } catch (erro) {
    console.error(erro);
    setMensagem("Erro de rede ao cadastrar campeonato.");
  }
};

const handleDeleteCamp = async (id) => {
  try {
    await fetch(`http://localhost:8080/camp/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    await fetchCampeonatos();
    await fetchPilotosVitorias(); 
  } catch (erro) {
    console.error(erro);
  }
};

const abrirModalEdicao = (piloto) => {
  setPilotoEditando(piloto);
  setNomeEditado(piloto.nome);
  setEquipeEditada(piloto.equipe);
  setModalAberto(true);
};

const handleUpdate = async () => {
  setMensagem('');
  const pilotoAtualizado = { nome: nomeEditado, equipe: equipeEditada };

  try {
    const resposta = await fetch(`http://localhost:8080/pilotos/${pilotoEditando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotoAtualizado),
    });

    if (resposta.ok) {
      await fetchPilotos();
      setMensagem("Piloto atualizado com sucesso.");
      setModalAberto(false);
    } else if (resposta.status === 422) {
      setMensagem("Dados inválidos para atualização.");
    } else {
      setMensagem("Erro ao atualizar piloto.");
    }
  } catch (erro) {
    console.error(erro);
    setMensagem("Erro de rede ou servidor indisponível.");
  }
};

const abrirModalCamp = (camp) => {
  setCampEditando(camp);
  setNomeCampEditado(camp.nome);
  setVoltasEditado(camp.NumeroDeVoltas);
  setPistaEditada(camp.pista);
  setPrimeiroEditado(camp.first.id);
  setSegundoEditado(camp.second.id);
  setTerceiroEditado(camp.third.id);
  setModalCampAberto(true);
};

const handleUpdateCamp = async () => {
  const campAtualizado = {
    nome: nomeCampEditado,
    NumeroDeVoltas: parseInt(voltasEditado),
    pista: pistaEditada,
    first: parseInt(primeiroEditado),
    second: parseInt(segundoEditado),
    third: parseInt(terceiroEditado),
  };

  try {
    const resp = await fetch(`http://localhost:8080/camp/${campEditando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campAtualizado),
    });

    if (resp.ok) {
      await fetchCampeonatos();
      await fetchPilotosVitorias(); 
      setMensagem("Campeonato atualizado com sucesso.");
      setModalCampAberto(false);
    } else if (resp.status === 422) {
      setMensagem("Dados inválidos para atualização.");
    } else {
      setMensagem("Erro ao atualizar campeonato.");
    }
  } catch (erro) {
    console.error(erro);
    setMensagem("Erro de rede ou servidor indisponível.");
  }
};

const nomePilotoPorId = (id) => {
  if (!id) return '';
  const piloto = data.find(p => p.id === id);
  return piloto ? piloto.nome : `ID ${id} não encontrado`;
};

if (!Array.isArray(data)) return null;

  return (
    <>
      <form onSubmit={handlePost}>
        <h1 className='sinistro'>ADICIONAR PILOTOS</h1>
        <Input placeholder="Nome" value={nome} setValue={setNome} />
        <label>
          <select className='select' value={equipe} onChange={e => setEquipe(e.target.value)}>
            <option value="">Selecione uma equipe</option>
            <option value="MCLAREM">MCLAREM</option>
            <option value="FERRARI">FERRARI</option>
            <option value="RBR">RBR</option>
            <option value="MERCEDES">MERCEDES</option>
            <option value="ALPINE">ALPINE</option>
            <option value="HAAS">HAAS</option>
          </select>
        </label>
        <button className='mybut2' type="submit" disabled={!nome || !equipe}>Cadastrar</button>
      </form>

      {mensagem && <p className='bobEsponjamolucsoc'>{mensagem}</p>}

      <table className='gr'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Equipe</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ nome, equipe, id }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{nome}</td>
              <td>{equipe}</td>
              <td>
                <button className='mybutt' onClick={() => handleDelete(id)}>Excluir</button>
                <button className='mybut2' type="button" onClick={() => abrirModalEdicao({ id, nome, equipe })}>Atualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h1 className="sinistro">ADICIONAR CAMPEONATO</h1>
        <form className='myform' onSubmit={handlePostCamp}>
          <Input placeholder="Nome do campeonato" value={nomeCamp} setValue={setNomeCamp} />
          <Input placeholder="Número de voltas" value={voltas} setValue={setVoltas} type="number" />
          <label>
            <select className='select' value={pista} onChange={e => setPista(e.target.value)}>
              <option value="">Selecione pista</option>
              <option value="INDOOR">INDOOR</option>
              <option value="OUTDOOR">OUTDOOR</option>
            </select>
          </label>

          <label>
            <input
              className='input-text'
              type="number"
              value={primeiro}
              onChange={e => setPrimeiro(e.target.value)}
              placeholder="Digite o ID do piloto"
            />
          </label>

          <label>
            <input
              className='input-text'
              type="number"
              value={segundo}
              onChange={e => setSegundo(e.target.value)}
              placeholder="Digite o ID do piloto"
            />
          </label>

          <label>
            <input
              className='input-text'
              type="number"
              value={terceiro}
              onChange={e => setTerceiro(e.target.value)}
              placeholder="Digite o ID do piloto"
            />
          </label>

          <button
            className='mybut3'
            type="submit"
            disabled={!nomeCamp || !voltas || !pista || !primeiro || !segundo || !terceiro}
          >
            Cadastrar Campeonato
          </button>
        </form>

        <table className='gr'>
          <thead>
            <tr className='meugr'>
              <th>Nome</th>
              <th>Pista</th>
              <th>Voltas</th>
              <th>1º</th>
              <th>2º</th>
              <th>3º</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {secondData.map(({ nome, pista, numeroDeVoltas, first, second, third, id }) => (
              <tr key={id}>
                <td>{nome}</td>
                <td>{pista}</td>
                <td>{numeroDeVoltas}</td>
                <td>{first.nome}</td>
                <td>{second.nome}</td>
                <td>{third.nome}</td>
                <td>
                  <button className='mybutt' onClick={() => handleDeleteCamp(id)}>Excluir</button>
                  <button className='mybut2' onClick={() => abrirModalCamp({ id, nome, pista, numeroDeVoltas, first, second, third })}>
                    Atualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
<section>
  <h1 className="sinistro">PILOTOS E SUAS VITÓRIAS</h1>
  <table className="gr">
    <thead>
      <tr>
        <th>Id</th>
        <th>Nome</th>
        <th>Equipe</th>
        <th>Vitórias</th>
        <th>Participações</th>
      </tr>
    </thead>
    <tbody>
      {pilotosVitorias.map(({ id, nome, equipe, vitorias, Participacoes }) => (
        <tr key={id}>
          <td>{id}</td>
          <td>{nome}</td>
          <td>{equipe}</td>
          <td>{vitorias}</td>
          <td>{Participacoes}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>






      {mymodal && (<h1>olaa</h1>)}

      {modalAberto && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Editar Piloto</h2>
            <input
              type="text"
              value={nomeEditado}
              onChange={(e) => setNomeEditado(e.target.value)}
              placeholder="Nome"
            />
            <select value={equipeEditada} onChange={(e) => setEquipeEditada(e.target.value)}>
              <option value="">Selecione uma equipe</option>
              <option value="MCLAREM">MCLAREM</option>
              <option value="FERRARI">FERRARI</option>
              <option value="RBR">RBR</option>
              <option value="MERCEDES">MERCEDES</option>
              <option value="ALPINE">ALPINE</option>
              <option value="HAAS">HAAS</option>
            </select>
            <div className="modal-actions">
              <button className="mybut2" onClick={handleUpdate}>Salvar</button>
              <button className="mybutt" onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalCampAberto && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Editar Campeonato</h2>

            <input
              className="input-text"
              type="text"
              value={nomeCampEditado}
              onChange={(e) => setNomeCampEditado(e.target.value)}
              placeholder="Nome do campeonato"
            />

            <input
              className="input-text"
              type="number"
              value={voltasEditado}
              onChange={(e) => setVoltasEditado(e.target.value)}
              placeholder="Número de voltas"
            />

            <select className="select" value={pistaEditada} onChange={(e) => setPistaEditada(e.target.value)}>
              <option value="">Selecione pista</option>
              <option value="INDOOR">INDOOR</option>
              <option value="OUTDOOR">OUTDOOR</option>
            </select>

            <input
              className="input-text"
              type="number"
              value={primeiroEditado}
              onChange={(e) => setPrimeiroEditado(e.target.value)}
              placeholder="ID do 1º colocado"
            />

            <input
              className="input-text"
              type="number"
              value={segundoEditado}
              onChange={(e) => setSegundoEditado(e.target.value)}
              placeholder="ID do 2º colocado"
            />

            <input
              className="input-text"
              type="number"
              value={terceiroEditado}
              onChange={(e) => setTerceiroEditado(e.target.value)}
              placeholder="ID do 3º colocado"
            />

            <div className="modal-actions">
              <button className="mybut2" onClick={handleUpdateCamp}>Salvar</button>
              <button className="mybutt" onClick={() => setModalCampAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
