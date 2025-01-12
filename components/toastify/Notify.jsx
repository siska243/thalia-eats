import React from "react";
import { toast } from "react-toastify";

// Composant de notification personnalisée
const ToastyNotification = ({ title }) => {
    return (
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {title}
        </div>
    );
};

// Fonction pour afficher une notification
const Notify = (title, type) => {
    toast(<ToastyNotification title={title} />, {
        type,
        position: "top-right",
        autoClose: 3000, // Temps d'affichage en millisecondes
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
    });
};

export default Notify;
