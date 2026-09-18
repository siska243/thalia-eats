import React from "react";
import { toast } from "react-toastify";

// Composant de notification personnalisée
const ToastyNotification = ({ title,message }) => {
    return (
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            <h4 className={'text-muted font-bold'}>{title}</h4>
            <p>{message}</p>
        </div>
    );
};

/**
 * Affiche une notification.
 *
 * @param {string} title
 * @param {"success" | "error" | "info" | "warning"} type
 * @param {string | null} [message]
 */
const Notify = (title, type,message=null) => {
    toast(<ToastyNotification title={title} message={message} />, {
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
