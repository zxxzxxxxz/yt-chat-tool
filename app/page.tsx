'use client';

import { useRef, useState, useEffect } from 'react';

import { getInitParams } from './get_init_params';
import { getLiveChat } from './get_live_chat';
import { run } from './chat_item_action';
import useInterval from 'use-interval';

export default function Home() {
  const [videoId, setVideoId] = useState('79XaA_4CYj8');
  const [apiKey, setApiKey] = useState('');
  const [continuation, setContinuation] = useState('');
  const [cver, setCver] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  type chatType = {
    userId: string,
    userName: string,
    authorPhoto: string,
    message: run[],
    timestamp: Date,
    removed: boolean
  };

  const [chats, setChats] = useState<Map<string, chatType>>(new Map());

  useEffect(() => {
    if (isScrollEnd) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  useInterval(async () => {
    if (apiKey && continuation) {
      await getChatData(apiKey, continuation, cver);
    }
  }, 1500);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      setIsScrollEnd(entries[0].isIntersecting);
    });
    observer.observe(chatEndRef.current!);
    return () => observer.disconnect();
  }, []);

  async function getInitData(videoId: string) {
    const res = await getInitParams(videoId);

    console.log('data: ' + res.error);

    setApiKey(res.innertube_api_key);
    setContinuation(res.continuation);
    setCver(res.cver);

    setChats(chats => {
      const addChatItemActions = res.actions.filter(action => 'addChatItemAction' in action);

      if (addChatItemActions.length == 0) return chats;

      chats = structuredClone(chats);

      for (const action of addChatItemActions) {
        if ('liveChatTextMessageRenderer' in action.addChatItemAction.item) {
          const chatId = action.addChatItemAction.item.liveChatTextMessageRenderer.id;
          const userId = action.addChatItemAction.item.liveChatTextMessageRenderer.authorExternalChannelId;
          const userName = action.addChatItemAction.item.liveChatTextMessageRenderer.authorName.simpleText;
          const authorPhoto = action.addChatItemAction.item.liveChatTextMessageRenderer.authorPhoto.thumbnails.at(0)?.url ?? '';
          const message = action.addChatItemAction.item.liveChatTextMessageRenderer.message.runs;
          const timestamp = new Date(Number.parseInt(action.addChatItemAction.item.liveChatTextMessageRenderer.timestampUsec) / 1000);
          const removed = false;

          chats.set(chatId, {
            userId,
            userName,
            authorPhoto,
            message,
            timestamp,
            removed
          });
        }
      }

      return chats;
    });

    setChats(chats => {
      const removeChatItemActions = res.actions.filter(action => 'removeChatItemAction' in action);

      if (removeChatItemActions.length == 0) return chats;

      chats = structuredClone(chats);

      for (const action of removeChatItemActions) {
        const chat = chats.get(action.removeChatItemAction.targetItemId);
        if (chat == null) continue;

        chat.removed = true;
        chats.set(action.removeChatItemAction.targetItemId, chat);
      }

      return chats;
    });
  }

  async function getChatData(apiKey: string, continuation: string, cver: string) {
    const res = await getLiveChat(apiKey, continuation, cver);

    if ('error' in res) {
      console.log(res.error);
      return;
    }

    const actions = res?.continuationContents.liveChatContinuation.actions;
    if (actions == null) return;

    setChats(chats => {
      const addChatItemActions = actions.filter(action => 'addChatItemAction' in action);

      if (addChatItemActions.length == 0) return chats;

      chats = structuredClone(chats);

      for (const action of addChatItemActions) {
        if ('liveChatTextMessageRenderer' in action.addChatItemAction.item) {
          const chatId = action.addChatItemAction.item.liveChatTextMessageRenderer.id;
          const userId = action.addChatItemAction.item.liveChatTextMessageRenderer.authorExternalChannelId;
          const userName = action.addChatItemAction.item.liveChatTextMessageRenderer.authorName.simpleText;
          const authorPhoto = action.addChatItemAction.item.liveChatTextMessageRenderer.authorPhoto.thumbnails.at(0)?.url ?? '';
          const message = action.addChatItemAction.item.liveChatTextMessageRenderer.message.runs;
          const timestamp = new Date(Number.parseInt(action.addChatItemAction.item.liveChatTextMessageRenderer.timestampUsec) / 1000);
          const removed = false;

          chats.set(chatId, {
            userId,
            userName,
            authorPhoto,
            message,
            timestamp,
            removed
          });
        }
      }

      return chats;
    });

    setChats(chats => {
      const removeChatItemActions = actions.filter(action => 'removeChatItemAction' in action);

      if (removeChatItemActions.length == 0) return chats;

      chats = structuredClone(chats);

      for (const action of removeChatItemActions) {
        const chat = chats.get(action.removeChatItemAction.targetItemId);
        if (chat == null) continue;

        chat.removed = true;
        chats.set(action.removeChatItemAction.targetItemId, chat);
      }

      return chats;
    });

    setContinuation(continuation => {
      return res?.continuationContents.liveChatContinuation.continuations.at(0)?.invalidationContinuationData.continuation ?? continuation;
    });
  }

  return (
    <div className="">
      <header className='shadow p-1 rounded sticky top-0 bg-slate-50'>
        <div className='gap-1 flex'>
          <input type="text" className='shadow appearance-none border rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' value={videoId} onInput={(event) => setVideoId(event.currentTarget.value)}></input>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline" style={{ textWrap: 'nowrap' }} onClick={async () => {
            await getInitData(videoId);
          }}>接続</button>
        </div>
      </header>
      <main className='p-3'>

        <div>
          <table id='chat_table' className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              {Array.from(chats.entries()).map(([chatId, chat]) => <tr key={chatId} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${chat.removed ? 'blur' : ''}`}>
                <td className="p-1">
                  <p className=''>{`${chat.timestamp.getHours().toString().padStart(2, '0')}:${chat.timestamp.getMinutes().toString().padStart(2, '0')}`}</p>
                </td>
                <td className="p-1">
                  <img src={chat.authorPhoto} className='rounded-full size-5' />
                </td>
                <td>
                  <p>{chat.userName}</p>
                </td>
                <td className="p-1">
                  <p>{chat.message.map(run => {
                    if ('text' in run) return run.text;
                    if ('emoji' in run) return <img key={run.emoji.emojiId} src={run.emoji.image.thumbnails.at(0)?.url} className='inline size-4' />
                  })}</p>
                </td>
              </tr>)}
            </tbody>
          </table>
          <div ref={chatEndRef} />
        </div>

      </main>
      <footer className='sticky bottom-0'>
        <div className='w-full flex justify-center pb-5'>
          <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold size-10 rounded-full focus:outline-none focus:shadow-outline transition-opacity mb-5 ${isScrollEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}>↓</button>
        </div>
      </footer>
    </div>
  );
}
