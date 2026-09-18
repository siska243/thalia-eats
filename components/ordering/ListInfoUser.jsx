/** Une ligne d'information du client, avec son icone. */
export default function ListInfoUser({Icon, title, lastBorder}) {
    if (!title) return null;

    return (
        <div
            className={`flex items-center gap-3 py-3 ${
                lastBorder ? "" : "border-b border-surface-border"
            }`}
        >
            <Icon className="shrink-0 text-2xl text-ink-subtle" />
            <p className="min-w-0 break-words text-body text-ink">{title}</p>
        </div>
    );
}
