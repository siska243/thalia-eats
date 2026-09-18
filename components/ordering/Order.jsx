import CommandeList from "./CommandeList";

/** Le panneau panier. */
export default function Order({ordering, removeProduct}) {
    return (
        <div className="lg:sticky lg:top-[calc(var(--header-h)+16px)]">
            <CommandeList ordering={ordering ?? []} removeProduct={removeProduct} />
        </div>
    );
}
