from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Department(db.Model):
    """部门模型"""
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    employees = db.relationship('User', backref='department', foreign_keys='User.department_id')
    manager = db.relationship('User', foreign_keys=[manager_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'manager_id': self.manager_id,
            'manager_name': self.manager.username if self.manager else None,
            'employee_count': len(self.employees),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Role(db.Model):
    """角色模型"""
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    permissions = db.Column(db.Text)  # JSON格式存储权限列表
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'permissions': json.loads(self.permissions) if self.permissions else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    """用户/员工模型"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # 员工信息
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    position = db.Column(db.String(100))  # 职位
    employee_id = db.Column(db.String(50), unique=True)  # 员工编号
    hire_date = db.Column(db.Date)  # 入职日期
    salary = db.Column(db.Numeric(10, 2))  # 薪资
    status = db.Column(db.String(20), default='active')  # active, inactive, terminated
    
    # 关系字段
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # 关系
    role = db.relationship('Role', backref='users')
    manager = db.relationship('User', remote_side=[id], backref='subordinates')
    
    def set_password(self, password):
        """设置密码"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'position': self.position,
            'employee_id': self.employee_id,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'status': self.status,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'role_id': self.role_id,
            'role_name': self.role.name if self.role else None,
            'manager_id': self.manager_id,
            'manager_name': self.manager.full_name if self.manager else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        if include_sensitive:
            data['salary'] = float(self.salary) if self.salary else None
            
        return data
