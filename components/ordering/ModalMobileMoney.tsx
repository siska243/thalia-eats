"use client";

import React from "react";
import Link from "next/link";
import {ActionIcon, Button, Checkbox, Modal, Text, Title} from "rizzui";
import {XMarkIcon} from "@heroicons/react/20/solid";
import {FaCircleArrowRight} from "react-icons/fa6";
import PhoneNumber from "@/components/forms/phone-number";
import Spinner from "@/components/Loader/Spinner";

/**
 * La saisie du numero debite en mobile money.
 *
 * Extraite de `app/checkout/page.tsx`, pour que le lien de paiement d'une
 * pre-commande ouvre exactement la meme fenetre qu'une commande ordinaire.
 *
 * La case a cocher etait redigee en anglais sur un site entierement francais,
 * et ses deux liens ne menaient nulle part : ils pointent sur /privacy.
 */
export type ModalMobileMoneyProps = {
    ouvert: boolean;
    onClose: () => void;
    phone: string | null;
    onPhone: (valeur: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    enCours: boolean;
    /** Un mot sous le champ, quand le numero du destinataire est deja connu. */
    aide?: React.ReactNode;
};

export default function ModalMobileMoney({
    ouvert,
    onClose,
    phone,
    onPhone,
    onSubmit,
    enCours,
    aide,
}: ModalMobileMoneyProps) {
    return (
        <Modal isOpen={ouvert} onClose={onClose} containerClassName="bg-white">
            <form className="px-6 pb-8 pt-6 sm:px-7" onSubmit={onSubmit}>
                <div className="mb-6 flex items-center justify-between gap-3">
                    <Title as="h3" className="!text-title !font-bold">
                        Paiement mobile money
                    </Title>

                    <ActionIcon size="sm" variant="text" onClick={onClose}>
                        <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
                    </ActionIcon>
                </div>

                <PhoneNumber
                    className="mb-5 w-full"
                    country="cd"
                    value={phone ?? ""}
                    onChange={(valeur: string) => onPhone(valeur)}
                    inputProps={{name: "phone", required: true, autoFocus: true}}
                    preferredCountries={["cd"]}
                    label="Votre numéro de téléphone"
                    helperText={aide}
                />

                <Checkbox
                    size="lg"
                    inputClassName="border-2"
                    required
                    label={
                        <Text className="text-caption">
                            J&apos;accepte les conditions d&apos;utilisation et la{" "}
                            <Link href="/privacy" className="underline underline-offset-4">
                                politique de confidentialité
                            </Link>{" "}
                            de Thalia Eats.
                        </Text>
                    }
                />

                <Button
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-brand-500 py-3.5 text-white hover:bg-brand-600"
                    type="submit"
                    size="md"
                    disabled={enCours}
                >
                    {enCours ? (
                        <Spinner />
                    ) : (
                        <>
                            <FaCircleArrowRight />
                            <span className="text-body font-semibold">
                                Je confirme le paiement
                            </span>
                        </>
                    )}
                </Button>
            </form>
        </Modal>
    );
}
