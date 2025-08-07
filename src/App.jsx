import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [loading, setLoading] = useState(false);
  const [cepError, setCepError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cleanCepError = () => setCepError(false);
  const showCepError = () => setCepError(true);

  const cleanAddress = () => {
    setForm((prev) => ({
      ...prev,
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (!/\d{8}/.test(cep)) {
      showCepError();
      cleanAddress();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        showCepError();
        cleanAddress();
      } else {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
        cleanCepError();
      }
    } catch (err) {
      showCepError();
      cleanAddress();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Address</h1>
      <form className={loading ? "loading" : ""}>
        <div className="row cep">
          <input
            type="text"
            id="cep"
            name="cep"
            placeholder="CEP"
            value={form.cep}
            onChange={handleChange}
            onFocus={cleanCepError}
            onBlur={handleCepBlur}
            className={cepError ? "input-cep-error" : ""}
          />
          <img
            id="loading"
            src="https://i.imgur.com/F6v2N3j.gif"
            alt="loading"
            className={loading ? "" : "hidden"}
            width={28}
          />
        </div>
        <p id="cepError" className={cepError ? "" : "hidden"}>
          CEP inválido ou não encontrado.
        </p>

        <div className="row">
          <input
            type="text"
            id="street"
            name="rua"
            placeholder="Rua"
            value={form.rua}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <input
            type="text"
            id="number"
            name="numero"
            placeholder="Número"
            value={form.numero}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <input
            type="text"
            id="neighborhood"
            name="bairro"
            placeholder="Bairro"
            value={form.bairro}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <input
            type="text"
            id="city"
            name="cidade"
            placeholder="Cidade"
            value={form.cidade}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <input
            type="text"
            id="state"
            name="estado"
            placeholder="Estado"
            value={form.estado}
            onChange={handleChange}
          />
        </div>
      </form>
    </main>
  );
}
