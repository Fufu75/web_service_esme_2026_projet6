from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Tables d'association (many-to-many)
workshop_participants = db.Table('workshop_participants',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('workshop_id', db.Integer, db.ForeignKey('workshop.id'), primary_key=True)
)

group_members = db.Table('group_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('group.id'), primary_key=True)
)

literary_work_likes = db.Table('literary_work_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('literary_work_id', db.Integer, db.ForeignKey('literary_work.id'), primary_key=True)
)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    bio = db.Column(db.Text)
    profile_picture = db.Column(db.String(200))
    role = db.Column(db.String(20), default='author')  # author, moderator, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    literary_works = db.relationship('LiteraryWork', back_populates='author', cascade='all, delete-orphan')
    created_workshops = db.relationship('Workshop', back_populates='creator', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    created_groups = db.relationship('Group', back_populates='creator', cascade='all, delete-orphan')
    
    # Many-to-many relations
    workshops = db.relationship('Workshop', secondary=workshop_participants, back_populates='participants')
    groups = db.relationship('Group', secondary=group_members, back_populates='members')
    liked_works = db.relationship('LiteraryWork', secondary=literary_work_likes, back_populates='likes')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class LiteraryWork(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50))  # poem, novel, short story, etc.
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workshop_id = db.Column(db.Integer, db.ForeignKey('workshop.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    
    # Relations
    author = db.relationship('User', back_populates='literary_works')
    workshop = db.relationship('Workshop', back_populates='works')
    group = db.relationship('Group', back_populates='works')
    comments = db.relationship('Comment', back_populates='literary_work', cascade='all, delete-orphan')
    
    # Many-to-many relations
    likes = db.relationship('User', secondary=literary_work_likes, back_populates='liked_works')

class Workshop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    theme = db.Column(db.String(100))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='planning')  # planning, active, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relations
    creator = db.relationship('User', back_populates='created_workshops')
    works = db.relationship('LiteraryWork', back_populates='workshop', cascade='all, delete-orphan')
    
    # Many-to-many relations
    participants = db.relationship('User', secondary=workshop_participants, back_populates='workshops')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer)  # Optional rating 1-5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    literary_work_id = db.Column(db.Integer, db.ForeignKey('literary_work.id'), nullable=False)
    
    # Relations
    user = db.relationship('User', back_populates='comments')
    literary_work = db.relationship('LiteraryWork', back_populates='comments')

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    is_private = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relations
    creator = db.relationship('User', back_populates='created_groups')
    works = db.relationship('LiteraryWork', back_populates='group', cascade='all, delete-orphan')
    
    # Many-to-many relations
    members = db.relationship('User', secondary=group_members, back_populates='groups')

# On garde les modèles existants pour la compatibilité
class StudentBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime)

    student = relationship("Student", back_populates="student_books")
    book = relationship("Book", back_populates="student_books")

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    published_at = db.Column(db.DateTime)

    student_books = relationship("StudentBook", back_populates="book", cascade="all, delete-orphan")
    borrowers = relationship("Student", secondary="student_book", viewonly=True)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.DateTime)

    student_books = relationship("StudentBook", back_populates="student", cascade="all, delete-orphan")
    borrowed_books = relationship("Book", secondary="student_book", viewonly=True)
