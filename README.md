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

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- **HTML pages** - Seven HTML page that represent the ability to login, create a user, create a room, search for a room, and watch a room as a listener and a piano player.
- **Links** - The login page automatically links to the createUser page and discover page. Every page after login contains a link to the login page as well as the view_profile page. The discovery page contains links to the player_room page and listener_room page.
- **Text** - Text is represented on almost every level. Text is on the player profile as bio. Text is also present in descriptions of the rooms shown as tooltips on the discover page. Also in the Chat function in the rooms page
- **Images** - I added images simply as the favicon.ico and at the top of most pages. The piano for the room pages will be rendered using css
- **DB/Login** - Input box and submit button for login. All rooms will be stored on the database
- **WebSocket** - The chat function will send messages using web sockets and also the playing of the piano will send the midi data through web sockets

## CSS deliverable

- **Header, footer, and main content body** - On most pages I stylized these except for the rooms for aesthetic and spacing purposes. 
- **Navigation elements** - The navigation elements in the discovery page, create_page, createUser, and piano rooms all are shown on a navbar and don't have any underlining or blue color. The nav bar for discovery and create room have the bullet on purpose. The profile icon will show a menu when hovered over (only after login).
- **Responsive to window resizing** - I spent so much time and lines of code trying to make it look pretty. Don't overdo it because it will break, but most formatting will change to match the screen size down to an IPhone SE both landscape and portrait. The header will shrink and hide elements as both width or height goes down, footer is the same deal. Piano and chat will change formatting to better fit a scrolling approach (piano is one row, chat appears after content). So try this on various pages, specifically the piano rooms, discover rooms and create room pages.
- **Application elements** - Used okay contrast and whitespace for most elements. A TON of flex to center everything (because I'm lazy). Buttons! Pure CSS buttons that change based on hovering. Piano that is built from div elements galour (seriously went ham with the amount divs) and is formatted with css to be a piano. Make sure to checkout the player piano room. I am not sure what the heck you guys want me to put here.
- **Application text content** - Appropriate Sizing of fonts to show emphasis and draw attention. Prevented selection of most navigational and informational text. A special font is used as title of piano rooms.
- **Application images** - The only images present are the profile pictures and the footer icons. I worked to prevent their selection and dragging (which for some stupid reason can't be done in css, but has to be specified in the html). For the profile picture, I did a rounded image with a border. Actually I lied, an arrow image is present with the chat bar.


## Javascript delivarable

- **login** - The login screen will actually check that you are logged in and will force you to create a user with name and password befor proceeding. 
- **database** - This holds the username, passwords as well as created rooms for users. This part is purely in local-storage. Rooms will be collected into pages based on filter and sorts. You can also change your picture and view your username by hovering over your porfile and clicking on view profile. Hovering over a user's name on the dicovery page shows their description.
- **WebSocket** - Two things, first on a listener piano room, a bot will randomly play notes to represent the remote player. the other thing is that in any piano room, a bot will send random messages into the chat.
- **application logic** - You can login, you can create a room, in your own room you can play the piano. The chatbar allows you to send message by pressing the button or hitting enter. Scrolling for this part will be locked to the bottom unless moved by the user and will relock if positioned at the bottom. The room dicovery page features realtime pagination from the database and also sorting and filtering. Try it out!

## Service deliverable

- **Node.js/Express HTTP service** - done!
- **Static middleware for frontend** - done!
- **Calls to third party endpoints** - For the mock rooms, some of them use the random picture generator as display pics, and if you wanted me to use fetch, I had the console log a random quote for pages after login.
- **Backend service endpoints** - This include endpoints to create a user, to login, to edit a user profile, to logout, to validate a token, to get userinfo based on an ID, to fetch room info based on ID, to fetch sorted/filtered pages by parameters in the discovery room, to create a room.
- **Frontend calls service endpoints** - The file named ./public/js/endpoints/api, uses fetch to call all the above functions

## DB/Login deliverable

- **MongoDB Atlas database created** - With the help of TA's, this has been done!
- **Stores data in MongoDB** - done, will even retreive all data from database.
- **User registration** - Creates a new User and new Credentials in the database. 
- **existing user** - Will be able to fetch data from previous users. In fact most tables relate to each other through indices so everytime a room is fetched, it uses an id to fetch the owner too. Can modify existing user data using a profile picutre or biography that is shown when hovering over a user on the discovery page.
- **Use MongoDB to store credentials** - Credentials hold only a hashed password and a userid. They are stored seperatly from userdata, but still using MongoDB
- **Restricts functionality** - Any attempt to login without a valid token will force the user to the signin screen. Even if the frontend were modified, the backend will refuse to serve up content returning a Unauthorized status code.

## WebSocket deliverable

- **Backend listens for WebSocket connection** - Done, the backend has various handler functions that are called based on a type passed by the websocket.
- **Frontend makes WebSocket connection** - Done, the frontend uses two different wrappers to handle and send data related to chat or music. 
- **Data sent over WebSocket connection** - Data passed is either a chat message, a music note, a join room request, or an update for the viewer count.
- **WebSocket data displayed** - Messages are updated for all clients, the viewer count updates for each person, and notes will be played and highlighted for all listeners. A caveat is that the web audio api forces users to interact with a webpage before it will play audio so try clicking the page.