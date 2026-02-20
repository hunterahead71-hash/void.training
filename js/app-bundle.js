// CONFIG from js/config.js
// Load questions from backend - ONLY enabled questions, no defaults
async function loadTestQuestionsFromAPI() {
try {
const response = await fetch(`${CONFIG.API_BASE_URL}/api/test-questions/active`, {
credentials: 'include',
cache: 'no-store'
});
const data = await response.json();

if (data.success && data.questions && data.questions.length > 0) {
testState.questions = data.questions.map(q => ({
id: q.id,
username: q.username || 'User',
avatarColor: q.avatar_color || '#5865f2',
message: q.user_message,
keywords: Array.isArray(q.keywords) ? q.keywords : [],
required: q.required_matches || 2,
feedback: q.explanation || 'Follow protocol',
order: q.order ?? q.id ?? 0
}));
testState.questions.sort((a, b) => (a.order || 0) - (b.order || 0));
console.log('Loaded', testState.questions.length, 'question(s) from API');
return true;
} else {
testState.questions = [];
console.log('No enabled questions in database');
return false;
}
} catch (error) {
console.error('Error loading questions:', error);
testState.questions = [];
return false;
}
}

// Test Questions Data (fallback only, not used by default)
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

// Test State 
const testState = { 
active: false, 
currentQuestion: 0, 
score: 0, 
questions: [], // Start empty, will be loaded from API
userAnswers: [], 
questionsWithAnswers: [], 
userInfo: { username: 'User', userId: '0000' }, 

async reset() { 
this.active = false; 
this.currentQuestion = 0; 
this.score = 0; 
this.userAnswers = []; 
this.questionsWithAnswers = []; 
// Reload questions from API instead of using hardcoded ones
await loadTestQuestionsFromAPI();
},

initUser(username, userId) { 
this.userInfo.username = username || 'User'; 
this.userInfo.userId = userId || '0000'; 
}, 

getSubmissionData() { 
const conversationLog = this.formatConversationLog(); 
const total = this.questions?.length || 1; 
const passingScore = Math.ceil(total * 0.75); 
const passed = this.score >= passingScore; 

return { 
discordId: this.userInfo.userId, 
discordUsername: this.userInfo.username, 
answers: conversationLog, 
conversationLog: conversationLog, 
score: `${this.score}/${total}`, 
totalQuestions: total, 
correctAnswers: this.score, 
wrongAnswers: total - this.score, 
testResults: JSON.stringify({ 
passed: passed, 
percentage: Math.round((this.score / total) * 100), 
questions: this.questionsWithAnswers 
}) 
}; 
}, 

formatConversationLog() { 
let log = ''; 
const separator = '══════════════════════════════════════════════════════════════════════════════'; 
const total = this.questions?.length || 1; 
const passingScore = Math.ceil(total * 0.75); 

log += separator + '\n'; 
log += 'VOID ESPORTS MODERATOR CERTIFICATION TEST - COMPLETE TRANSCRIPT\n'; 
log += separator + '\n'; 
log += `User: ${this.userInfo.username} (${this.userInfo.userId})\n`; 
log += `Date: ${new Date().toLocaleString()}\n`; 
log += `Final Score: ${this.score}/${total}\n`; 
log += `Result: ${this.score >= passingScore ? 'PASSED ✓' : 'FAILED ✗'}\n`; 
log += separator + '\n\n'; 

this.questionsWithAnswers.forEach((qa, index) => { 
log += `┌──────────────────────────────────────────────────────────────────────────┐\n`; 
log += `│ QUESTION ${index + 1} of ${total}${qa.correct ? ' ✓ PASS' : ' ✗ FAIL'}\n`; 
log += `├──────────────────────────────────────────────────────────────────────────┤\n`; 
log += `│ USER: ${qa.question || 'Unknown'}\n`; 
log += `├──────────────────────────────────────────────────────────────────────────┤\n`; 
log += `│ MOD RESPONSE:\n`; 
log += `│ ${qa.answer || 'No answer provided'}\n`; 
log += `├──────────────────────────────────────────────────────────────────────────┤\n`; 
log += `│ EVALUATION:\n`; 
log += `│ Matches: ${qa.matchCount || 0}/${qa.requiredMatches || 2}\n`; 
log += `│ Keywords: ${qa.matchedKeywords ? qa.matchedKeywords.join(', ') : 'None'}\n`; 
log += `├──────────────────────────────────────────────────────────────────────────┤\n`; 
log += `│ CORRECT RESPONSE:\n`; 
log += `│ ${qa.feedback || 'Follow protocol'}\n`; 
log += `└──────────────────────────────────────────────────────────────────────────┘\n\n`; 
}); 

log += separator + '\n'; 
log += `END OF TRANSCRIPT - ${this.score}/${total} CORRECT\n`; 
log += separator + '\n'; 

return log; 
} 
}; 

// Auth Manager 
class AuthManager { 
constructor() { 
this.baseUrl = CONFIG.API_BASE_URL; 
} 

async startTest() { 
try { 
console.log("Starting test flow..."); 

const takeTestBtn = document.getElementById('takeTestBtn'); 
if (takeTestBtn) { 
takeTestBtn.innerHTML = ' Starting test...'; 
takeTestBtn.disabled = true; 
} 

const response = await fetch(`${this.baseUrl}/set-test-intent`, { 
method: 'GET', 
credentials: 'include' 
}); 

if (response.ok) { 
window.location.href = `${this.baseUrl}/auth/discord`; 
} else { 
throw new Error("Failed to set test intent"); 
} 
} catch (error) { 
console.error("Start test error:", error); 
alert("Failed to start test. Please try again."); 

const takeTestBtn = document.getElementById('takeTestBtn'); 
if (takeTestBtn) { 
takeTestBtn.innerHTML = ' Begin Certification Test'; 
takeTestBtn.disabled = false; 
} 
} 
} 

startAdminLogin() { 
window.location.href = `${this.baseUrl}/auth/discord/admin`; 
} 

async handleOAuthReturn() { 
const params = new URLSearchParams(window.location.search); 
const startTest = params.get('startTest'); 
const discordUsername = params.get('discord_username'); 
const discordId = params.get('discord_id'); 

if (startTest === '1' && discordUsername && discordId) { 
console.log("Returning from OAuth, starting test for:", discordUsername); 

testState.initUser(discordUsername, discordId); 

// Load questions from API before starting test
await loadTestQuestionsFromAPI();

const isMobile = window.innerWidth <= 768; 

if (isMobile) { 
mobileInterface.init(); 
mobileInterface.show(); 
mobileInterface.updateUserDisplay(); 
setTimeout(() => { 
mobileInterface.start(); 
}, 1000); 
} else { 
desktopInterface.init(); 
desktopInterface.show(); 
desktopInterface.updateUserDisplay(); 
setTimeout(() => { 
testLogic.start(false); 
}, 1000); 
} 
} 
}
} 

// Desktop Interface 
const desktopInterface = { 
elements: {}, 

init() { 
console.log('💻 Initializing desktop interface...'); 
this.cacheElements(); 
this.setupEventListeners(); 
}, 

cacheElements() { 
this.elements = { 
container: document.getElementById('testPage'), 
mainContainer: document.getElementById('mainContainer'), 
messages: document.getElementById('discordMessages'), 
input: document.getElementById('discordMessageInput'), 
sendBtn: document.getElementById('discordSendBtn'), 
typing: document.getElementById('discordTyping'), 
typingText: document.getElementById('discordTypingText'), 
score: document.getElementById('discordScore'), 
progress: document.getElementById('discordProgress'), 
ticketCounter: document.getElementById('discordTicketCounter'), 
modal: document.getElementById('discordModal'), 
modalIcon: document.getElementById('discordModalIcon'), 
modalTitle: document.getElementById('discordModalTitle'), 
modalScore: document.getElementById('discordModalScore'), 
modalMessage: document.getElementById('discordModalMessage'), 
modalStatus: document.getElementById('discordModalStatus'), 
reviewBtn: document.getElementById('discordReviewBtn'), 
backBtn: document.getElementById('discordBackBtn'), 
userName: document.getElementById('discordUserName'), 
userTag: document.getElementById('discordUserTag'), 
userAvatar: document.getElementById('discordUserAvatar'), 
memberName: document.getElementById('discordMemberName') 
}; 
}, 

setupEventListeners() { 
if (this.elements.input) { 
this.elements.input.addEventListener('input', () => { 
this.elements.input.style.height = 'auto'; 
this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 144) + 'px'; 
if (this.elements.sendBtn) { 
this.elements.sendBtn.disabled = !this.elements.input.value.trim() || !testState.active; 
} 
}); 

this.elements.input.addEventListener('keydown', (e) => { 
if (e.key === 'Enter' && !e.shiftKey) { 
e.preventDefault(); 
if (this.elements.sendBtn && !this.elements.sendBtn.disabled && testState.active) { 
testLogic.sendMessage(false); 
} 
} 
}); 
} 

if (this.elements.sendBtn) { 
this.elements.sendBtn.addEventListener('click', () => { 
testLogic.sendMessage(false); 
}); 
} 

if (this.elements.reviewBtn) { 
this.elements.reviewBtn.addEventListener('click', async () => { 
this.hideModal(); 
await testLogic.reset(); 
setTimeout(() => testLogic.start(false), 500); 
}); 
}

if (this.elements.backBtn) { 
this.elements.backBtn.addEventListener('click', () => { 
this.hideModal(); 
testLogic.exit(); 
}); 
} 
}, 

updateUserDisplay() { 
if (this.elements.userName) this.elements.userName.textContent = testState.userInfo.username; 
if (this.elements.userTag) this.elements.userTag.textContent = '#' + (testState.userInfo.userId.slice(-4) || '0000'); 
if (this.elements.userAvatar) this.elements.userAvatar.textContent = testState.userInfo.username.charAt(0).toUpperCase(); 
if (this.elements.memberName) this.elements.memberName.textContent = testState.userInfo.username; 
}, 

show() { 
if (this.elements.container) { 
this.elements.container.classList.add('active'); 
} 
if (this.elements.mainContainer) { 
this.elements.mainContainer.style.display = 'none'; 
} 
}, 

hide() { 
if (this.elements.container) { 
this.elements.container.classList.remove('active'); 
} 
if (this.elements.mainContainer) { 
this.elements.mainContainer.style.display = 'block'; 
} 
}, 

clearMessages() { 
if (this.elements.messages) { 
this.elements.messages.innerHTML = ''; 
} 
}, 

addMessage(username, content, color, isBot = false) { 
if (!this.elements.messages) return; 

const messageGroup = document.createElement('div'); 
messageGroup.className = 'discord-message-group'; 

const now = new Date(); 
const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); 

let avatarInitial = username.charAt(0).toUpperCase(); 
if (username === 'Void Bot') avatarInitial = 'V'; 
if (username === 'You') avatarInitial = testState.userInfo.username.charAt(0).toUpperCase(); 

messageGroup.innerHTML = ` 

${avatarInitial} 



${username} 
${isBot ? ' BOT ' : ''} 
Today at ${timeString} 

${content} 

`; 

this.elements.messages.appendChild(messageGroup); 
this.elements.messages.scrollTop = this.elements.messages.scrollHeight; 
}, 

async showTyping(username, duration) { 
if (this.elements.typing && this.elements.typingText) { 
this.elements.typingText.textContent = `${username} is typing...`; 
this.elements.typing.style.display = 'flex'; 
await new Promise(resolve => setTimeout(resolve, duration)); 
this.elements.typing.style.display = 'none'; 
} 
}, 

updateScore() { 
const total = testState.questions?.length || 1; 
if (this.elements.score) this.elements.score.textContent = testState.score; 
if (this.elements.progress) { 
const percentage = (testState.score / total) * 100; 
this.elements.progress.style.width = `${percentage}%`; 
} 
if (this.elements.ticketCounter) { 
this.elements.ticketCounter.textContent = `Ticket #${testState.currentQuestion + 1} of ${total}`; 
} 
}, 

disableInput(disabled) { 
if (this.elements.input) { 
this.elements.input.disabled = disabled; 
if (!disabled) this.elements.input.focus(); 
} 
if (this.elements.sendBtn) this.elements.sendBtn.disabled = disabled; 
}, 

clearInput() { 
if (this.elements.input) { 
this.elements.input.value = ''; 
this.elements.input.style.height = 'auto'; 
} 
}, 

showModal(passed) { 
if (!this.elements.modal) return; 

const total = testState.questions?.length || 1; 
const passingScore = Math.ceil(total * 0.75); 

if (this.elements.modalIcon) { 
this.elements.modalIcon.className = `discord-modal-icon ${passed ? 'pass' : 'fail'}`; 
this.elements.modalIcon.innerHTML = passed ? ' ' : ' '; 
} 

if (this.elements.modalTitle) { 
this.elements.modalTitle.textContent = passed ? 'Test Passed!' : 'Test Failed'; 
} 

if (this.elements.modalScore) { 
this.elements.modalScore.textContent = `${testState.score}/${total}`; 
} 

if (this.elements.modalMessage) { 
this.elements.modalMessage.textContent = passed 
? 'Congratulations! You passed the certification test. Your results have been submitted for review.' 
: `You scored ${testState.score}/${total}. The minimum passing score is ${passingScore}/${total}.`; 
} 

this.elements.modal.classList.add('active'); 
}, 

hideModal() { 
if (this.elements.modal) { 
this.elements.modal.classList.remove('active'); 
} 
}, 

setModalStatus(html) { 
if (this.elements.modalStatus) { 
this.elements.modalStatus.innerHTML = html; 
} 
} 
}; 

// Mobile Interface 
const mobileInterface = { 
elements: {}, 

init() { 
console.log('📱 Initializing mobile interface...'); 
this.cacheElements(); 
this.setupEventListeners(); 
}, 

cacheElements() { 
this.elements = { 
container: document.getElementById('mobileDiscord'), 
mainContainer: document.getElementById('mainContainer'), 
messages: document.getElementById('mobileMessagesContainer'), 
input: document.getElementById('mobileMessageInput'), 
sendBtn: document.getElementById('mobileSendBtn'), 
typing: document.getElementById('mobileTyping'), 
typingText: document.getElementById('mobileTypingText'), 
score: document.getElementById('mobileScore'), 
progress: document.getElementById('mobileProgress'), 
questionCounter: document.getElementById('mobileQuestionCounter'), 
channelName: document.getElementById('mobileChannelName'), 
sidebarUsername: document.getElementById('mobileSidebarUsername'), 
menuBtn: document.getElementById('mobileMenuBtn'), 
sidebar: document.getElementById('mobileSidebar'), 
closeSidebar: document.getElementById('mobileCloseSidebar'), 
scoreBtn: document.getElementById('mobileScoreBtn'), 
scorePanel: document.getElementById('mobileScorePanel'), 
closeScore: document.getElementById('mobileCloseScore'), 
modal: document.getElementById('mobileTestComplete'), 
modalIcon: document.getElementById('mobileResultIcon'), 
modalTitle: document.getElementById('mobileResultTitle'), 
modalScore: document.getElementById('mobileResultScore'), 
modalMessage: document.getElementById('mobileResultMessage'), 
modalStatus: document.getElementById('mobileSubmissionStatus'), 
reviewBtn: document.getElementById('mobileReviewBtn'), 
backBtn: document.getElementById('mobileBackBtn') 
}; 
}, 

setupEventListeners() { 
if (this.elements.input) { 
this.elements.input.addEventListener('input', () => { 
this.elements.input.style.height = 'auto'; 
this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 120) + 'px'; 
if (this.elements.sendBtn) { 
this.elements.sendBtn.disabled = !this.elements.input.value.trim() || !testState.active; 
} 
}); 

this.elements.input.addEventListener('keydown', (e) => { 
if (e.key === 'Enter' && !e.shiftKey) { 
e.preventDefault(); 
if (this.elements.sendBtn && !this.elements.sendBtn.disabled && testState.active) { 
this.sendMessage(); 
} 
} 
}); 
} 

if (this.elements.sendBtn) { 
this.elements.sendBtn.addEventListener('click', () => this.sendMessage()); 
} 

if (this.elements.menuBtn) { 
this.elements.menuBtn.addEventListener('click', () => { 
if (this.elements.sidebar) this.elements.sidebar.classList.add('active'); 
}); 
} 

if (this.elements.closeSidebar) { 
this.elements.closeSidebar.addEventListener('click', () => { 
if (this.elements.sidebar) this.elements.sidebar.classList.remove('active'); 
}); 
} 

if (this.elements.scoreBtn) { 
this.elements.scoreBtn.addEventListener('click', () => { 
if (this.elements.scorePanel) this.elements.scorePanel.classList.add('active'); 
}); 
} 

if (this.elements.closeScore) { 
this.elements.closeScore.addEventListener('click', () => { 
if (this.elements.scorePanel) this.elements.scorePanel.classList.remove('active'); 
}); 
} 

if (this.elements.reviewBtn) { 
this.elements.reviewBtn.addEventListener('click', async () => { 
this.hideModal(); 
await this.reset(); 
setTimeout(() => this.start(), 500); 
}); 
}

if (this.elements.backBtn) { 
this.elements.backBtn.addEventListener('click', () => { 
this.hideModal(); 
this.exit(); 
}); 
} 

document.addEventListener('click', (e) => { 
if (this.elements.sidebar && !this.elements.sidebar.contains(e.target) && 
!this.elements.menuBtn?.contains(e.target) && 
this.elements.sidebar.classList.contains('active')) { 
this.elements.sidebar.classList.remove('active'); 
} 

if (this.elements.scorePanel && !this.elements.scorePanel.contains(e.target) && 
!this.elements.scoreBtn?.contains(e.target) && 
this.elements.scorePanel.classList.contains('active')) { 
this.elements.scorePanel.classList.remove('active'); 
} 
}); 
}, 

updateUserDisplay() { 
if (this.elements.sidebarUsername) { 
this.elements.sidebarUsername.textContent = testState.userInfo.username; 
} 
}, 

show() { 
if (this.elements.container) { 
this.elements.container.classList.add('active'); 
} 
if (this.elements.mainContainer) { 
this.elements.mainContainer.style.display = 'none'; 
} 
}, 

hide() { 
if (this.elements.container) { 
this.elements.container.classList.remove('active'); 
} 
if (this.elements.mainContainer) { 
this.elements.mainContainer.style.display = 'block'; 
} 
}, 

clearMessages() { 
if (this.elements.messages) { 
this.elements.messages.innerHTML = ''; 
} 
}, 

addMessage(username, content, color, isBot = false) { 
if (!this.elements.messages) return; 

const messageGroup = document.createElement('div'); 
messageGroup.className = 'mobile-message-group'; 

const now = new Date(); 
const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); 

let avatarInitial = username.charAt(0).toUpperCase(); 
if (username === 'Void Bot') avatarInitial = 'V'; 
if (username === 'You') avatarInitial = testState.userInfo.username.charAt(0).toUpperCase(); 

messageGroup.innerHTML = ` 

${avatarInitial} 



${username} 
${isBot ? ' BOT ' : ''} 
Today at ${timeString} 

${content} 

`; 

this.elements.messages.appendChild(messageGroup); 
this.elements.messages.scrollTop = this.elements.messages.scrollHeight; 
}, 

async showTyping(username, duration) { 
if (this.elements.typing && this.elements.typingText) { 
this.elements.typingText.textContent = `${username} is typing...`; 
this.elements.typing.style.display = 'flex'; 
await new Promise(resolve => setTimeout(resolve, duration)); 
this.elements.typing.style.display = 'none'; 
} 
}, 

updateScore() { 
const total = testState.questions?.length || 1; 
if (this.elements.score) this.elements.score.textContent = testState.score; 
if (this.elements.progress) { 
const percentage = (testState.score / total) * 100; 
this.elements.progress.style.width = `${percentage}%`; 
} 
if (this.elements.questionCounter) { 
this.elements.questionCounter.textContent = `Question ${testState.currentQuestion + 1} of ${total}`; 
} 
if (this.elements.channelName) { 
this.elements.channelName.textContent = `🎫・mod-tickets • Q${testState.currentQuestion + 1}/${total}`; 
} 
}, 

disableInput(disabled) { 
if (this.elements.input) { 
this.elements.input.disabled = disabled; 
if (!disabled) setTimeout(() => this.elements.input.focus(), 100); 
} 
if (this.elements.sendBtn) this.elements.sendBtn.disabled = disabled; 
}, 

clearInput() { 
if (this.elements.input) { 
this.elements.input.value = ''; 
this.elements.input.style.height = 'auto'; 
} 
}, 

showModal(passed) { 
if (!this.elements.modal) return; 

if (this.elements.modalIcon) { 
this.elements.modalIcon.className = `mobile-test-result-icon ${passed ? 'pass' : 'fail'}`; 
this.elements.modalIcon.innerHTML = passed ? ' ' : ' '; 
} 

if (this.elements.modalTitle) { 
this.elements.modalTitle.textContent = passed ? 'Test Passed!' : 'Test Failed'; 
} 

const total = testState.questions?.length || 1; 
if (this.elements.modalScore) { 
this.elements.modalScore.textContent = `${testState.score}/${total}`; 
} 

if (this.elements.modalMessage) { 
this.elements.modalMessage.textContent = passed 
? 'Congratulations! You passed the certification test. Your results have been submitted for review.' 
: `You scored ${testState.score}/${total}. The minimum passing score is ${CONFIG.PASSING_SCORE}/${total}.`; 
} 

this.elements.modal.classList.add('active'); 
}, 

hideModal() { 
if (this.elements.modal) { 
this.elements.modal.classList.remove('active'); 
} 
}, 

setModalStatus(html) { 
if (this.elements.modalStatus) { 
this.elements.modalStatus.innerHTML = html; 
} 
}, 

async start() { 
console.log('🚀 Starting mobile test...'); 

// Load questions from API if not already loaded
if (!testState.questions || testState.questions.length === 0) {
await loadTestQuestionsFromAPI();
}

const totalQuestions = testState.questions?.length || 0; 
if (totalQuestions === 0) { 
console.error('No questions available!'); 
this.addMessage('Void Bot', 'There are no questions available at this time. Contact staff for help.', '#ed4245', true); 
return; 
}

testState.active = true; 
testState.currentQuestion = 0; 
testState.score = 0; 
testState.userAnswers = []; 
testState.questionsWithAnswers = []; 

this.clearMessages(); 
this.updateScore(); 
this.disableInput(true); 

await this.showTyping('Void Bot', 1000); 
this.addMessage('Void Bot', 'Welcome to the **Void Esports Moderator Certification Test**.', '#5865f2', true); 

await delay(800); 
await this.showTyping('Void Bot', 1200); 
this.addMessage('Void Bot', `You'll be presented with **${totalQuestions}** scenario${totalQuestions !== 1 ? 's' : ''}.`, '#5865f2', true); 

await delay(800); 
await this.showTyping('Void Bot', 800); 
this.addMessage('Void Bot', 'Respond as you would as a real moderator. Good luck!', '#5865f2', true); 

await delay(1500); 

this.showNextQuestion(); 
}, 

async showNextQuestion() { 
const totalQuestions = testState.questions?.length || 0; 
if (testState.currentQuestion >= totalQuestions) { 
this.endTest(); 
return; 
} 

const question = testState.questions[testState.currentQuestion]; 

await this.showTyping(question.username, 1200); 
this.addMessage(question.username, question.message, question.avatarColor, false); 

this.disableInput(false); 
this.updateScore(); 
}, 

async sendMessage() { 
if (!this.elements.input || !testState.active) return; 

const userMessage = this.elements.input.value.trim(); 
if (!userMessage) return; 

await this.processUserMessage(userMessage); 
}, 

async processUserMessage(userMessage) { 
this.disableInput(true); 

this.addMessage('You', userMessage, '#7289da', false); 

testState.userAnswers.push(userMessage); 
this.clearInput(); 

await this.showTyping('Void Bot', 1000); 

const question = testState.questions[testState.currentQuestion]; 
const result = this.evaluateAnswer(userMessage, question); 

testState.questionsWithAnswers.push({ 
question: question.message, 
answer: userMessage, 
correct: result.correct, 
matchCount: result.matches, 
requiredMatches: question.required, 
matchedKeywords: result.matchedKeywords || [], 
feedback: question.feedback 
}); 

let feedbackMsg = result.correct 
? `✅ **Correct!** ${question.feedback}` 
: `❌ **Not quite right.** ${question.feedback}`; 

this.addMessage('Void Bot', feedbackMsg, '#5865f2', true); 

if (result.correct) { 
testState.score++; 
} 

testState.currentQuestion++; 
this.updateScore(); 

const totalQuestions = testState.questions?.length || 0; 
if (testState.currentQuestion < totalQuestions) { 
await delay(1500); 
this.showNextQuestion(); 
} else { 
await delay(2000); 
this.endTest(); 
} 
}, 

evaluateAnswer(answer, question) { 
const answerLower = answer.toLowerCase(); 
let matches = 0; 
let matchedKeywords = []; 

for (const keyword of question.keywords) { 
if (answerLower.includes(keyword.toLowerCase())) { 
matches++; 
matchedKeywords.push(keyword); 
} 
} 

return { 
correct: matches >= question.required, 
matches: matches, 
matchedKeywords: matchedKeywords 
}; 
}, 

async endTest() { 
console.log('📝 Mobile test complete!'); 

testState.active = false; 
this.disableInput(true); 

await this.showTyping('Void Bot', 1000); 

const totalQuestions = testState.questions?.length || 1; 
const passingScore = Math.ceil(totalQuestions * 0.75); 
const passed = testState.score >= passingScore; 
const finalMsg = `**Test Complete!**\nFinal Score: **${testState.score}/${totalQuestions}**\nResult: **${passed ? 'PASSED ✅' : 'FAILED ❌'}**`; 

this.addMessage('Void Bot', finalMsg, '#5865f2', true); 

this.showModal(passed); 
await this.submitTestResults(); 
}, 

async submitTestResults() { 
const submissionData = testState.getSubmissionData(); 

this.setModalStatus(' Submitting results...'); 

try { 
console.log('Submitting test results...', submissionData); 

const response = await fetch(`${CONFIG.API_BASE_URL}/submit-test-results`, { 
method: 'POST', 
headers: { 
'Content-Type': 'application/json', 
'Accept': 'application/json' 
}, 
body: JSON.stringify(submissionData) 
}); 

const result = await response.json(); 
console.log('Submission response:', result); 

if (response.ok && result.success) { 
this.setModalStatus(' Results submitted successfully!'); 

const totalQuestions = testState.questions?.length || 1; 
const passingScore = Math.ceil(totalQuestions * 0.75); 
setTimeout(() => { 
window.location.href = `success.html?discord_username=${encodeURIComponent(testState.userInfo.username)}&final_score=${testState.score}/${totalQuestions}&pass_fail=${testState.score >= passingScore ? 'PASS' : 'FAIL'}`; 
}, 2000); 
} else { 
throw new Error('Submission failed'); 
} 

} catch (error) { 
console.error('Submission error:', error); 

try { 
const fallbackResponse = await fetch(`${CONFIG.API_BASE_URL}/api/submit`, { 
method: 'POST', 
headers: { 'Content-Type': 'application/json' }, 
body: JSON.stringify(submissionData) 
}); 

if (fallbackResponse.ok) { 
this.setModalStatus(' Results submitted!'); 

setTimeout(() => { 
window.location.href = `success.html?discord_username=${encodeURIComponent(testState.userInfo.username)}&final_score=${testState.score}/${testState.questions?.length || 1}&pass_fail=${testState.score >= CONFIG.PASSING_SCORE ? 'PASS' : 'FAIL'}`; 
}, 2000); 
return; 
} 
} catch (fallbackError) { 
console.error('Fallback also failed:', fallbackError); 
} 

this.setModalStatus(' Results saved locally'); 

setTimeout(() => { 
window.location.href = `success.html?discord_username=${encodeURIComponent(testState.userInfo.username)}&final_score=${testState.score}/${testState.questions?.length || 1}&pass_fail=${testState.score >= CONFIG.PASSING_SCORE ? 'PASS' : 'FAIL'}`; 
}, 2000); 
} 
}, 

async reset() { 
await testState.reset(); 
this.clearMessages(); 
this.updateScore(); 
this.disableInput(true); 
},

exit() { 
this.reset(); 
this.hide(); 
window.history.replaceState({}, document.title, window.location.pathname); 
} 
}; 

// Core Test Logic 
const testLogic = { 
async start(isMobile) { 
console.log('🚀 Starting test...'); 

// Load questions from API if not already loaded
if (!testState.questions || testState.questions.length === 0) {
await loadTestQuestionsFromAPI();
}

const totalQuestions = testState.questions?.length || 0; 
if (totalQuestions === 0) { 
console.error('No questions available!'); 
const ui = isMobile ? mobileInterface : desktopInterface; 
ui.clearMessages(); 
ui.addMessage('Void Bot', 'There are no questions available at this time. Contact staff for help.', '#ed4245', true); 
return; 
}

testState.active = true; 
testState.currentQuestion = 0; 
testState.score = 0; 
testState.userAnswers = []; 
testState.questionsWithAnswers = []; 

const ui = isMobile ? mobileInterface : desktopInterface; 

ui.clearMessages(); 
ui.updateScore(); 
ui.disableInput(true); 

await ui.showTyping('Void Bot', 1000); 
ui.addMessage('Void Bot', 'Welcome to the **Void Esports Moderator Certification Test**.', '#5865f2', true); 

await delay(800); 
await ui.showTyping('Void Bot', 1200); 
ui.addMessage('Void Bot', `You'll be presented with **${totalQuestions}** scenario${totalQuestions !== 1 ? 's' : ''}.`, '#5865f2', true); 

await delay(800); 
await ui.showTyping('Void Bot', 800); 
ui.addMessage('Void Bot', 'Respond as you would as a real moderator. Good luck!', '#5865f2', true); 

await delay(1500); 

this.showNextQuestion(isMobile); 
}, 

async showNextQuestion(isMobile) { 
const ui = isMobile ? mobileInterface : desktopInterface; 

const totalQuestions = testState.questions?.length || 1; 
if (testState.currentQuestion >= totalQuestions) { 
this.endTest(isMobile); 
return; 
} 

const question = testState.questions[testState.currentQuestion]; 

await ui.showTyping(question.username, 1200); 
ui.addMessage(question.username, question.message, question.avatarColor, false); 

ui.disableInput(false); 
ui.updateScore(); 
}, 

async sendMessage(isMobile) { 
const ui = isMobile ? mobileInterface : desktopInterface; 

if (!ui.elements.input || !testState.active) return; 

const userMessage = ui.elements.input.value.trim(); 
if (!userMessage) return; 

await this.processUserMessage(userMessage, isMobile); 
}, 

async processUserMessage(userMessage, isMobile) { 
const ui = isMobile ? mobileInterface : desktopInterface; 

ui.disableInput(true); 

ui.addMessage('You', userMessage, '#7289da', false); 

testState.userAnswers.push(userMessage); 
ui.clearInput(); 

await ui.showTyping('Void Bot', 1000); 

const question = testState.questions[testState.currentQuestion]; 
const result = this.evaluateAnswer(userMessage, question); 

testState.questionsWithAnswers.push({ 
question: question.message, 
answer: userMessage, 
correct: result.correct, 
matchCount: result.matches, 
requiredMatches: question.required, 
matchedKeywords: result.matchedKeywords || [], 
feedback: question.feedback 
}); 

let feedbackMsg = result.correct 
? `✅ **Correct!** ${question.feedback}` 
: `❌ **Not quite right.** ${question.feedback}`; 

ui.addMessage('Void Bot', feedbackMsg, '#5865f2', true); 

if (result.correct) { 
testState.score++; 
} 

testState.currentQuestion++; 
ui.updateScore(); 

const totalQuestions = testState.questions?.length || 1; 
if (testState.currentQuestion < totalQuestions) { 
await delay(1500); 
this.showNextQuestion(isMobile); 
} else { 
await delay(2000); 
this.endTest(isMobile); 
} 
}, 

evaluateAnswer(answer, question) { 
const answerLower = answer.toLowerCase(); 
let matches = 0; 
let matchedKeywords = []; 

for (const keyword of question.keywords) { 
if (answerLower.includes(keyword.toLowerCase())) { 
matches++; 
matchedKeywords.push(keyword); 
} 
} 

return { 
correct: matches >= question.required, 
matches: matches, 
matchedKeywords: matchedKeywords 
}; 
}, 

async endTest(isMobile) { 
console.log('📝 Test complete!'); 

const ui = isMobile ? mobileInterface : desktopInterface; 

testState.active = false; 
ui.disableInput(true); 

await ui.showTyping('Void Bot', 1000); 

const totalQuestions = testState.questions?.length || 1; 
const passingScore = Math.ceil(totalQuestions * 0.75); 
const passed = testState.score >= passingScore; 
const finalMsg = `**Test Complete!**\nFinal Score: **${testState.score}/${totalQuestions}**\nResult: **${passed ? 'PASSED ✅' : 'FAILED ❌'}**`; 

ui.addMessage('Void Bot', finalMsg, '#5865f2', true); 

const submissionData = testState.getSubmissionData(); 

ui.showModal(passed); 
await this.submitTestResults(submissionData, isMobile); 
}, 

async submitTestResults(data, isMobile) { 
const ui = isMobile ? mobileInterface : desktopInterface; 

ui.setModalStatus(' Submitting results...'); 

try { 
console.log('Submitting test results...', data); 

const response = await fetch(`${CONFIG.API_BASE_URL}/submit-test-results`, { 
method: 'POST', 
headers: { 
'Content-Type': 'application/json', 
'Accept': 'application/json' 
}, 
body: JSON.stringify(data) 
}); 

const result = await response.json(); 
console.log('Submission response:', result); 

if (response.ok && result.success) { 
ui.setModalStatus(' Results submitted successfully!'); 
} else { 
throw new Error('Submission failed'); 
} 

} catch (error) { 
console.error('Submission error:', error); 

try { 
const fallbackResponse = await fetch(`${CONFIG.API_BASE_URL}/api/submit`, { 
method: 'POST', 
headers: { 'Content-Type': 'application/json' }, 
body: JSON.stringify(data) 
}); 

if (fallbackResponse.ok) { 
ui.setModalStatus(' Results submitted!'); 
return; 
} 
} catch (fallbackError) { 
console.error('Fallback also failed:', fallbackError); 
} 

ui.setModalStatus(' Results saved locally'); 
} 
}, 

async reset() { 
await testState.reset(); 

const isMobile = window.innerWidth <= 768; 
const ui = isMobile ? mobileInterface : desktopInterface; 

ui.clearMessages(); 
ui.updateScore(); 
ui.disableInput(true); 
},

exit() { 
this.reset(); 

const isMobile = window.innerWidth <= 768; 
const ui = isMobile ? mobileInterface : desktopInterface; 

ui.hide(); 
window.history.replaceState({}, document.title, window.location.pathname); 
} 
}; 

// Utility Functions 
function delay(ms) { 
return new Promise(resolve => setTimeout(resolve, ms)); 
} 

// Initialize everything 
window.authManager = new AuthManager(); 
window.desktopInterface = desktopInterface; 
window.mobileInterface = mobileInterface; 
window.testLogic = testLogic; 
window.testState = testState; 
window.TEST_QUESTIONS = TEST_QUESTIONS;
window.loadTestQuestionsFromAPI = loadTestQuestionsFromAPI;

document.addEventListener('DOMContentLoaded', function() { 
console.log("DOM loaded"); 

// Navigation 
const navItems = document.querySelectorAll('.nav-item'); 
const sections = [ 
document.getElementById('header'), 
document.getElementById('ticket-types'), 
document.getElementById('roster-categories'), 
document.getElementById('mod-requirements'), 
document.getElementById('quiz') 
]; 

function updateActiveNav() { 
const scrollPosition = window.scrollY + 200; 

for (let i = sections.length - 1; i >= 0; i--) { 
const section = sections[i]; 
if (section && scrollPosition >= section.offsetTop) { 
navItems.forEach(item => item.classList.remove('active')); 
if (navItems[i]) navItems[i].classList.add('active'); 
break; 
} 
} 

if (window.scrollY < 100) { 
navItems.forEach(item => item.classList.remove('active')); 
if (navItems[0]) navItems[0].classList.add('active'); 
} 
} 

window.addEventListener('scroll', updateActiveNav); 
updateActiveNav(); 

navItems.forEach((item, index) => { 
item.addEventListener('click', function() { 
if (sections[index]) { 
sections[index].scrollIntoView({ behavior: 'smooth' }); 
navItems.forEach(n => n.classList.remove('active')); 
this.classList.add('active'); 
} 
}); 
}); 

// Quiz buttons 
document.getElementById('startQuizBtn')?.addEventListener('click', function() { 
document.getElementById('quizSection').style.display = 'block'; 
this.style.display = 'none'; 
document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active')); 
document.getElementById('question1').classList.add('active'); 
document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth' }); 
}); 

document.querySelectorAll('#skipAllQuizBtn, #skipAllQuestionsBtn').forEach(btn => { 
btn.addEventListener('click', function() { 
document.getElementById('quizSection').style.display = 'none'; 
document.getElementById('completionScreen').classList.add('active'); 
document.getElementById('completionScreen').scrollIntoView({ behavior: 'smooth' }); 
}); 
}); 

document.querySelectorAll('.check-answer-btn').forEach(btn => { 
btn.addEventListener('click', function() { 
const num = this.getAttribute('data-question'); 
document.getElementById(`feedback${num}`)?.classList.add('show'); 
}); 
}); 

document.querySelectorAll('.next-question-btn').forEach(btn => { 
btn.addEventListener('click', function() { 
const next = this.getAttribute('data-next'); 
document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active')); 
document.getElementById(`question${next}`)?.classList.add('active'); 
}); 
}); 

for (let i = 1; i <= 7; i++) { 
document.getElementById(`skipBtn${i}`)?.addEventListener('click', function() { 
let next = i < 7 ? i + 1 : 1; 
document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active')); 
document.getElementById(`question${next}`)?.classList.add('active'); 
}); 
} 

document.getElementById('completeQuizBtn')?.addEventListener('click', function() { 
document.getElementById('quizSection').style.display = 'none'; 
document.getElementById('completionScreen').classList.add('active'); 
}); 

document.getElementById('restartQuizBtn')?.addEventListener('click', function() { 
document.getElementById('completionScreen').classList.remove('active'); 
document.getElementById('quizSection').style.display = 'block'; 
document.querySelectorAll('.question-card').forEach(q => q.classList.remove('active')); 
document.getElementById('question1').classList.add('active'); 
document.getElementById('startQuizBtn').style.display = 'inline-flex'; 

for (let i = 1; i <= 7; i++) { 
const answer = document.getElementById(`answer${i}`); 
if (answer) answer.value = ''; 
} 
}); 

document.getElementById('takeTestBtn')?.addEventListener('click', function(e) { 
e.preventDefault(); 
window.authManager.startTest(); 
}); 

document.getElementById('adminLoginBtn')?.addEventListener('click', function(e) { 
e.preventDefault(); 
window.authManager.startAdminLogin(); 
}); 

// Handle OAuth return 
window.authManager.handleOAuthReturn(); 
}); 



