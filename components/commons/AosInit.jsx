"use client"

import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from "react";
const AosInit=()=>{

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return <div></div>
}

export default AosInit