import { minamo } from "./minamo.js";

export module Slack
{
    export interface Application
    {
        client_id: string;
        client_secret: string;
    }
    type AppId = string;
    type UserId = string;
    type TeamId = string;
    type ChannelId = string;
    type BotId = string;
    type AccessToken = string;
    type UnixTime = number;
    export interface User
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
            authed_user:
            {
                id: UserId,
                scope: string,
                access_token: AccessToken,
                token_type: string,
            },
            team:
            {
                id: TeamId,
                name: string,
            },
            enterprise: unknown,
        }> =>
        minamo.http.getJson ( `https://slack.com/api/oauth.v2.access?client_id=${ application.client_id }&client_secret=${ application.client_secret }&code=${ code }&redirect_uri=${ redirect_uri }` );
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
    const makeHeading = ( tag: string, text: string ) =>
    ({
        tag,
        children: text,
    });
    export const start = async ( ): Promise<void> =>
    {
        minamo.dom.appendChildren
        (
            document.body,
            [
                makeHeading ( "h1", document.title ),
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
