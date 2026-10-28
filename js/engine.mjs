/** A transparent rule-based conversation engine. No model/API calls. */
export function normalize(input) {
  return String(input ?? '').normalize('NFKC').toLowerCase().replace(/a\s*\*/g, 'a star')
    .replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
}

export function newSession() {
  return { name: null, lastIntent: null, exchanges: 0, closed: false };
}

const rules = [
  { id: 'greeting', triggers: [/\b(?:hi|hello|hey|good morning|good afternoon|good evening)\b/],
    answer: name => `Hello${name ? `, ${name}` : ''}! I'm RuleFlow, a rule-based study assistant. Ask me about AI search, coding, internships, or GitHub.` },
  { id: 'bfs', triggers: [/\b(?:bfs|breadth first search|breadth first)\b/],
    answer: () => 'BFS explores states level by level using a FIFO queue. In an unweighted graph, it finds a shortest path by number of edges. It tracks visited states to avoid revisiting them.',
    more: 'BFS process: 1) enqueue the initial state, 2) dequeue a state, 3) check the goal, 4) enqueue its unseen neighbors, 5) repeat. Time: O(V + E); space: O(V).' },
  { id: 'dfs', triggers: [/\b(?:dfs|depth first search|depth first)\b/],
    answer: () => 'DFS follows one path deeply before backtracking, using a stack or recursion. It is useful for exploration but does not guarantee the shortest path.',
    more: 'Iterative DFS: push start, pop a state, visit its unseen neighbors, and repeat until the stack is empty or the goal is found. Time: O(V + E) with a visited set.' },
  { id: 'astar', triggers: [/\b(?:a\s*star|a\s*\*|a\s*\*\s*search|heuristic|manhattan)\b/],
    answer: () => 'A* selects the state with the lowest f(n) = g(n) + h(n), where g is the cost so far and h estimates the remaining cost. Manhattan distance works well for a four-direction grid.',
    more: 'To guarantee optimality, use a heuristic that never overestimates the remaining path cost. With four-direction movement of cost 1, h = |x1−x2| + |y1−y2|.' },
  { id: 'minimax', triggers: [/\b(?:minimax|tic tac toe|tictactoe|game tree)\b/],
    answer: () => 'Minimax searches possible game outcomes. The AI chooses a move that maximizes its score, assuming the opponent also plays optimally. It is ideal for Tic-Tac-Toe.',
    more: 'Assign scores to terminal boards: AI win = positive, human win = negative, draw = zero. Evaluate all legal moves recursively and select the move with the highest outcome for the AI.' },
  { id: 'github', triggers: [/\b(?:github|git|repository|commit|push|version control)\b/],
    answer: () => 'A simple Git workflow: git init → git add . → git commit -m "Initial commit" → connect a GitHub repository → git push -u origin main. Include a clear README and test instructions.',
    more: 'For a static HTML/CSS/JS project, you can publish from GitHub Pages. Keep source code, README, screenshots, and test results in your repository.' },
  { id: 'internship', triggers: [/\b(?:internship|assignment|submission|portfolio|project)\b/],
    answer: () => 'For a strong internship submission: fulfill each requirement, add input validation, write automated tests, document your algorithm, push to GitHub, then verify the live demo.',
    more: 'Submission checklist: source repository, working demo, ZIP or requested files, implementation remarks, and a small explanation of design choices and testing.' },
  { id: 'python', triggers: [/\b(?:python|javascript|coding|programming|code)\b/],
    answer: () => 'For coding practice, start with small, testable functions. Handle edge cases, name variables clearly, and check outputs with a few automated tests before building the interface.',
    more: 'A practical plan: understand inputs/outputs → design data structures → implement logic → test corner cases → integrate UI → document and deploy.' },
  { id: 'study', triggers: [/\b(?:study|learn|practice|revision|prepare|learning|roadmap)\b/],
    answer: () => 'Try a 45-minute learning sprint: 10 minutes reading, 25 minutes implementing, 10 minutes testing and writing notes. Repeat with gradually harder examples.',
    more: 'For classical AI: state representation → BFS/DFS → heuristics/A* → adversarial search/Minimax. Build one small working application per concept.' },
  { id: 'availability', triggers: [/\b(?:deadline|due date|current time|what time|weather|latest news)\b/],
    answer: () => 'I use fixed local rules, not live web data. Check the official dashboard or source for current deadlines, time, weather, or news.' },
  { id: 'thanks', triggers: [/\b(?:thanks|thank you|thankyou|appreciate)\b/],
    answer: () => 'You’re welcome! What would you like to learn next?' },
  { id: 'goodbye', triggers: [/\b(?:bye|goodbye|see you|exit|quit)\b/],
    answer: () => 'See you soon! Come back whenever you want to practice a new concept.' },
  { id: 'help', triggers: [/\b(?:help|menu|topics|what can you do)\b/],
    answer: () => 'I can explain BFS, DFS, A* search, Minimax, Git/GitHub, programming basics, study plans, and internship project submissions. Try a topic!' }
];

export const quickPrompts = [
  'Explain BFS', 'What is A* search?', 'How does Minimax work?',
  'GitHub tips', 'Internship checklist', 'Study plan'
];

export function respond(message, session = newSession()) {
  const text = normalize(message);
  if (!text) return { intent: 'empty', reply: 'Please type a question or choose one of the suggested prompts.' };
  session.exchanges += 1;
  // Personalization is intentionally narrow, not a claim of understanding unrestricted text.
  const nameMatch = text.match(/\b(?:my name is|call me|i am called)\s+([a-z][a-z '-]{0,30})$/);
  if (nameMatch) {
    const name = nameMatch[1].trim().replace(/\s+/g, ' ').split(/\s+(?:and|but|please)\b/)[0];
    session.name = name.split(' ').slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    session.lastIntent = 'name';
    session.closed = false;
    return { intent: 'name', reply: `Nice to meet you, ${session.name}! I'll remember your name during this chat.` };
  }
  if (/\b(?:what is my name|what's my name|do you know my name)\b/.test(text)) {
    session.lastIntent = 'recall';
    return { intent: 'recall', reply: session.name ? `You told me your name is ${session.name}.` : "I don't know your name yet. Try: My name is Alex." };
  }
  if (/^(?:tell me more|more|explain more|give me details|details|example)$/.test(text)) {
    const prior = rules.find(rule => rule.id === session.lastIntent);
    return { intent: 'followup', reply: prior?.more ?? 'Choose a topic first, like BFS, A*, or GitHub, and I can explain it further.' };
  }
  // Explicit topic requests should take precedence over broad greeting words.
  const ordered = [...rules.filter(r => !['greeting', 'thanks', 'goodbye', 'help'].includes(r.id)),
    ...rules.filter(r => ['goodbye', 'thanks', 'help', 'greeting'].includes(r.id))];
  const rule = ordered.find(r => r.triggers.some(pattern => pattern.test(text)));
  if (!rule) {
    session.lastIntent = null;
    session.closed = false;
    return { intent: 'fallback', reply: "I'm a rule-based bot, so I may not recognize that request. Try BFS, DFS, A*, Minimax, GitHub, or ask for 'help'." };
  }
  session.lastIntent = rule.id;
  session.closed = rule.id === 'goodbye';
  return { intent: rule.id, reply: rule.answer(session.name) };
}
