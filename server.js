import express from "express";
import SmeeClient from "smee-client";
// =====================================================================
// TD - ETAPE  : Configuration du proxy Smee
// Smee.io est un service de proxy webhook qui permet de recevoir
// des événements GitHub sur un serveur local (non accessible publiquement)
// En production, GitHub contacterait directement ton serveur
// =====================================================================
const WEBHOOK_PROXY_URL = "https://smee.io/<votre clé>"; // À déplacer dans un .env
const PORT = 3000;
const app = express();
// =====================================================================
// TD - ETAPE  : Initialisation du client Smee
// SmeeClient crée un tunnel entre smee.io et ton serveur local :
//   source : l'URL publique que GitHub va appeler
//   target : ton serveur local qui reçoit les requêtes redirigées
// =====================================================================
const smee = new SmeeClient({
    source: WEBHOOK_PROXY_URL,
    target: `http://localhost:${PORT}/webhook`,
    logger: console, // Affiche "Connected" et "Forwarding" dans le terminal
});
smee.start(); // Démarre l'écoute du tunnel SSE (Server-Sent Events)
// =====================================================================
// TD - ETAPE  : Middlewares Express
// express.json()      → parse les requêtes avec Content-Type: application/json
// express.urlencoded  → nécessaire car Smee ré-encapsule le payload GitHub
//                       dans un champ "payload" en x-www-form-urlencoded
// Sans urlencoded, req.body serait vide (bug rencontré pendant le TD)
// =====================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Route de test pour vérifier que le serveur est actif
app.get("/", (req, res) => {
    res.send("Serveur webhook actif");
});
// =====================================================================
// TD - ETAPE: Réception et traitement du webhook GitHub
// GitHub envoie un événement "push" → Smee le reçoit → le redirige ici
// Le payload contient toutes les infos du push (branche, commit, auteur...)
// =====================================================================
app.post("/webhook", (req, res) => {
    // TD - Particularité Smee : le vrai payload GitHub est encapsulé
    // dans req.body.payload sous forme de string JSON
    // Il faut le parser manuellement si c'est une string
    let payload = req.body;
    if (typeof req.body.payload === "string") {
        // ← on réassigne payload ! d'ou, let et pas const
        payload = JSON.parse(req.body.payload);
    }
    // Extraction des données utiles du payload GitHub
    // L'opérateur ?? (nullish coalescing) fournit une valeur par défaut
    // si la propriété est null ou undefined
    const branch = payload.ref ?? "inconnue";                          // ex: 
    "refs/heads/main"
    const repository = payload.repository?.full_name ?? "inconnu";    // ex: "user/mon-repo"
    const pusher = payload.pusher?.name ?? "inconnu";                  // ex: "john"
    const headCommitMessage = payload.head_commit?.message ?? "aucun message";
    const modifiedFiles = payload.head_commit?.modified ?? [];         // tableau de fichiers
    // TD - Affichage des informations dans le terminal du serveur
    console.log("Webhook reçu");
    console.log("Branche :", branch);
    console.log("Dépôt :", repository);
    console.log("Auteur du push :", pusher);
    console.log("Message du commit :", headCommitMessage);
    console.log("Fichiers modifiés :", modifiedFiles);
    // TD - Réponse HTTP 200 obligatoire pour que GitHub marque
    // le webhook comme "Delivery OK" dans l'interface GitHub
    res.status(200).json({
        status: "ok",
        message: "Webhook reçu avec succès",
    });
});
// =====================================================================
// TD - ETAPE : Démarrage du serveur
// Le serveur écoute sur le port 3000, même port que la target de Smee
// =====================================================================
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});