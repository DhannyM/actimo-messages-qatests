export interface MessageTitle {
    title: string;
    description: string;
}

export const messageTitles: MessageTitle[] = [
    {
        "title": "Short",
        "description": "short title"
    },
    {
        "title": "A".repeat(100),
        "description": "very long title"
    },
    {
        "title": "Hello & World!",
        "description": "title with special characters"
    },
    {
        "title": "日本語タイトル",
        "description": "non-english characters"
    }
]