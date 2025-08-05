"""
初始化数据脚本
创建默认的角色、部门和管理员用户
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app
from src.models.user import db, User, Role, Department
from datetime import date
import json

def init_data():
    with app.app_context():
        # 创建默认角色
        roles_data = [
            {
                'name': 'admin',
                'description': '系统管理员',
                'permissions': [
                    'user_manage', 'role_manage', 'department_manage',
                    'employee_manage', 'customer_manage', 'project_manage',
                    'ticket_manage', 'report_view', 'system_settings'
                ]
            },
            {
                'name': 'manager',
                'description': '部门经理',
                'permissions': [
                    'employee_view', 'customer_manage', 'project_manage',
                    'ticket_manage', 'report_view'
                ]
            },
            {
                'name': 'employee',
                'description': '普通员工',
                'permissions': [
                    'customer_view', 'project_view', 'ticket_create'
                ]
            },
            {
                'name': 'hr',
                'description': '人力资源',
                'permissions': [
                    'employee_manage', 'department_view', 'report_view'
                ]
            }
        ]
        
        for role_data in roles_data:
            if not Role.query.filter_by(name=role_data['name']).first():
                role = Role(
                    name=role_data['name'],
                    description=role_data['description'],
                    permissions=json.dumps(role_data['permissions'])
                )
                db.session.add(role)
        
        # 创建默认部门
        departments_data = [
            {'name': '技术部', 'description': '负责产品开发和技术支持'},
            {'name': '销售部', 'description': '负责市场开拓和客户维护'},
            {'name': '人事部', 'description': '负责人力资源管理'},
            {'name': '财务部', 'description': '负责财务管理和会计核算'},
            {'name': '市场部', 'description': '负责市场推广和品牌建设'}
        ]
        
        for dept_data in departments_data:
            if not Department.query.filter_by(name=dept_data['name']).first():
                dept = Department(
                    name=dept_data['name'],
                    description=dept_data['description']
                )
                db.session.add(dept)
        
        db.session.commit()
        
        # 获取角色和部门
        admin_role = Role.query.filter_by(name='admin').first()
        tech_dept = Department.query.filter_by(name='技术部').first()
        
        # 创建默认管理员用户
        if not User.query.filter_by(username='admin').first():
            admin_user = User(
                username='admin',
                email='admin@company.com',
                full_name='系统管理员',
                employee_id='EMP001',
                position='系统管理员',
                hire_date=date.today(),
                status='active',
                role_id=admin_role.id if admin_role else None,
                department_id=tech_dept.id if tech_dept else None
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
        
        # 创建测试员工
        test_employees = [
            {
                'username': 'john_doe',
                'email': 'john@company.com',
                'full_name': '张三',
                'employee_id': 'EMP002',
                'position': '高级开发工程师',
                'phone': '13800138001',
                'department': '技术部',
                'role': 'employee'
            },
            {
                'username': 'jane_smith',
                'email': 'jane@company.com',
                'full_name': '李四',
                'employee_id': 'EMP003',
                'position': '销售经理',
                'phone': '13800138002',
                'department': '销售部',
                'role': 'manager'
            },
            {
                'username': 'hr_manager',
                'email': 'hr@company.com',
                'full_name': '王五',
                'employee_id': 'EMP004',
                'position': '人事经理',
                'phone': '13800138003',
                'department': '人事部',
                'role': 'hr'
            }
        ]
        
        for emp_data in test_employees:
            if not User.query.filter_by(username=emp_data['username']).first():
                dept = Department.query.filter_by(name=emp_data['department']).first()
                role = Role.query.filter_by(name=emp_data['role']).first()
                
                employee = User(
                    username=emp_data['username'],
                    email=emp_data['email'],
                    full_name=emp_data['full_name'],
                    employee_id=emp_data['employee_id'],
                    position=emp_data['position'],
                    phone=emp_data.get('phone'),
                    hire_date=date.today(),
                    status='active',
                    department_id=dept.id if dept else None,
                    role_id=role.id if role else None
                )
                employee.set_password('password123')
                db.session.add(employee)
        
        db.session.commit()
        print("初始化数据创建成功！")
        print("默认管理员账户：")
        print("用户名: admin")
        print("密码: admin123")

if __name__ == '__main__':
    init_data()

