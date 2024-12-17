"use client"
import { FetchData } from '@/helpers/FetchData'
import { Route } from '@/helpers/Route'
import { requestPermission } from '@/hooks/useNotification'
import React, { useEffect } from 'react'

export default function NotificationProvider() {

    const handlerToken = async () => {
        const token = await requestPermission()
        if (token) {
            const response = await FetchData.sendData(Route.send_expo_token, { expo_token: token })
            console.log(response)
        }
    }

    useEffect(() => {
        if(localStorage !== undefined){
            handlerToken()
        }

    }, [])
    return (
        <div></div>
    )
}
