import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
    /** Ombre plus marquee, pour ce qui flotte au-dessus du reste. */
    raised?: boolean;
    as?: "div" | "article" | "section" | "li";
}

/** Surface blanche du systeme : meme rayon et meme ombre que sur le mobile. */
export default function Card({children, className = "", raised, as = "div"}: Props) {
    const Balise = as;

    return (
        <Balise
            className={`rounded-card bg-surface ${raised ? "shadow-raised" : "shadow-card"} ${className}`}
        >
            {children}
        </Balise>
    );
}
