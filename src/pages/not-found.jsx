import React, { useContext, useEffect } from "react";
import './not-found.css'
import { Authenticator } from "./shared/validate-token";
import { FrameContext } from "../app";
import { HeaderActionType } from "./frame/header";

export function NotFoundPage() {

    const setFrame = useContext(FrameContext);
    useEffect(()=> setFrame(HeaderActionType.PROFILE), []);
    return (
        <main id="not_found_main">
            Can't find page
        </main>
    );
}