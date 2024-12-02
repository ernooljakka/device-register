
### 1. .env Configuration files

configurations are applied from .env.production files from both of the device-register/backend and device-register/frontend directories. Both files should available when deploying to live server.
The files are used to ensure communications between the services and proper setup and security. Without the files the software will use default values that might or might not work with your setup.
Easiest way is to copy .env.development as template and change the parameters. Here's step by step description of the configuration variables

    BACKEND_ADDR=YOUR_WEBSITE/api
    FRONTEND_ADDR=YOUR_WEBSITE
    BACKEND_BASEPATH=/
    FRONTEND_BASEPATH=/

Used to direct where the calls are directed and what address used for QR-code linking. BASEPATH are used to emulate addr pathing when running locally.
Remember to configure BACKEND_ADDR & FRONTEND_ADDR to addr where you intend to deploy. For TUNI use case to be used on the same server,
the address should be otherwise same but BACKEND_ADDR should have added /api.

    ADMIN_USERNAME=ADMIN_USER
    ADMIN_PASSWORD=ADMIN_PASSWORD

Self-explanatory admin account configuration. The system doesn't have fully fledged user-account system but configurable admin account, please change it to more secure before deployment

    JWT_SECRET_KEY=your_jwt_secret
    JWT_EXPIRY_HOURS=1

JWT_SECRET_KEY is used to generate the JWT_tokens -> set it to anything random +32 characters. Expiry hours is how long use can stay logged in before they session automatically
times out.

    BACKUP_INTERVAL_SECONDS=600
    BACKUP_MAX_NUMBER_OF_FILES=14

The system has daily timestamped backups, backup is done via cheap cp-command. The daily timestamp means that BACKUP_MAX_NUMBER_OF_FILES also defines how many days worth of
backup files the system will have

    RATE_LIMIT_DEFAULT="30 per minute"
    RATE_LIMIT_POSTING="4 per minute"

Rate limits for posting (meaning adding new entries, data or moving) and general website use. The limits are ip-based and do not apply to logged in / admin user

    CLEANUP_INTERVAL_SECONDS=180
    DAYS_TO_KEEP=180
    MIN_EVENT_COUNT=5

Cleanup will perform check over the events if there are some too old events to get rid off. DAYS_TO_KEEP will define at max how old events are kept but MIN_EVENT_COUNT will override the max age to ensure at least min amount last events are always seen

    ATTACHMENT_MAX_SIZE_MB=30
    MAX_ATTACHMENT_COUNT=4

Self-explanatory configurations for device attachments

    SQLALCHEMY_DATABASE_URI=

This will define what type of database is used sqlite:///:memory: will use in-memory database that will be deleted after restart and is not suitable for production use.
Use value SQLALCHEMY_DATABASE_URI=sqlite:///database.db for deployment

### 2. Deployment tool configurations

Ensure that devreg_cli_util.py has correct SERVER_NAME in place if the script is used to deploy the software.
The script will expect the front and back to be deployed on the same apache2 server meaning it will create backend to
SERVER_NAME/api and frontend to SERVER_NAME


### 3. Using provided util script to deploy

In the project directory deployment_confs there is utility script to help setting up the software.
The utility script assumes apache2 / httpd deployment that is used in TUNI VM that was made available for the project.
It also assumes the location of the SSL-certs, you can change the SSL cert locations from deployment_confs/devreg.conf_TEMPLATE
  
      lines:
              SSLCertificateFile /etc/pki/tls/certs/{SERVER_NAME}-cert.pem
              SSLCertificateKeyFile /etc/pki/tls/private/{SERVER_NAME}-key.pem

Script can be run with python3 eg python3 ./deployment_confs/devreg_cli_util.py

Here's some details of the functionalities:

#### 1. Deploy application
    Performs full suite of functions to deploy the software to be available, assumes apache2 is installed on the server
        Will install backend and frontend dependencies (backend to root python)
        Installs mod_wsgi and dependencies
        Builds frontend application
        Tries to update frontend packages
        Write apache configuration
        Reloads apache to finish the deployment (soft reset)


#### 2. Set temporary project ownership to user
    Deployment will set owner of the files and all permissions to apache, this will change everything to user for easier tinkering with filesystem

#### 3. Reload httpd (soft)
    Should restart the software normally, quick to do to apply changes

#### 4. Restart httpd (hard)
    Longer restart, sometimes needed if the server is stuck or other tinkering has been done
    Generally no need and will take a while to complete

#### 5. Deploy backend
    Installs backend dependencies, also touches wsgi.py so can be used to reload/restart backend quickly

#### 6. Deploy frontend
    Installs, updates and builds frontend, if changes are done to frontend, run this one

#### 7. Create manual backup
    Creates new manual backup to manual_backup folder that is not automatically deleted

#### 8. Restore database from backup
    Use this to restore backups, manual or automatic, use deploy backend and or reload httpd to apply the changes if not otherwise
    Will create manual backup of the replaced database.
    Will not clear attachments from the system