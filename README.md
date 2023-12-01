# BirdNoise: A Symphony of Tweets 🐦🎵

Welcome to BirdNoise, where the birds chirp, and so do you! 🐦 Unleash your inner raven, crow, bluejay, or even hawk in this social platform that's definitely not Twitter, but, you know, with a bit of taste, and less features (You have to pay for that)

## Table of Contents

- [Features](#features)
  - [Infinite Scroll](#infinite-scroll)
  - [Dark Mode](#dark-mode)
  - [Unlimited Nesting of Posts](#unlimited-nesting-of-posts)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [License](#license)

## Features

### Infinite Scroll

Say goodbye to mundane scrolling! **BirdNoise** features an infinite scroll that keeps the posts flowing endlessly. Dive into the endless stream of birdy banter without the need for tedious page navigation.

### Dark Mode

Night owl or just prefer a darker aesthetic? Flip the switch and transform **BirdNoise** into a nocturnal haven. Whether you're tweeting at dawn or dusk, our dark mode provides a comfortable and stylish browsing experience. We cant promise that it looks that good though!

### Unlimited Nesting of Posts

Tired of constrained conversations? With **BirdNoise**, you can nest your tweets as deep as you want. Respond to replies, reply to responses, and watch the conversation take flight with unlimited nesting. It's a chirpy conversation tree!

## Installation

1. Clone `https://github.com/dader34/phase-4-project.git` and cd into the new folder
2. To install the requirements run the command `pip install -r requirements.txt` in the root directory.
3. Following that, run `npm i` in the UI directory
4. Lastly, run npm start to run the frontend server. You may need to change the `proxy` in package.json depending on what port and ip your flask server is running on

## Database Setup

1. To initialize the database, cd to the server folder and run `export FLASK_APP=main.py`
2. Subsequently, execute these commands: `flask db init`, `flask db migrate -m "initial migration"`, `flask db upgrade head`
3. After that, your database should be set up correctly
4. To seed data, make sure you are in the server directory and run `python helpers/seed.py`
5. Now you are ready to open the apps frontend and get to posting!


## Contributors

This project was brought to you by the hard working team over here at birdnoise. we hope you enjoy our app!

- **Danner**
- **Michael**
- **Landon**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**BirdNoise** - Because sometimes social media needs a little more flair! 🎶🐦
