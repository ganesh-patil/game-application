Game application.
===============
Application setup on local:

1) clone git repository. https://github.com/ganesh-patil/game-application.git
2) Run composer install from application root repository.
3) Create new database.
4) copy app/config/parameters.yml.dist file to app/config/parameters.yml 
5) Enter database credentials in prameters.yml file.
6) To create tables run following command form application root directory.
   php bin/console doctrine:schema:update --force.
7) Start symfony local server. 
  php bin/console server:run
