"use client";
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import pusherClient from "@/lib/pusher";

export default function PusherProvider() {

    useEffect(() => {
        const channel = pusherClient.subscribe('channel-paiement')

        channel.bind('paiement-received', (data: { message: string }) => {
            console.log(data)
        })

        return () => {
            pusherClient.unsubscribe('channel-paiement')
        }
    }, [])


    return <></>;
}
