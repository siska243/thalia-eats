"use client";

import UpdateAdresse from "./UpdateAdresse";
import UpdatePassword from "./Updatepassword";

/** Les deux formulaires du compte, cote a cote des que l'ecran le permet. */
export default function EditCompte() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <UpdateAdresse />
            <UpdatePassword />
        </div>
    );
}
