import { minamo } from "./minamo.js";

export module Slack
{
    export interface Application
    {
        client_id: string;
        client_secret: string;
    }
    export type AppId = string;
    export type UserId = string;
    export type TeamId = string;
    export type ChannelId = string;
    export type BotId = string;
    export type AccessToken = string;
    export type UnixTime = number;
    export interface AuthedUser
    {
        id: UserId;
        scope: string;
        access_token: string;
        token_type: string;
    }
    export interface Icon
    {
        image_24?: string;
        image_32?: string;
        image_34?: string;
        image_44?: string;
        image_48?: string;
        image_68?: string;
        image_72?: string;
        image_88?: string;
        image_102?: string;
        image_132?: string;
        image_192?: string;
        image_230?: string;
        image_512?: string;
        image_original?: string;


    }
    export interface Team
    {
        id: TeamId;
        name: string;
        domain: string;
        email_domain: string;
        icon: Icon;
    }
    export interface Label
    {
        value: string;
        creator: UserId;
        last_set: UnixTime;
    }
    export interface Channel
    {
        id: ChannelId;
        name: string;
        is_channel: true;
        created: UnixTime;
        is_archived: boolean;
        is_general: boolean;
        unlinked: number;
        creator: UserId;
        name_normalized: string;
        is_shared: boolean;
        is_org_shared: boolean;
        is_member: boolean;
        is_private: boolean;
        is_mpim: boolean;
        members: UserId[];
        topic: Label;
        purpose: Label;
        previous_names: string[];
        num_members: number;
    }
    export interface Status
    {
        status_text: string;
        status_emoji: string;
        status_expiration: UnixTime;
    }
    export interface Profile extends Status, Icon
    {
        avatar_hash: string;
        real_name: string;
        display_name: string;
        real_name_normalized: string;
        display_name_normalized: string;
        email: string;
        team: TeamId;
    }
    export interface User
    {
        id: UserId;
        team_id: TeamId;
        name: string;
        deleted: boolean;
        color: string;
        real_name: string;
        tz: string;
        tz_label: string;
        tz_offset: number;
        profile: Profile;
        is_admin: boolean;
        is_owner: boolean;
        is_primary_owner: boolean;
        is_restricted: boolean;
        is_ultra_restricted: boolean;
        is_bot: boolean;
        is_app_user: boolean;
        updated: UnixTime;
        has_2fa: boolean;
    }

    export const authorize =
    (
        application: Application,
        user_scope: string[],
        redirect_uri: string
    ) =>
        location.href = `https://slack.com/oauth/v2/authorize?client_id=${ application.client_id }&user_scope=${ user_scope.join ( "," ) }&redirect_uri=${ redirect_uri }`;
    export const oauthV2Access =
        async (
            application: Application,
            code: string,
            redirect_uri: string
        ):
        Promise<{
            ok: boolean,
            app_id: AppId,
            authed_user: AuthedUser,
            team:
            {
                id: TeamId,
                name: string,
            },
            enterprise: unknown,
        }> =>
        minamo.http.getJson ( `https://slack.com/api/oauth.v2.access?client_id=${ application.client_id }&client_secret=${ application.client_secret }&code=${ code }&redirect_uri=${ redirect_uri }` );
    export const usersInfo = async ( token: AccessToken, user: UserId ): Promise<{ ok: boolean, user: User }> =>
    minamo.http.getJson ( `https://slack.com/api/users.info?token=${ token }&user=${ user }` );
    export const teamInfo = async ( token: AccessToken ): Promise<{ ok: boolean, team: Team }> =>
        minamo.http.getJson ( `https://slack.com/api/team.info?token=${ token }` );
    export const channelsList = async ( token: AccessToken ): Promise<{ ok: boolean, channels: Channel[] }> =>
        minamo.http.getJson ( `https://slack.com/api/channels.list?token=${ token }`);
    export const emojiList = async ( token: AccessToken, limit: string ): Promise<{ ok: boolean, emoji: { [name: string]: string } }> =>
        minamo.http.getJson ( `https://slack.com/api/emoji.list?token=${ token }&limit=${ limit }` );
    export const chatPostMessage = async (
            token: AccessToken,
            data:
            {
                channel: ChannelId,
                text: string,
            }
        ):
        Promise<{
            ok: boolean,
            channel: ChannelId,
            ts: string,
            message:
            {
                bot_id: BotId,
                type: string,
                text: string,
                user: UserId,
                ts: string,
                team: TeamId,
                bot_profile:
                {
                    id: BotId,
                    deleted: boolean,
                    name: string,
                    updated: UnixTime,
                    app_id: AppId,
                    icons: Icon,
                    team_id: TeamId,
                }
            },
        }> =>
        minamo.http.postJson
        (
            `https://slack.com/api/chat.postMessage`,
            JSON.stringify ( data ),
            { Authorization: `Bearer ${token}` }
        );
    export const usersProfileSet = async (
            token: AccessToken,
            data: { profile: Status, }
        ):
        Promise<{
            ok: boolean,
            username: string,
            profile: Profile,
        }> =>
        minamo.http.postJson
        (
            `https://slack.com/api/users.profile.set`,
            JSON.stringify ( data ),
            { Authorization: `Bearer ${token}` }
        );
}

export module SlackFixedPhrase
{
    export interface Application extends Slack.Application
    {
        name: string;
    }

    export interface Identity
    {
        user: Slack.User;
        team: Slack.Team;
        token: Slack.AccessToken;
    }

    export interface HistoryItem
    {
        user: Slack.UserId;
        api: string;
        data: unknown;
    }

    const getApplicationList = (): Application[] => minamo.localStorage.getOrNull<Application[]>("application") ?? [];
    const setApplicationist = (list: Application[]) => minamo.localStorage.set("application", list);
    const getIdentityList = (): Identity[] => minamo.localStorage.getOrNull<Identity[]>("identities") ?? [];
    const setIdentityList = (list: Identity[]) => minamo.localStorage.set("identities", list);
    const getHistory = (user: Slack.UserId): HistoryItem[] => minamo.localStorage.getOrNull<HistoryItem[]>(`user:${user}.history`) ?? [];
    const setHistory = (user: Slack.UserId, list: HistoryItem[]) => minamo.localStorage.set(`user:${user}.history`, list);

    const getIdentity = (id: Slack.UserId): Identity => getIdentityList().filter(i => i.user.id === id)[0];

    export module dom
    {
        export const makeHeading = ( tag: string, text: minamo.dom.Source ) =>
        ({
            tag,
            children: text,
        });

        export const renderUser = (user: Slack.User) =>
        {
    
        };
        export const renderTeam = (team: Slack.Team) =>
        {
    
        };
        export const renderIdentity = (identity: Identity)=>
        ({
            tag: "div",
            className: "identity",
            children:
            [
                renderTeam(identity.team),
                renderUser(identity.user),
            ]
        });
        export const renderItemCore = (item: HistoryItem)=>
        {
            switch(item.api)
            {
            case "chatPostMessage":
                return JSON.stringify(item);
            case "usersProfileSet":
                return JSON.stringify(item);
            }
            return JSON.stringify(item);
        };
        export const renderItem = (item: HistoryItem)=>
        ({
            tag: "div",
            className: "item",
            children:
            [
                renderIdentity(getIdentity(item.user)),
                renderItemCore(item),
            ],
            onclick: () => execute(item),
        });

        const identityList = minamo.dom.make(HTMLDivElement)({ });
        export const updateIdentityList = () => minamo.dom.replaceChildren
        (
            identityList,
            getIdentityList().map
            (
                i =>
                [
                    makeHeading ( "h2", `${i.team.name} / ${i.user.name}` ),
                    makeHeading ( "h3", "Post Message" ),
                    makeHeading ( "h3", "Set Status" ),
                    makeHeading ( "h3", "History" ),
                    getHistory(i.user.id).map(renderItem),
                ],
            )
        );
        const applicationList = minamo.dom.make(HTMLDivElement)({ });
        export const updateApplicationList = () => minamo.dom.replaceChildren
        (
            applicationList,
            getApplicationList().map
            (
                i =>
                [
                    {
                        tag: "button",
                        children: `OAuth by ${i.name} API Key`,
                    },
                ],
            )
        );
    }

    const execute = async (item: HistoryItem) =>
    {
        const token = getIdentity(item.user).token;
        switch(item.api)
        {
        case "chatPostMessage":
            return await Slack.chatPostMessage(token, <any>item.data);
        case "usersProfileSet":
            return await Slack.usersProfileSet(token, <any>item.data);
        }
        return null;
    };

    export const start = async ( ): Promise<void> =>
    {
        minamo.dom.appendChildren
        (
            document.body,
            [
                dom.makeHeading ( "h1", document.title ),
                {
                    tag: "a",
                    className: "github",
                    children: "GitHub",
                    href: "https://github.com/wraith13/slac-fixed-phrase"
                },
                dom.updateIdentityList(),
                dom.makeHeading ( "h2", `Register User` ),
                dom.updateApplicationList(),
                dom.makeHeading ( "h2", `Register API Key` ),
                {
                    tag: "div",
                    className: "identity-from",
                    children:
                    [
                        {
                            tag: "label",
                            children:
                            [
                                "name",
                                {
                                    tag: "input",
                                    className: "identity-name",
                                }
                            ]
                        },
                        {
                            tag: "label",
                            children:
                            [
                                "client_id",
                                {
                                    tag: "input",
                                    className: "identity-client-id",
                                }
                            ]
                        },
                        {
                            tag: "label",
                            children:
                            [
                                "client_secret",
                                {
                                    tag: "input",
                                    className: "identity-client-secret",
                                }
                            ]
                        },
                        {
                            tag: "button",
                            children: "追加",
                        },
                    ]
                }
            ]
        );
    };
}
