/** Une ligne d'information du compte : un intitule, une valeur. */
export default function Info({titre, content, street, user}) {
    const valeur = street
        ? user?.street
            ? `Av. ${user.street}, N°${user.number_street}, C/ ${user?.town_id?.title ?? ""}`
            : null
        : content;

    return (
        <div className="flex flex-col gap-1">
            <p className="text-caption text-ink-muted">{titre}</p>

            <p
                className={`text-body font-semibold ${
                    valeur ? "text-secondaryColor" : "text-ink-subtle"
                }`}
            >
                {valeur ?? "À compléter"}
            </p>
        </div>
    );
}
