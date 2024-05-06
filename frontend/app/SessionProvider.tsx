'use client';
import { SessionProvider as Provider } from "next-auth/react";
import { BrowserRouter } from "react-router-dom";

type Props = {
    children: React.ReactNode
}

export default function SessionProvider({children}: Props) {
    return (
        <Provider>
            <BrowserRouter>
            {children}
            </BrowserRouter>
        </Provider>
    )
}