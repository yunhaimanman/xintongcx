from datetime import datetime
from src.models.user import db

class ServiceCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, db.ForeignKey('service_category.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    children = db.relationship('ServiceCategory', backref=db.backref('parent', remote_side=[id]))
    tickets = db.relationship('Ticket', backref='category', lazy=True)

    def __repr__(self):
        return f'<ServiceCategory {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_number = db.Column(db.String(20), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'))
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='open')  # open, in_progress, pending, resolved, closed
    priority = db.Column(db.String(10), default='medium')  # low, medium, high, urgent
    source = db.Column(db.String(20), default='web')  # web, email, phone, chat
    resolution = db.Column(db.Text)
    satisfaction_rating = db.Column(db.Integer)  # 1-5
    satisfaction_comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    closed_at = db.Column(db.DateTime)
    
    # 关系
    customer = db.relationship('Customer', backref='tickets')
    assignee = db.relationship('User', foreign_keys=[assigned_to], backref='assigned_tickets')

    def __repr__(self):
        return f'<Ticket {self.ticket_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'ticket_number': self.ticket_number,
            'title': self.title,
            'description': self.description,
            'customer_id': self.customer_id,
            'category_id': self.category_id,
            'assigned_to': self.assigned_to,
            'created_by': self.created_by,
            'status': self.status,
            'priority': self.priority,
            'source': self.source,
            'resolution': self.resolution,
            'satisfaction_rating': self.satisfaction_rating,
            'satisfaction_comment': self.satisfaction_comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'closed_at': self.closed_at.isoformat() if self.closed_at else None,
            'customer': self.customer.to_dict() if self.customer else None,
            'assignee': {
                'id': self.assignee.id,
                'username': self.assignee.username,
                'full_name': self.assignee.full_name
            } if self.assignee else None
        }

class TicketComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_internal = db.Column(db.Boolean, default=False)  # 内部备注还是客户可见
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    ticket = db.relationship('Ticket', backref='comments')
    user = db.relationship('User', backref='ticket_comments')

    def __repr__(self):
        return f'<TicketComment {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'ticket_id': self.ticket_id,
            'user_id': self.user_id,
            'content': self.content,
            'is_internal': self.is_internal,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'full_name': self.user.full_name
            } if self.user else None
        }

class KnowledgeBase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_published = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    author = db.relationship('User', backref='knowledge_articles')

    def __repr__(self):
        return f'<KnowledgeBase {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category_id': self.category_id,
            'created_by': self.created_by,
            'is_published': self.is_published,
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'author': {
                'id': self.author.id,
                'username': self.author.username,
                'full_name': self.author.full_name
            } if self.author else None
        }

