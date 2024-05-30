import React, { useState } from "react";
import "./App.css";
import Max from "./Components/Card/Max";
import Min from "./Components/Card/Min";
import Titulo from "./Components/Card/Titulo";

function App() {
  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const [cidade, setCidade] = useState("");
  const [tempAtual, setTempAtual] = useState(null);
  const [tempMaxima, setTempMaxima] = useState(null);
  const [tempMinima, setTempMinima] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState(null);

  const callApi = () => {
    const cidadeCodificada = encodeURIComponent(cidade);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidadeCodificada}&lang=pt_br&appid=3334c42780038c90f6086571b77314ff&units=metric`
    )
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro ao buscar a cidade");
        }
        return resposta.json();
      })
      .then((dadoTemperatura) => {
        setTempAtual(dadoTemperatura.main.temp);
        setTempMaxima(dadoTemperatura.main.temp_max);
        setTempMinima(dadoTemperatura.main.temp_min);
        setDescricao(dadoTemperatura.weather[0].description);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="App">
      <input
        type="text"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        placeholder="Digite o nome da cidade"
      />
      <button onClick={callApi}>Buscar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tempAtual !== null && (
        <div className="Card-Atual">
          <h2>Temperatura Atual em {cidade}</h2>
          <p>Temperatura Atual: {tempAtual} ºC</p>
          <p>Máxima: {tempMaxima} ºC</p>
          <p>Mínima: {tempMinima} ºC</p>
          <p>Descrição: {descricao}</p>
        </div>
      )}

      {diasSemana.map((dia) => (
        <div key={dia} className="day-container">
          <Titulo descricao={dia}></Titulo>
          <Max descricao={tempMaxima !== null ? `${tempMaxima} ºC` : "N/A"}></Max>
          <Min descricao={tempMinima !== null ? `${tempMinima} ºC` : "N/A"}></Min>
        </div>
      ))}
    </div>
  );
}

export default App;
