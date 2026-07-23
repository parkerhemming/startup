# Proxy 💘

# https://letsproxydating.com

## TODO

- [ ] Add error state texts on login page
- [ ] change drag and drop to this https://dndkit.com/react/hooks/use-droppable/
- [ ] On message page "12 people paired you togehter"

## 📝 Specification Deliverable

- [x] **Proper use of Markdown:** Utilized headers, lists, bold text, and HTML tables for clean formatting.
- [x] **Elevator Pitch:** A concise and compelling paragraph explaining the app's gamified matchmaking concept.
- [x] **Key Features:** Clear outline of core functionalities like Match Modes, consensus logic, and the coin economy.
- [x] **Technology Usage:** Detailed explanations of how HTML, CSS, React, Web Services (including a 3rd party API), Database, and WebSockets will be utilized.
- [x] **Design Sketches:** Embedded images of the application's layout and user flow.

## 📝 HTML Deliverable

- [x] **Login/Signup** Located in "index.html"
- [x] **Store** Located in "src/app/pages/store/store.html"
- [x] **Profile View** Located in "src/app/pages/profile-view/profile-view.html"
- [x] **Messages** Located in "src/app/pages/messages/messages.html"
- [x] **Message** Located in "src/app/pages/messages/message/message.html"
- [x] **Match Modes 1** Located in "src/app/pages/match-modes/match-mode-1/match-mode-1.html"
- [x] **Match Modes 2** Located in "src/app/pages/match-modes/match-mode-2/match-mode-2.html"
- [x] **Match Modes 3** Located in "src/app/pages/match-modes/match-mode-3/match-mode-3.html"
- [x] **Notifications** Located in "src/app/pages/notifications/notifications.html"

---

## 📝 CSS Deliverable

- [x] **Reset Styles** Located in "src/app/styles/reset.css"
- [x] **Global Styles** Located in "src/app/styles/global.css"
- [x] **Login/Signup** Located in "index.css"
- [x] **Store** Located in "src/app/pages/store/store.css"
- [x] **Profile View** Located in "src/app/pages/profile-view/profile-view.css"
- [x] **Messages** Located in "src/app/pages/messages/messages.css"
- [x] **Message** Located in "src/app/pages/messages/message/message.css"
- [x] **Match Modes 1** Located in "src/app/pages/match-modes/match-mode-1/match-mode-1.css"
- [x] **Match Modes 2** Located in "src/app/pages/match-modes/match-mode-2/match-mode-2.css"
- [x] **Match Modes 3** Located in "src/app/pages/match-modes/match-mode-3/match-mode-3.css"
- [x] **Notifications** Located in "src/app/pages/notifications/notifications.css"

---

## 📝 React Part 1 Deliverable

- [x] **Vite:** Bundled, compiled, and deployed single-page assets using Vite configuration pipelines.
- [x] **Components:** Refactored static views into functional React structures, breaking items down into reusable fragments and layout templates.
- [x] **Router:** Declared distinct app routes using browser navigation objects to transition cleanly between game mechanics, individual conversation logs, and setup forms.
- [x] **Hooks:** Managed active UI updates, dynamic array swapping, and profile session configurations natively with standard `useState` and `useEffect` rendering loops.

---

## 📝 React Part 2 Deliverable

- [x] **All functionality implemented or mocked:** The application is now fully interactive. Match Modes 1, 2, and 3 feature complete, cross-platform drag-and-drop matching mechanics using `@dnd-kit/core`. The Store is fully functional, validating balances and updating the UI when purchasing boosts or matches.
- [x] **Authentication & Route Blocking:** Started the Login and Signup flow. Implemented frontend route guards that check authentication status and block unauthenticated users from accessing the main application pages, safely redirecting them back to the login screen. _(Note: The actual secure validation and session management will be shifted to the backend)._
- [x] **Cross-Page State Management:** Set up a global utility/local storage system to persist and sync the user's coin balance and active boosts across different pages (e.g., spending coins in the Store updates the balance globally for when they navigate back to Match Modes).
- [x] **React Hooks (`useState`):** Extensively utilized `useState` across multiple components to manage complex data flow. This includes managing dynamic arrays of user objects during drag-and-drop swaps, tracking the exact pixel dimensions of actively dragged elements, and managing active chat logs.
- [x] **React Hooks (`useEffect`):** Implemented `useEffect` for component lifecycle events, such as dynamically updating the browser's document title to match the current active view (e.g., "Store | Proxy", "Pair | Proxy") and handling initial layout renders.

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

## 🚀 Elevator Pitch

Dating apps are exhausting, so we gamified the process. **Proxy** is a revolutionary dating platform where you play Cupid for the community. Instead of endlessly swiping for yourself, you participate in daily "Match Modes" to pair other users together. If the community reaches a consensus on your pair, they match, and you earn in-app coins! You can spend these coins to boost your own profile's visibility or bypass the consensus engine to handpick a guaranteed match for yourself. Proxy solves dating app burnout by making the search fun, communal, and highly rewarding.

## ✨ Key Features

- **Progressive Onboarding:** A clean, one-question-at-a-time registration flow, followed by an immersive, cinematic "Windows-OS style" tutorial that fades text in and out to explain the ecosystem.
- **Gamified Match Modes:** Three distinct daily mini-games with limited attempts:
    - _Mode 1:_ Drag and drop matching from a list of users.
    - _Mode 2:_ Find the perfect partner for one featured "Hero" profile from a grid of options.
    - _Mode 3:_ Draw lines to connect 4 profiles on the left to 4 on the right.
- **Consensus Engine:** A match only occurs when a specific percentage of matchmakers pair the same two people (scales dynamically based on active users in the area).
- **Dynamic Coin Economy:**
    - **Earn:** Coins are awarded when your pair reaches consensus, when they message each other, and when they submit a verified "date selfie."
    - **Spend:** Buy profile boosts (e.g., "Show to 3x more matchmakers") or purchase a direct, un-blockable match.
- **Economy Edge-Case Protections:**
    - _Anti-Spam:_ Earn +1 coin per message your pair sends, capped at 10 coins per day.
    - _Anti-Griefing:_ If your pair unmatches within 48 hours, you lose coins. After 48 hours, no penalty is applied.

## 🛠️ Technology Usage

### HTML

- Uses semantic HTML structure for the application layout.
- Forms and inputs for the progressive login and profile creation sequence.
- Structural elements for the matchmaking grids, the user lobby/store, and the real-time chat interface.

### CSS

- Custom CSS styling for a modern, minimalist UI (to avoid looking "super store-y").
- Keyframe animations for the "Windows-style" tutorial text fade-ins and fade-outs.
- Drag-and-drop visual states (hover, active, snap-to-target) and flexbox/grid layouts for the varying Match Modes.

### React

- Single Page Application (SPA) architecture utilizing React Router to transition between the Onboarding, Lobby, Match Modes, and Chat.
- Reusable functional components for UI elements (e.g., `ProfileCard`, `CoinBalance`, `InterestPill`).
- State management (e.g., `useState`, `useEffect`) to track the user's daily Match Mode limits, current coin balance, and active drag-and-drop pairing selections.

### Web Service

- Backend RESTful APIs built with Node.js/Express.
- **Authentication:** Endpoints to register, login, and securely store/validate user credentials.

### Database

- A NoSQL (e.g., MongoDB) or relational database to persistently store:
    - User profiles (Name, Bio, Interests, hashed passwords).
    - Economy data (Current coin balances, ledger of transactions).
    - Relationship graphs (Pending pairs, consensus vote tallies, active matches).

### WebSocket

- Real-time bidirectional communication pushed from the backend to the frontend.
- **Live Chat:** Powers the messaging system between matched users so messages appear instantly.
- **Push Notifications:** Immediately alerts a matchmaker with a live UI pop-up (and coin balance update) the exact second one of their suggested pairs reaches consensus and officially matches.

## 🎨 Design Sketches

Below are the rough UI sketches mapping out the user flow, Match Modes, Lobby, and logic.

<table style="width:100%; border-spacing:15px;">
  <tr>
    <td valign="top" width="50%">
      <b>Dashboard & Navigation:</b><br><br>
      <img src="/design_sketches/IMG_9956.HEIC" width="100%" alt="Dashboard"/>
    </td>
    <td valign="top" width="50%">
      <b>Other Details:</b><br><br>
      <img src="/design_sketches/IMG_9959.HEIC" width="100%" alt="Other Details"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Messaging:</b><br><br>
      <img src="/design_sketches/IMG_9957.HEIC" width="100%" alt="Messages Flow"/>
    </td>
    <td valign="top" width="50%">
      <b>External Facing Profile View (Super Brief Modal):</b><br><br>
      <img src="/design_sketches/IMG_9955.HEIC" width="100%" alt="Profile Click"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Onboarding, Progressive Login, & Tutorial Idea:</b><br><br>
      <img src="/design_sketches/IMG_9958.HEIC" width="100%" alt="Onboarding Flow"/>
    </td>
    <td valign="top" width="50%">
      <b>Match Mode 1 (Target Pairs):</b><br><br>
      <img src="/design_sketches/IMG_9952.HEIC" width="100%" alt="Match Mode 1"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Match Mode 2 (Hero Profile):</b><br><br>
      <img src="/design_sketches/IMG_9953.HEIC" width="100%" alt="Match Mode 2"/>
    </td>
    <td valign="top" width="50%">
      <b>Match Mode 3 (Line Connections):</b><br><br>
      <img src="/design_sketches/IMG_9954.HEIC" width="100%" alt="Match Mode 3"/>
    </td>
  </tr>
</table>
