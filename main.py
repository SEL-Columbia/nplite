import datetime
import logging
import os
import sys
import uuid

import bcrypt
import tornado.ioloop
import tornado.web

import models



class Base(tornado.web.RequestHandler):
    def get_current_user(self):
        email = self.get_secure_cookie('user')
        if email:
            return models.User.get_by_email(email)
        
    def reload(self):
        self.redirect(self.request.path)


class Index(Base):
    def get(self):
        self.render('index.html', text=None)


class Scenarios(Base):
    def get(self):
        self.render('scenarios.html')

    def post(self):
        pass


class Scenario(Base):
    def get(self, id):
        self.render('scenario.html')

    def post(self, id):
        pass





class SignUp(Base):
    def get(self):
        self.render('signup.html')

    def post(self):
        email = self.get_argument('email', None)
        password = self.get_argument('password', '').encode('utf-8')
        user = db.User(email=email)
        user.set_password(password)
        user.save(force_insert=True)

        if user.id:
            self.set_secure_cookie('user', user.id)
            self.redirect('/' + user.id)
        else:
            self.redirect('/signup')


class Login(Base):
    def get(self):
        self.render('login.html')

    def post(self):
        email = self.get_argument('email', None)
        password = self.get_argument('password', '').encode('utf8')
        user = models.User.get_by_email(email)
        if not user:
            self.set_secure_cookie('flash', 'Username or Password Incorrect')
            return self.reload()
        
        if user and user.check_password(password):
            self.set_secure_cookie('user', user.email)
            self.redirect('/scenarios')
        else:
            self.redirect('/login')



class Logout(Base):
    def get(self):
        self.clear_cookie('user')
        self.redirect('/')


routes = [
    (r'/', Index),
    (r'/login', Login),
    (r'/signup', SignUp),
    (r'/logout', Logout),
    (r'/scenarios', Scenarios),
    (r'/scenarios/(\d+)', Scenario)
]

settings = {
    'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
    'static_path': os.path.join(os.path.dirname(__file__), 'static'),
    'login_url': '/login',
    'debug': True,
    'xsrf_cookies': True,
    'cookie_secret': str(uuid.uuid4())
}


if __name__ == '__main__':
    app = tornado.web.Application(routes, **settings)
    app.listen(8889, address='127.0.0.1')
    tornado.ioloop.IOLoop.instance().start()


