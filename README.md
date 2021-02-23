# Mavuno
Mavuno is a product that allows collection of data about farmers, farms and their harvests.

![mockup](../media/mockup.png?raw=true)

### Relevant Links
- [System Desing and Info](https://docs.google.com/document/d/1mjwjrpINQ02RuPj8goAUg_ooU3Ok7B5TNsP1-qg6Pl4/edit?usp=sharing)
- [staging](https://mavuno.herokuapp.com/farmers)
- [API - Repository](https://github.com/dann254/mavuno-api)
- [Mockups](https://www.figma.com/file/SWzhN3IY95nWmhwebeOwyg/Untitled?node-id=0%3A1)

### TODO
- allow editing of records
- catch all errors from API
- show more stats
- debug: chrome not autolocating user.
- add user management page.
- design improvements
- improve responsiveness

### Relevant Info
- Supervisors are created through the API's console.
- Test user ** email: ** `email@example.com`, ** password: ** `password1`


## How to set up
- make sure you have vue and vueCLI installed.
- Clone this repository:
```bash
git clone git@github.com:dann254/mavuno.git
```
- switch to the project folder:
```bash
cd mavuno
```
- install dependencies
```
yarn install
```
- add a `.env.local` file to the root folder with the following variables
```bash
    VUE_APP_API_ROOT='https://mavuno-api.herokuapp.com/api/'
    VUE_APP_MAPS_API_KEY=your-google-maps-api-key
```
- start the app
```
yarn serve
```
- all set up, you can now access the app via http://localhost:8080/.
