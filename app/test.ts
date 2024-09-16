'use server';

import axios from 'axios';

export async function test(videoId: string) {
    'use server';

    const res = await axios.get(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
    });

    return res.data;
}