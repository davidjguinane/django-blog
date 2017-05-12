# README #

This README documents the steps required to get the Application and Development Environement up and running.

**Quick summary**

This repository is essential to controlling the production and development versions of code. 

**Version**

Version: Development

**Edit the README**

Found an error? Something need updating? Edit the README using [Markdown](https://bitbucket.org/tutorials/markdowndemo).

##  Development Set Up ##

### Dependencies ###

#### Install Python ####

[ Documentation ](https://www.python.org/doc/)

##### Max OS/Unix #####

Most Unix machines come pre-installed with Python. Requires version 3.5 x. To check your Python version, run the command:

	$ python -V

If the version is less than 3.5, install the correct [ version ](https://www.python.org/doc/).

##### Windows #####

If you're using Windows, you will have to install Python from scratch. Start by downloading Python 3.5.2 from the official Python [ website ](https://www.python.org/doc/). Once downloaded, double-click the file to install. By default this will install Python to C:\Python35-32.

To use Python, it needs to be added to your PATH environment variables. This means that when you run a Python script, you don't have to reference the full path every time.

> 1. Go to *Systems*
> 2. Choose *Advance System Settings* from the sidebar 
> 3. Click the *Environement Variables* button
> 4. Select the *PATH* variable from System Variables and click *Edit*
> 5. Add the following to the *PATH*:

	C:\Python35-32\; C:\Python35-32\Scripts\; C:\Python35-32\DLLs\; C:\Python35-32\Lib\;

To test that Python was installed correctly open Command Prompty or Windows PowerShell and then type `python`. You should see something like:

	Python 3.5.2 (v3.5.2:4def2a2901a5, Jun  25 2016, 11:43:10) 
	[MSC v.1900 32 bit (Intel)] on win32
	Type “help”, “copyright”, “credits” or “license” for more information.

#### Setup a Virtual Environement - virtualenv ####

It's common practice to use a virtualenv (virtual environment) for Python/Django projects. A virtualenv is used to create a self-contained development environment. The benefits of this approach is that upgrading packages or dependencies for other projects will not affect the function of the project, as each project is seperated into its own virtual environment container.

Think of `virtualenv` as a completely isolated container within your computer, where you can install any version of Python and/or libraries and it won't affect anything outside that container.

Install virtualenv with the following command:

	$ pip install virtualenv

Create a `/projectname` folder in desired directory:
	
	$ mkdir projectname
	$ cd projectname
	$ virtualenv --no-site-packages env

Activate virtualenv:

Unix:

	$ source env/bin/activate    

Windows:

	$ env\scripts\activate

You should now see (env) before your prompt, (env)$, indicating that you're running within the 'env' virtualenv.
To exit the virtualenv, type the following command:

	$ deactivate

Then reactivate when you're ready to work again.

#### Installing Git ####

Git will be used for version control of the software. If you have Git installed, you can check your current version with the following command:

	$ git --version

If you do not have either 1.7.x or 1.8.x installed, download the latest version.

##### Max OS/Unix #####

On Unix, `git` commands are run from the Terminal.

##### Windows #####

For Windows, it may be necessary to download a Unix Terminal to run Git commands.

#### Cloning  Code from Git Repo #####

To clone the Git Repository into your `/projectname` directory, navigate to the directory, then run the following command:

	$ git clone https://davidjguinane@bitbucket.org/davidjguinane/projectname.git .

This code will only work if the `/projectname` folder is empty.

Before proceeding, ensure the file `.gitignore` is in the main project directory.

Ensure the following is included in the file:

	.Python
	u-env
	bin
	lib
	include
	.DS_Store
	.pyc

#### Python Package Management - easy_install and pip ####

`easy_install` and `pip` are Python Package Managers. These tools make it much easier to install and upgrade Python packages and install the package dependencies.

`easy_install` must be downloaded. To download, go to the Python Package Index (PyPI). You need to download `setuptools`, which includes *easyinstall*. Download the executable (.exe) file for Windows, or the package egg (.egg) for Unix. You can install it directly from the file.

*Pip*, meanwhile, is a wrapper that relies on *easyinstall*, so you must have `easy_install` setup and working first before you can install `pip`. Once `easy_install` is setup, run the following command to install pip:

	$ easy_install pip

#### Using Package Management to install Dependencies ####

With the newly installed `pip`, it can now be used to install all the Python dependencies.

Navigate to the directory that contains `requirements.txt`, and run:

	$ pip install -r requirements.txt 

This automates the task of dependency installation, however a Manual Installation procedure has been provided, which describes how to install each package individually, with a brief overview of what the package is used for in the project. 

#### freeze ####

Once all the libraries are installed, use the following command to create a record of the installed libraries:

	$ pip freeze > requirements.txt

### Manual Installation not using Package Management ###

It is recommended that `pip` is used to install package dependencies, however a detailed procedure has been provided below for manual installation.

This guide assumes you have `pip` installed and the `virtualenv` setup.

#### Install Django ####

[ Documentation ](https://docs.djangoproject.com/en/1.10/)

Naturally, for a Django application to work, we need Django as a minimum.

##### Mac OS/Unix #####

To install Django on Unix, run the following command:

	$ pip install -U django==version

If the above command doesn't work:
	
	$ sudo pip install -U django==version

##### Windows #####

To install Django on Windows, run the following command:

	$ pip install -U django==version

You can check the installed Django version by running the following command:

	$ python
	>>> import django 
	>>> django.get_version()
	'1.11'
	>>> 

#### Install Django Rest Framework (DRF) ####

[ Documentation ](http://www.django-rest-framework.org/#requirements)

The DRF is a Django Application that allows for the easy creation of an API (Application Package Index). DRF contains the classes and methods to serialize the data to JSON or XML. uses serialization to JSON data. 

The API creates a central interface to the data that is recognisable by differing environments (iOS and Android). 

##### Max OS/Unix #####



##### Windows #####

To install Django Rest Framework, run the following command:

	$ pip install djangorestframework==3.5.3

#### Install Markdown ####

Markdown is required to mark up the README file. Any changes made to the README should be marked up with `markdown` in accordance with the style adopted. 

To install Markdown, run the following command:

	$ pip install markdown==2.6.7

#### Install django-filter ####

To install Django-Filter, run the following command:

	$ pip install django-filter==1.0.1

#### psycopg2 ####

psycopg2 is a python package that allows Python communication with a PostgreSQL Database.

To install psycopg2, run the following command:

	$ pip install psycopg2==2.6.2

#### python-memcached ####

python-memcached is required to to ensure python and memcached can talk. 

	$ pip install python-memcached==1.58

#### Configuration ####

##### memcached #####

##### Mac OS/Unix #####



##### Windows #####

[ Downlaod ](https://memcached.org/downloads)

memcached is required to cache files in memery for faster page load times when requested. Download the file from the above link.

> 1. Create a `memcached` folder at `c:/memcached/`
> 2. Move the download `memcached.exe` into the `c:/memcached/` directory
> 3. Open the command prompt and run the following command:

	c:/memcached/memcached.exe  -d install

> 4. Start the server with the following command:

	c:/memcached/memcached.exe -d  start

Memcached server listens on Port 11211. By default, memcached server memory is set to 64mb. To increase the amount of memcached memory, follow the following procedure:

> 1. Go to Registery Editor (REGEDIT), and find key:

	HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Services/memcached  Server .

> 2. To allocated 512mb of server memory, change the image path entry to:

	“C:/memcached/memcached.exe” -d runservice -m 512

#### Development Database Configuration ####

##### Install PostgreSQL #####

[ Downloads ](https://www.postgresql.org/download/) 

Install PostgreSQL

###### Windows ######

> 1. Click the [Windows](https://www.postgresql.org/download/windows/) link
> 2. I downloaded the Graphical Installer
> 3. Run the Installer


##### Install Test Database #####

To be completed, create a test database full of data that can be used to develop. 

###### Max OS/Unix ######

###### Windows ######

Ensure the `DATABASE` configuration in settings.py contains the following:

	DATABASES = {
	    'default': {
	        'ENGINE': 'django.db.backends.postgresql_psycopg2',
	        'NAME': 'test.db',
	        'USER': 'postgres',
	        'PASSWORD': 'eWiZ4rDg4m1ng',
	        'HOST': '127.0.0.1',
	        'PORT': '5432',
	        'TEST': {
	            'NAME': 'mytestdb'
	        }
	    }
	}

A test Database has been created for use in development.

> 1. Create test.db

##### Production Database ######

The production database is different from the test/development database. This database contains the Live Production Server Database, and should not be edited. 

### Software Contribution Specification ###

The following specification details the rules and guidelines for contributing to the project. 

#### Workflow ####

> 1. Navigate to the project folder
> 2. Activate virtualenv
> 3. Create and checkout a new git branch
> 4. Develop
> 5. Commit changes
> 6. Merge the new branch with your master branch
> 7. PULL the changes into the production folder
> 8. Deploy
> 9. Deactivate virtualenv

#### Rules ####

> 1. First, create a `dev` directory in the root `projectname` directory. Navigate to the `dev` directory.
> 2. Call the following command:

	$ git clone /path/to/your/project/

This command creates an exact copy of the repo, which includes all commits and branches. Always develop from this directory by creating separate branches for each major change to the project.

> 3. Create a new development branch:

	$ git branch <branch-name>

> 4. Checkout and swith to the new branch:

	$ git checkout <branch-name>

> 5. You can always see what branches are available with this command:

	$ git branch

> 6. Once you are finished developing and are ready to commit changes, call the following command:

	$ git add .
	$ git commit -a

> 7. To merge the development changes with the master branch, call the following command:

	$ git checkout master
	$ git merge <branchname>

> 8. To push the code to BitBucket, run the following command:

	$ git push

#### Writing and Running tests ####

> 1. Tests to be stored in `tests.py` specific to the app
> 2. To run tests specific to an app, use the following command:

	$ python manage.py test app-name

