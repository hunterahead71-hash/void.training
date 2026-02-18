// Test Questions Data
const TEST_QUESTIONS = [
    {
        id: 1,
        username: "FortnitePlayer23",
        avatarColor: "#5865f2",
        message: "hey i wanna join void esports, what do i need to do?",
        keywords: ["age", "how old", "roster", "channel", "requirement", "hello", "welcome"],
        required: 2,
        feedback: "Ask for their age and direct them to #how-to-join-roster. Always start with a professional greeting."
    },
    {
        id: 2,
        username: "CompPlayer99",
        avatarColor: "#ed4245",
        message: "i want to join as a pro player, i have earnings from fncs",
        keywords: ["tracker", "earnings", "proof", "trapped", "ping", "senior"],
        required: 2,
        feedback: "Request their Fortnite Tracker link to verify earnings, then ping @trapped for pro team review."
    },
    {
        id: 3,
        username: "CreativeBuilder",
        avatarColor: "#3ba55c",
        message: "looking to join creative roster, i have some clips",
        keywords: ["clip", "video", "footage", "creativedepartment", "send", "review"],
        required: 2,
        feedback: "Ask for at least 2 clips of their freebuilding and ping @creativedepartment for review."
    },
    {
        id: 4,
        username: "AcademyGrinder",
        avatarColor: "#f59e0b",
        message: "can i join academy? i have 5k PR and i'm 15",
        keywords: ["tracker", "verify", "username", "add void", "team.void", "change"],
        required: 2,
        feedback: "Verify their PR via Fortnite Tracker, ask them to add 'Void' to their username and provide proof of using team.void."
    },
    {
        id: 5,
        username: "YoungPlayer14",
        avatarColor: "#9146ff",
        message: "im 12 but i really want to join",
        keywords: ["sorry", "minimum age", "13", "requirement", "cannot", "policy"],
        required: 2,
        feedback: "Politely inform them the minimum age requirement is 13 - no exceptions. Thank them for their interest."
    },
    {
        id: 6,
        username: "GrinderAccount",
        avatarColor: "#1da1f2",
        message: "i wanna be a void grinder, what's required?",
        keywords: ["username", "add void", "team.void", "proof", "change", "represent"],
        required: 2,
        feedback: "Explain they need to add 'Void' to their Discord and Fortnite usernames, plus provide proof of using team.void."
    },
    {
        id: 7,
        username: "ToxicUser123",
        avatarColor: "#ff0000",
        message: "this server is trash im gonna raid it",
        keywords: ["chief", "trapped", "ping", "threat", "security", "alert", "emergency"],
        required: 2,
        feedback: "IMMEDIATE THREAT - Ping @chief and @trapped immediately, screenshot the message, do NOT engage with the user."
    },
    {
        id: 8,
        username: "ContentCreatorYT",
        avatarColor: "#ff0000",
        message: "i make fortnite videos, can i join content team?",
        keywords: ["social", "links", "contentdep", "ping", "youtube", "channel", "review"],
        required: 2,
        feedback: "Ask for their social media links (YouTube/TikTok/Twitch) and ping @contentdep for review."
    }
];

// Make questions globally available
window.TEST_QUESTIONS = TEST_QUESTIONS;
