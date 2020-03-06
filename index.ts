import { minamo } from "./minamo.js";

export module Slack
{
    export interface Application
    {
        client_id: string;
        client_secret: string;
    }
    export interface User
    {
        id: string;
        scope: string;
        access_token: string;
        token_type: string;
    }
    export interface Icon
    {
        image_34: string;
        image_44: string;
        image_68: string;
        image_88: string;
        image_102: string;
        image_132: string;
        image_230: string;
        image_original: string;

    }
    export interface Team
    {
        id: string;
        name: string;
        domain: string;
        email_domain: string;
        icon: Icon;
    }
    export interface Profile extends Icon
    {
        avatar_hash: string;
        status_text: string;
        status_emoji: string;
        status_expiration: number;
        real_name: string;
        display_name: string;
        real_name_normalized: string;
        display_name_normalized: string;
        email: string;
        team: string;
    }
}

export module SlackFixedPhrase
{
    const makeHeading = (tag: string, text: string) =>
    (
        {
            tag,
            children: text,
        }
    );
    export const start = async (): Promise<void> =>
    {
        minamo.dom.appendChildren
        (
            document.body,
            [
                makeHeading("h1", document.title),
                {
                    tag: "a",
                    className: "github",
                    children: "GitHub",
                    href: "https://github.com/wraith13/slac-fixed-phrase"
                },
            ]
        );
    };
}
