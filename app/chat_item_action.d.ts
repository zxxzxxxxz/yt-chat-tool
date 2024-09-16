export type run = {
    text: string,
    italics?: boolean,
    bold?: boolean
} | {
    emoji: {
        emojiId: string,
        shortcuts: string[],
        searchTerms: string[],
        supportsSkinTone?: boolean,
        image: {
            thumbnails: {
                url: string
            }[],
            accessibility: {
                accessibilityData: {
                    label: string,
                },
            },
        },
        variantIds: string[],
    }
};

type liveChatViewerEngagementMessageRenderer = {
    id: string,
    timestampUsec: string,
    icon: {
        iconType: "YOUTUBE_ROUND" | "INFO",
    },
    message: {
        runs: {
            text: string,
        }[],
    },
    actionButton: {
        buttonRenderer: {
            style: "STYLE_BLUE_TEXT",
            size: "SIZE_DEFAULT",
            isDisabled: boolean,
            text: {
                simpleText: string,
            },
            navigationEndpoint: {
                clickTrackingParams: string,
                commandMetadata: {
                    webCommandMetadata: {
                        url: string,
                        webPageType: string,
                        rootVe: number,
                    },
                },
                urlEndpoint: {
                    url: string,
                    target: string,
                },
            },
            trackingParams: string,
            accessibilityData: {
                accessibilityData: {
                    label: string,
                },
            },
        },
    },
    trackingParams: string,
};

type liveChatTextMessageRenderer = {
    liveChatTextMessageRenderer: {
        authorExternalChannelId: string,
        authorName: {
            simpleText: string
        },
        authorPhoto: {
            thumbnails: {
                url: string,
                height: number,
                width: number
            }[]
        },
        id: string,
        message: {
            runs: run[]
        },
        timestampUsec: string
    }
};

type liveChatPlaceholderItemRenderer = {
    liveChatPlaceholderItemRenderer: {
        id: string,
        timestampUsec: string,
    },
};

type addChatItemActionItem = liveChatViewerEngagementMessageRenderer | liveChatTextMessageRenderer | liveChatPlaceholderItemRenderer;

export type addChatItemAction = {
    item: addChatItemActionItem,
    clientId: string,
}

export type removeChatItemAction = {
    targetItemId: string
};

export type addBannerToLiveChatCommand = {
    bannerRenderer: {
        liveChatBannerRenderer: {
            header: {
                liveChatBannerHeaderRenderer: {
                    icon: {
                        iconType: string,
                    },
                    text: {
                        runs: {
                            text: string,
                        }[],
                    },
                    contextMenuButton: {
                        buttonRenderer: {
                            icon: {
                                iconType: string,
                            },
                            accessibility: {
                                label: string,
                            },
                            trackingParams: string,
                            accessibilityData: {
                                accessibilityData: {
                                    label: string,
                                },
                            },
                            command: {
                                clickTrackingParams: string,
                                commandMetadata: {
                                    webCommandMetadata: {
                                        ignoreNavigation: boolean,
                                    },
                                },
                                liveChatItemContextMenuEndpoint: {
                                    params: string,
                                },
                            },
                        },
                    },
                },
            },
            contents: {
                liveChatTextMessageRenderer: {
                    message: {
                        runs: {
                            text: string,
                        }[],
                    },
                    authorName: {
                        simpleText: string,
                    },
                    authorPhoto: {
                        thumbnails: [
                            {
                                url: string,
                                width: number,
                                height: number,
                            }
                        ],
                    },
                    id: string,
                    timestampUsec: string,
                    authorBadges: {
                        liveChatAuthorBadgeRenderer: {
                            icon: {
                                iconType: string,
                            },
                            tooltip: string,
                            accessibility: {
                                accessibilityData: {
                                    label: string,
                                },
                            },
                        },
                    }[],
                    authorExternalChannelId: string,
                    trackingParams: string,
                },
            },
            actionId: string,
            viewerIsCreator: boolean,
            targetId: string,
            isStackable: false,
            backgroundType: string,
            bannerProperties: {
                autoCollapseDelay: {
                    seconds: string,
                },
            },
            bannerType: string,
        },
    }
};

export type chatItemAction = {
    addChatItemAction: addChatItemAction
} | {
    removeChatItemAction: removeChatItemAction
} | {
    addBannerToLiveChatCommand: addBannerToLiveChatCommand
};