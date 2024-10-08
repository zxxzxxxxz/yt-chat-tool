'use server';

import axios from 'axios';
import { ytCfg } from './yt_cfg';
import { ytInitialData } from './yt_initial_data';

export async function getInitParams(videoId: string) {
    'use server';

    const res = await axios.get(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
    });

    const ytCfg = (() => {
        const jsonString = res.data.match(/ytcfg\.set\(\{.*\}\)/)?.at(0)?.replace(/ytcfg\.set\((.*)\)/, '$1');
        return JSON.parse(jsonString ?? '{}') as ytCfg;
    })();

    const ytInitialData = (() => {
        const jsonString = res.data.match(/window\["ytInitialData"\] = \{.*\};/)?.at(0)?.replace(/window\["ytInitialData"\] = (.*);/, '$1');
        return JSON.parse(jsonString ?? '{}') as ytInitialData;
    })();

    return {
        innertube_api_key: ytCfg?.INNERTUBE_API_KEY ?? '',
        continuation: ytInitialData?.contents.liveChatRenderer.continuations.at(0)?.invalidationContinuationData.continuation ?? '',
        cver: ytInitialData?.responseContext.serviceTrackingParams.findLast(v => v.service == 'CSI')?.params.findLast(v => v.key == 'cver')?.value ?? '',
        actions: ytInitialData?.contents.liveChatRenderer.actions ?? []
    };
}