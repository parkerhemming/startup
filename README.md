# Proxy 💘

## 📝 Specification Deliverable

- [x] **Proper use of Markdown:** Utilized headers, lists, bold text, and HTML tables for clean formatting.
- [x] **Elevator Pitch:** A concise and compelling paragraph explaining the app's gamified matchmaking concept.
- [x] **Key Features:** Clear outline of core functionalities like Match Modes, consensus logic, and the coin economy.
- [x] **Technology Usage:** Detailed explanations of how HTML, CSS, React, Web Services (including a 3rd party API), Database, and WebSockets will be utilized.
- [x] **Design Sketches:** Embedded images of the application's layout and user flow.

## 📝 HTML Deliverable

- [x] **Login/Signup** Located in "index.html"
- [x] **Dashboard** Located in "src/app/pages/dashboard/dashboard.html"
- [] **External Facing Profile View** Located in "src/app/pages/other-profile/other-profile.html"
- [] **Messages** Located in "src/app/pages/messages/messages.html"
- [x] **Match Modes 1** Located in "src/app/pages/match-modes/match-mode-1/match-mode-1.html"
- [x] **Match Modes 2** Located in "src/app/pages/match-modes/match-mode-2/match-mode-2.html"
- [x] **Match Modes 3** Located in "src/app/pages/match-modes/match-mode-3/match-mode-3.html"
- [] **Notifications** Located in "src/app/pages/notificaitons/notifications.html"

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
- **Application Endpoints:**
    - `POST /api/pair` (Submit a matchmaking guess)
    - `POST /api/store/boost` (Spend coins to boost profile)
    - `GET /api/matches/daily` (Retrieve the profiles for the daily Match Modes)
- **3rd Party API:** Integration with the [Sightengine API](https://sightengine.com/docs/reference) (or a similar Computer Vision API) to analyze "Date Selfies." This verifies that the photo contains two actual human faces before awarding the massive coin bounty to the matchmakers, preventing users from uploading photos of their TV or pets to farm coins.

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
      <img src="design_sketches/IMG_9956.HEIC" width="100%" alt="Dashboard"/>
    </td>
    <td valign="top" width="50%">
      <b>Other Details:</b><br><br>
      <img src="design_sketches/IMG_9959.HEIC" width="100%" alt="Other Details"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Messaging:</b><br><br>
      <img src="design_sketches/IMG_9957.HEIC" width="100%" alt="Messages Flow"/>
    </td>
    <td valign="top" width="50%">
      <b>External Facing Profile View (Super Brief Modal):</b><br><br>
      <img src="design_sketches/IMG_9955.HEIC" width="100%" alt="Profile Click"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Onboarding, Progressive Login, & Tutorial Idea:</b><br><br>
      <img src="design_sketches/IMG_9958.HEIC" width="100%" alt="Onboarding Flow"/>
    </td>
    <td valign="top" width="50%">
      <b>Match Mode 1 (Target Pairs):</b><br><br>
      <img src="design_sketches/IMG_9952.HEIC" width="100%" alt="Match Mode 1"/>
    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">
      <b>Match Mode 2 (Hero Profile):</b><br><br>
      <img src="design_sketches/IMG_9953.HEIC" width="100%" alt="Match Mode 2"/>
    </td>
    <td valign="top" width="50%">
      <b>Match Mode 3 (Line Connections):</b><br><br>
      <img src="design_sketches/IMG_9954.HEIC" width="100%" alt="Match Mode 3"/>
    </td>
  </tr>
</table>
