## Backend 

### app.py / wsgi.py

App.py is responsible for actual initiation / creation of the backend application. 
The file will contain calls to initiate different aspects like database, rate limitiations
and route creation for the api. This app.py and create_app is called by wsgi.py which is
used when deploying the backend on the apache server.

### API / *_api.py

API-files will contain definitions of outward facing interfaceses and pathing. The api-files
shouldn't contain much more than actual definitions of routes. The actual logic is done in calls to controllers

### controllers / *_controller.py

Controllers house the actual working logic of the backend, they will evaluate and perform the actions called by the API
by manipulating the models(which act as database tables)

### models / *_model.py

Models are the actual tables in the database and contain definition of those tables and limitations.
The models will also have simple CRUD(create read update delete) functionality built into them but 
most of the logic manipulating should be in the controllers

### setup 

Setup should house "run once" code that is called during the start of the application like setting
up the database and backend documentation to swagger


### utils

Misc folder for utilities not fitting to other directories.
In current form houses
- backup.py - scheduled backup creation
- check_admin.py - for checking admin privileges / JWT for access limited functionalities
- config.py - reading .env files to configuration to be used backend-wide
- housekeeper.py - scheduled deleting of old records
- qr_generator.py - qr-code .png creation for the devices

### static
The directory is exposed to public in {BACKEND_ADDR}/static, it will house attachments and qr-codes
sorted by device id


## Frontend

### app.jsx
Will contain the actual structure how the page is displayed and routing = which page 
address shows which view of the application

### src/components

This houses components used by the different views of the frontend. The components are sorted
by the view which uses the components e.g. info box. Components that are reused in multiple views
are located in the shared folder and changing will apply to all views using the components

### src/utils
Misc folder for utilities not fitting to other directories.
- config.js - .env configurations made more easily available to frontend
- jwt_utils.js - checking the validity of JWT / login token

### src/views

Contains the actual views of the pages of the application. The views are created by using the components
defined earlier. Each of the pages of the website/application should have their own view here