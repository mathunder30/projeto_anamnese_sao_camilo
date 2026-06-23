import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes";
import pacienteRoutes from "./routes/PacienteRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/pacientes", pacienteRoutes);

app.get("/", (req, res) => {
  res.send("API Prontuário Rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
