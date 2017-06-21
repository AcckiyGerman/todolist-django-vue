# Todo django application.
#### Description
The application allow you to add/edit/remove projects and
tasks.  
The app uses django authentication system.

#### Local setup in debian/ubuntu:
```bash
git clone https://github.com/AcckiyGerman/django-todolist/  
cd django-todolist
```
#### Create virtual environment:
Either by python utility:  
```bash
sudo apt install python3-venv  
python3 -m venv venv
```

Or using virtualenv:  
```
sudo apt install virtualenv  
virtualenv venv  
```
#### load environment:
`source venv/bin/activate`  

#### initialize project:
```bash
pip install -r requirements.txt
python manage.py makemigrations todolist
python manage.py migrate
python manage.py createsuperuser
```
Remember the superuser credentials. 
#### run:
`python manage.py runserver`  

#### check (in browser):
http://localhost:8000 - main page (you'll need to login).  
http://localhost:8000/admin - page to create new users.