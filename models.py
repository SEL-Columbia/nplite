import bcrypt
import datetime
import json
import os

import peewee


database = peewee.SqliteDatabase('database')
database.connect()


class JSONField(peewee.TextField):
    def db_value(self, value):
        return json.dumps(value)

    def python_value(self, value):
        return json.loads(value)


class BaseModel(peewee.Model):
    class Meta:
        database = database


class User(BaseModel):
    id = peewee.IntegerField(primary_key=True)
    email = peewee.TextField(unique=True)
    password_hash = peewee.TextField()

    @classmethod
    def get_by_email(cls, email):
        return cls.select().where(cls.email == email).first()

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password, bcrypt.gensalt())

    def check_password(self, password):
        if bcrypt.checkpw(password, self.password_hash):
            return True
        return False


class Scenario(BaseModel):
    id = peewee.IntegerField(primary_key=True)
    user = peewee.ForeignKeyField(User, related_name='scenarios')
    name = peewee.CharField(max_length=30)
    status = peewee.CharField(default='new')
    created = peewee.DateTimeField()
    public = peewee.BooleanField(default=True)
    input = JSONField(default={})
    output = JSONField(default={})


peewee.create_model_tables([User, Scenario], fail_silently=True)

