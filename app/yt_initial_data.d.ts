import { chatItemAction } from './chat_item_action';

export type ytInitialData = {
    responseContext: {
        serviceTrackingParams: {
            service: string,
            params: {
                key: string,
                value: string,
            }[],
        }[],
        mainAppWebResponseContext: {
            loggedOut: boolean,
            trackingParam: string,
        },
        webResponseContextExtensionData: {
            hasDecorated: boolean,
        },
    },
    contents: {
        liveChatRenderer: {
            continuations: [
                {
                    invalidationContinuationData: {
                        invalidationId: {
                            objectSource: number,
                            objectId: string,
                            topic: string,
                            subscribeToGcmTopics: boolean,
                            protoCreationTimestampMs: string,
                        },
                        timeoutMs: number,
                        continuation: string,
                        clickTrackingParams: string,
                    },
                },
            ],
            actions: chatItemAction[]
        },
    }
}