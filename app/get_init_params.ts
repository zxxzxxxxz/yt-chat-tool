'use client';

import { ytCfg } from './yt_cfg';
import { ytInitialData } from './yt_initial_data';
import { axiosGet } from './axios_get';


export async function getInitParams(videoId: string) {
    'use client';

    const data = await axiosGet(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`);

    const ytCfg = (() => {
        const jsonString = data.match(/ytcfg\.set\(\{.*\}\)/)?.at(0)?.replace(/ytcfg\.set\((.*)\)/, '$1');
        return JSON.parse(jsonString ?? '{}') as ytCfg;
    })();

    const ytInitialData = (() => {
        const jsonString = data.match(/window\["ytInitialData"\] = \{.*\};/)?.at(0)?.replace(/window\["ytInitialData"\] = (.*);/, '$1');
        return JSON.parse(jsonString ?? '{}') as ytInitialData;
    })();

    return {
        innertube_api_key: ytCfg?.INNERTUBE_API_KEY ?? '',
        continuation: ytInitialData?.contents.liveChatRenderer.continuations.at(0)?.invalidationContinuationData.continuation ?? '',
        cver: ytInitialData?.responseContext.serviceTrackingParams.findLast(v => v.service == 'CSI')?.params.findLast(v => v.key == 'cver')?.value ?? '',
        actions: ytInitialData?.contents.liveChatRenderer.actions ?? []
    };
}