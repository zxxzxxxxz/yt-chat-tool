'use server';

import axios from 'axios';
import { chatItemAction } from './chat_item_action';

export type youtubeChatModel = {
    continuationContents: {
        liveChatContinuation: {
            actions?: chatItemAction[],
            continuations: {
                invalidationContinuationData: {
                    continuation: string
                }
            }[]
        }
    },
    responseContext: {
        serviceTrackingParams: {
            service: string,
            params: {
                key: string,
                value: string
            }[]
        }[]
    }
};

export async function getLiveChat(apiKey: string, continuation: string, cver: string) {
    const res = await axios.post<youtubeChatModel>('https://www.youtube.com/youtubei/v1/live_chat/get_live_chat', {
        context: {
            client: {
                clientName: 'WEB',
                clientVersion: cver,
                timeZone: 'Asia/Tokyo',
                utcOffsetMinutes: 540,
                mainAppWebInfo: {
                    graftUrl: `https://www.youtube.com/live_chat?continuation=`,
                },
            },
            request: {
                useSsl: true,
            },
        },
        continuation: continuation
    }, {
        params: {
            key: apiKey
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
    });

    return res.data;
}