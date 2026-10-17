import {useEffect, useState} from "react";

/** Retarde la propagation d'une valeur : évite une requête par frappe. */
const useDebouncedValue = <T,>(value: T, delay = 350): T => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};

export default useDebouncedValue;
