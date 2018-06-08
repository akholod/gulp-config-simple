# Gulp boilerplate

### Setup

Clone repository on your local computer and go to project directory, then run

    npm install

### Run in development environment

Run in dev mode, with browsersync:

    gulp watch

App will be served on port 3000, navigate in browser to http://localhost:3000/

### Build for production 

For start building run:

    gulp build

The application will be builded into a 'dist' directory

For cleaning all temporary files run 

    gulp clean:all

### Folders structure:

For source code storage used 'app' folder. Inside the app folder:


 - templates - folder for templates, put your 
  pages in this folder, for each separate page, 
  except for the main one, you need to create a 
  folder with the name of the page with the index 
  file.

 - scss - a folder for your styles, supports both 
  scss and css syntax.

 - js - put your js files here

 - images, fonts - for pictures and fonts