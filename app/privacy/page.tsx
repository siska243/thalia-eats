export default function PrivacyPolicy() {
    return (
        <div className="min-h-svh bg-surface-sunken pt-[var(--header-h)]">
            <div className="mx-auto max-w-2xl px-4 py-10 text-body leading-7 text-ink sm:px-5">
                <h1 className="mb-2 text-display font-extrabold text-secondaryColor">Politique de Confidentialité – Thalia Eats</h1>
                <p className="mb-6 text-caption text-ink-muted"><strong>Dernière mise à jour :</strong> 19/11/2025</p>
                <p className="mb-4">Chez Thalia Eats, la confidentialité de vos données est une priorité. Cette
                    politique explique comment nous collectons, utilisons, partageons et protégeons vos informations
                    lorsque vous utilisez notre application ou site web à Kinshasa.</p>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">1. Informations que nous collectons</h2>
                <ul className="mb-4 list-disc space-y-1 pl-5 text-ink-muted">
                    <li>Données personnelles : nom, adresse, numéro de téléphone, email</li>
                    <li>Données de localisation</li>
                    <li>Historique de commandes</li>
                </ul>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">2. Utilisation de vos données</h2>
                <p className="mb-2">Nous utilisons vos données pour :</p>
                <ul className="mb-4 list-disc space-y-1 pl-5 text-ink-muted">
                    <li>Livrer vos repas efficacement</li>
                    <li>Personnaliser votre expérience</li>
                    <li>Vous envoyer des notifications et offres</li>
                </ul>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">3. Partage avec des tiers</h2>
                <p className="mb-2">Vos données peuvent être partagées avec :</p>
                <ul className="mb-4 list-disc space-y-1 pl-5 text-ink-muted">
                    <li>Nos livreurs partenaires</li>
                    <li>Prestataires de services de paiement</li>
                    <li>Services d’analyse anonymisée</li>
                </ul>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">4. Sécurité</h2>
                <p className="mb-4">Nous mettons en place des mesures de sécurité pour protéger vos informations.</p>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">5. Vos droits</h2>
                <p className="mb-4">Vous pouvez demander l’accès, la modification ou la suppression de vos données à
                    tout moment via notre support.</p>

                <h2 className="mb-2 mt-8 text-title font-bold text-secondaryColor">6. Contact</h2>
                <p>
                    Pour toute question : <a href="https://thaliaeats.com/" target="_blank" rel="noopener noreferrer"
                                             className="font-semibold text-brand-600 underline underline-offset-4">https://thaliaeats.com/</a>
                </p>
            </div>
        </div>
    );
}
