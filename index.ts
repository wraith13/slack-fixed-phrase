import { minamo } from "./minamo.js";

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
