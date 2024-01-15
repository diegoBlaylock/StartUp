# Cristofori's Café
This application plans to allow piano players to share their talent and for communities to come together to listen. The player creates a public room to which people may come and go. Users coming to listen can look through popular room or search for one to their liking. In these rooms, players can play the piano using a graphical interface and notes played will be played to listeners realtime. While listening to the music, users can chat with one another, commenting on the music, or simply talking about any topics.

## Design

#### _Login Screen:_
![Login Screen](readme_pictures/login_screen.jpg)

#### _Discovery Screen:_
![Discovery Screen](readme_pictures/discovery_screen.jpg)
Allows users to view a selection of piano rooms and search/filter this view by a couple of parameters (username/room name) and (popularity/Time Playing)

#### _Piano Room Screen:_
![Piano Room Screen](readme_pictures/room_screen.jpg)
This is the most complicated part of the app. This represents the viewer screen, the right side has a chat box notifing all users of people joining and messages by others. The center is consumed by a representation of a piano that displays keys and is only interactable to the piano player. Info/Stats about the room are given below the piano.

## Key features

- Secure login over HTTPS
- Search and filter parameters to manage many rooms by pagination.
- Display of various rooms to be selected by users
- Ability to join and leave various rooms
- Chat box allowing users to speak to one another in realtime
- Actual statistic for a room displayed/updated
- Ability for players to play notes on a piano
- Playing piano audio for all users in a room
- Ability for admin to create and delete questions

## Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Creates the structure of the application, mostly defining divisions, headers, panels, and text. There will be a combined total of 6 pages:
  1. Login
  2. Create User
  3. View/edit Profile
  4. Discovery
  5. Piano room (Listener)
  6. Piano room (Player)

- **CSS** - Stylizes the page allowing for centered, orderly design as well as smooth animation for scrolling through various room in the discovery screen.

- **JavaScript** - Allows for dynamic elements and calls to services such as searching and filtering piano rooms and actually playing audio from piano notes and displaying the notes played.

- **Service** - Backend service with endpoints for:
  - login
  - creating user
  - editing user
  - getting room stats
  - retrieving public rooms by parameters
  - joining a room

- **Authentication** - Users must login in through password which will be stored with a hash

- **Database** - Stores users, rooms, credentials, and chat history. The app is not designed to hold recording of music played and will simply play realtime music. Chat history will be cycled meaning that only the last 5 minutes of messages are kept.

- **WebSocket** - This is used in 2 places:
  1. Chat messages are relayed to all players as well as info messages such as `viewer joined`
  2. Piano notes are relayed from the piano player to all listeners.

- **React** - Application ported to use the React web framework.
