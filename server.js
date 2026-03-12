import express from "express";
const app = express();
const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Serveur webhook actif");
});
app.post("/webhook", (req, res) => {
     const payload = req.body;
    const branch = payload.ref ?? "inconnue";
    const repository = payload.repository?.full_name ?? "inconnu";
    const pusher = payload.pusher?.name ?? "inconnu";
    const headCommitMessage = payload.head_commit?.message ?? "aucun message";
    const modifiedFiles = payload.head_commit?.modified ?? [];
    console.log("Webhook reçu");
    console.log("Branche :", branch);
    console.log("Dépôt :", repository);
    console.log("Auteur du push :", pusher);
    console.log("Message du commit :", headCommitMessage);
    console.log("Fichiers modifiés :", modifiedFiles);
    res.status(200).json({
        status: "ok",
        message: "Webhook reçu avec succès"
    });
});
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});