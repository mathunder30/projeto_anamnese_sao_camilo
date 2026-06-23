import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes";
import pacienteRoutes from "./routes/PacienteRoutes";
import anamneseRoutes from "./routes/AnamneseRoutes";
import enderecoRoutes from "./routes/EnderecoRoutes";
import avaliacaoClinicaRoutes from "./routes/AvaliacaoClinicaRoutes";
import prontuarioRoutes from "./routes/ProntuarioRoutes";
import atendimentoRoutes from "./routes/AtendimentoRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/pacientes", pacienteRoutes);
app.use("/anamneses", anamneseRoutes);
app.use("/enderecos", enderecoRoutes);
app.use("/avaliacoes-clinicas", avaliacaoClinicaRoutes);
app.use("/prontuarios", prontuarioRoutes);
app.use("/atendimentos", atendimentoRoutes);

app.get("/", (req, res) => {
  res.send("API Prontuário Rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
