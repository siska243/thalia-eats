import AssistantsConnectes from "@/components/account/AssistantsConnectes";
import EditCompte from "@/components/account/EditCompte";
import Information from "@/components/account/Informations";

/** Le compte : les informations, l'adresse, le mot de passe, les assistants. */
export default function PageReglages() {
    return (
        <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
            <div className="mx-auto flex max-w-[1300px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-5">
                <header>
                    <h1 className="text-display font-extrabold text-secondaryColor">
                        Mon compte
                    </h1>
                    <p className="mt-1 text-caption text-ink-muted">
                        Vos informations, votre adresse de livraison, votre mot de passe et les
                        assistants connectés à votre compte.
                    </p>
                </header>

                <div className="rounded-card bg-surface shadow-card">
                    <Information />
                </div>

                <EditCompte />

                <AssistantsConnectes />
            </div>
        </div>
    );
}
