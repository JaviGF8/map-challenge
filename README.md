# Map challenge

Map challenge is a test project created by Javier Garcia using react.

## Getting Started

### Clone the project with ssh

⚠️ If you have not ssh configured on you github look at [this](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

Open your terminal, go to the folder where you want to clone the project and use the following code

```
git clone git@github.com:JaviGF8/map-challenge.git
```

### Installing

Open your terminal, go to te project folder, then to merchant-site folder, and install de packages running the following command

```
npm install
```

In the root folder, create a file called ".env.development" with the next content:

```
NODE_PATH=./src
ENVIRONMENT=development
PUBLIC_URL=http://localhost:3000/
GOOGLE_API_KEY={YOUR_API_KEY}
```

Now start the development server using

```
npm start
```

## Built With

- [React](https://es.reactjs.org/docs/getting-started.html) - The web framework used
- [Webpack](https://webpack.js.org)
- [Babel](https://babeljs.io)

## Use

There's only one correct address for the pick up address, and one correct for the drop off address:

- Pick up address: "29 Rue du 4 Septembre"
- Drop off address: "15 Rue de Bourgogne"

## Improvements

In my opinion, the most important thing is to change the way I'm calling the API. I would wait until the user stops writing, because now is calling everytime the user types a letter. I didn't have time to improve this.

Also, I would've create an Input which uses Google Maps API to get the suggestions while we're writing, and then, when we have a valid address, we call our API.
