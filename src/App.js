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
  const [previsoes, setPrevisoes] = useState([]);
  const [error, setError] = useState(null);

  const callApi = () => {
    const cidadeCodificada = encodeURIComponent(cidade);
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cidadeCodificada}&lang=pt_br&appid=3334c42780038c90f6086571b77314ff&units=metric`
    )
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro ao buscar a cidade");
        }
        return resposta.json();
      })
      .then((dados) => {
        const previsoesDiarias = dados.list.filter((previsao) => {
          return previsao.dt_txt.includes("12:00:00"); // Filtra apenas previsões para o meio-dia
        });
        setPrevisoes(previsoesDiarias);
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

      {previsoes.length > 0 && (
        <div>
          {previsoes.map((previsao, index) => {
            const data = new Date(previsao.dt_txt);
            const diaSemana = diasSemana[data.getDay()];

            return (
              <div key={index} className="day-container">
                <Titulo descricao={diaSemana}></Titulo>
                <Max descricao={`${previsao.main.temp_max} ºC`}></Max>
                <Min descricao={`${previsao.main.temp_min} ºC`}></Min>
                <p>Descrição: {previsao.weather[0].description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
