#!/usr/bin/env python3
"""
初始化数据脚本
创建默认的角色、权限和管理员用户
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, User, Role, Permission
from src.models.customer import Customer
from src.models.ticket import ServiceCategory
from src.main import app

def init_permissions():
    """初始化权限"""
    permissions_data = [
        # 用户管理权限
        {'name': 'user_create', 'description': '创建用户', 'resource': 'user', 'action': 'create'},
        {'name': 'user_read', 'description': '查看用户', 'resource': 'user', 'action': 'read'},
        {'name': 'user_update', 'description': '更新用户', 'resource': 'user', 'action': 'update'},
        {'name': 'user_delete', 'description': '删除用户', 'resource': 'user', 'action': 'delete'},
        
        # 角色管理权限
        {'name': 'role_create', 'description': '创建角色', 'resource': 'role', 'action': 'create'},
        {'name': 'role_read', 'description': '查看角色', 'resource': 'role', 'action': 'read'},
        {'name': 'role_update', 'description': '更新角色', 'resource': 'role', 'action': 'update'},
        {'name': 'role_delete', 'description': '删除角色', 'resource': 'role', 'action': 'delete'},
        
        # 权限管理权限
        {'name': 'permission_read', 'description': '查看权限', 'resource': 'permission', 'action': 'read'},
        
        # 客户管理权限
        {'name': 'customer_create', 'description': '创建客户', 'resource': 'customer', 'action': 'create'},
        {'name': 'customer_read', 'description': '查看客户', 'resource': 'customer', 'action': 'read'},
        {'name': 'customer_update', 'description': '更新客户', 'resource': 'customer', 'action': 'update'},
        {'name': 'customer_delete', 'description': '删除客户', 'resource': 'customer', 'action': 'delete'},
        
        # 线索管理权限
        {'name': 'lead_create', 'description': '创建线索', 'resource': 'lead', 'action': 'create'},
        {'name': 'lead_read', 'description': '查看线索', 'resource': 'lead', 'action': 'read'},
        {'name': 'lead_update', 'description': '更新线索', 'resource': 'lead', 'action': 'update'},
        {'name': 'lead_delete', 'description': '删除线索', 'resource': 'lead', 'action': 'delete'},
        
        # 销售机会权限
        {'name': 'opportunity_create', 'description': '创建销售机会', 'resource': 'opportunity', 'action': 'create'},
        {'name': 'opportunity_read', 'description': '查看销售机会', 'resource': 'opportunity', 'action': 'read'},
        {'name': 'opportunity_update', 'description': '更新销售机会', 'resource': 'opportunity', 'action': 'update'},
        {'name': 'opportunity_delete', 'description': '删除销售机会', 'resource': 'opportunity', 'action': 'delete'},
        
        # 联系人权限
        {'name': 'contact_create', 'description': '创建联系人', 'resource': 'contact', 'action': 'create'},
        {'name': 'contact_read', 'description': '查看联系人', 'resource': 'contact', 'action': 'read'},
        {'name': 'contact_update', 'description': '更新联系人', 'resource': 'contact', 'action': 'update'},
        {'name': 'contact_delete', 'description': '删除联系人', 'resource': 'contact', 'action': 'delete'},
        
        # 活动权限
        {'name': 'activity_create', 'description': '创建活动', 'resource': 'activity', 'action': 'create'},
        {'name': 'activity_read', 'description': '查看活动', 'resource': 'activity', 'action': 'read'},
        {'name': 'activity_update', 'description': '更新活动', 'resource': 'activity', 'action': 'update'},
        {'name': 'activity_delete', 'description': '删除活动', 'resource': 'activity', 'action': 'delete'},
        
        # 项目管理权限
        {'name': 'project_create', 'description': '创建项目', 'resource': 'project', 'action': 'create'},
        {'name': 'project_read', 'description': '查看项目', 'resource': 'project', 'action': 'read'},
        {'name': 'project_update', 'description': '更新项目', 'resource': 'project', 'action': 'update'},
        {'name': 'project_delete', 'description': '删除项目', 'resource': 'project', 'action': 'delete'},
        
        # 任务管理权限
        {'name': 'task_create', 'description': '创建任务', 'resource': 'task', 'action': 'create'},
        {'name': 'task_read', 'description': '查看任务', 'resource': 'task', 'action': 'read'},
        {'name': 'task_update', 'description': '更新任务', 'resource': 'task', 'action': 'update'},
        {'name': 'task_delete', 'description': '删除任务', 'resource': 'task', 'action': 'delete'},
        
        # 工单管理权限
        {'name': 'ticket_create', 'description': '创建工单', 'resource': 'ticket', 'action': 'create'},
        {'name': 'ticket_read', 'description': '查看工单', 'resource': 'ticket', 'action': 'read'},
        {'name': 'ticket_update', 'description': '更新工单', 'resource': 'ticket', 'action': 'update'},
        {'name': 'ticket_delete', 'description': '删除工单', 'resource': 'ticket', 'action': 'delete'},
        
        # 服务分类权限
        {'name': 'category_create', 'description': '创建服务分类', 'resource': 'category', 'action': 'create'},
        {'name': 'category_read', 'description': '查看服务分类', 'resource': 'category', 'action': 'read'},
        {'name': 'category_update', 'description': '更新服务分类', 'resource': 'category', 'action': 'update'},
        {'name': 'category_delete', 'description': '删除服务分类', 'resource': 'category', 'action': 'delete'},
        
        # 知识库权限
        {'name': 'knowledge_create', 'description': '创建知识库文章', 'resource': 'knowledge', 'action': 'create'},
        {'name': 'knowledge_read', 'description': '查看知识库文章', 'resource': 'knowledge', 'action': 'read'},
        {'name': 'knowledge_update', 'description': '更新知识库文章', 'resource': 'knowledge', 'action': 'update'},
        {'name': 'knowledge_delete', 'description': '删除知识库文章', 'resource': 'knowledge', 'action': 'delete'},
    ]
    
    for perm_data in permissions_data:
        permission = Permission.query.filter_by(name=perm_data['name']).first()
        if not permission:
            permission = Permission(**perm_data)
            db.session.add(permission)
    
    db.session.commit()
    print("权限初始化完成")

def init_roles():
    """初始化角色"""
    # 管理员角色 - 拥有所有权限
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(name='admin', description='系统管理员，拥有所有权限')
        all_permissions = Permission.query.all()
        admin_role.permissions = all_permissions
        db.session.add(admin_role)
    
    # 经理角色 - 拥有大部分权限
    manager_role = Role.query.filter_by(name='manager').first()
    if not manager_role:
        manager_role = Role(name='manager', description='部门经理，拥有部门管理权限')
        manager_permissions = Permission.query.filter(
            Permission.name.in_([
                'user_read', 'customer_create', 'customer_read', 'customer_update',
                'lead_create', 'lead_read', 'lead_update', 'opportunity_create',
                'opportunity_read', 'opportunity_update', 'contact_create', 'contact_read',
                'contact_update', 'activity_create', 'activity_read', 'activity_update',
                'project_create', 'project_read', 'project_update', 'task_create',
                'task_read', 'task_update', 'ticket_create', 'ticket_read', 'ticket_update',
                'category_read', 'knowledge_create', 'knowledge_read', 'knowledge_update'
            ])
        ).all()
        manager_role.permissions = manager_permissions
        db.session.add(manager_role)
    
    # 员工角色 - 基本权限
    employee_role = Role.query.filter_by(name='employee').first()
    if not employee_role:
        employee_role = Role(name='employee', description='普通员工，拥有基本操作权限')
        employee_permissions = Permission.query.filter(
            Permission.name.in_([
                'customer_read', 'lead_read', 'lead_update', 'opportunity_read',
                'opportunity_update', 'contact_read', 'activity_create', 'activity_read',
                'activity_update', 'project_read', 'task_read', 'task_update',
                'ticket_read', 'ticket_update', 'category_read', 'knowledge_read'
            ])
        ).all()
        employee_role.permissions = employee_permissions
        db.session.add(employee_role)
    
    db.session.commit()
    print("角色初始化完成")

def init_admin_user():
    """初始化管理员用户"""
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        admin_user = User(
            username='admin',
            email='admin@example.com',
            full_name='系统管理员',
            department='IT部门',
            position='系统管理员'
        )
        admin_user.set_password('admin123')
        
        # 分配管理员角色
        admin_role = Role.query.filter_by(name='admin').first()
        if admin_role:
            admin_user.roles.append(admin_role)
        
        db.session.add(admin_user)
        db.session.commit()
        print("管理员用户创建完成 - 用户名: admin, 密码: admin123")
    else:
        print("管理员用户已存在")

def init_sample_data():
    """初始化示例数据"""
    # 创建示例客户
    if Customer.query.count() == 0:
        customers = [
            Customer(name='张三', company='ABC科技有限公司', email='zhangsan@abc.com', phone='13800138001', industry='科技', source='网站'),
            Customer(name='李四', company='XYZ贸易公司', email='lisi@xyz.com', phone='13800138002', industry='贸易', source='推荐'),
            Customer(name='王五', company='DEF制造企业', email='wangwu@def.com', phone='13800138003', industry='制造', source='广告')
        ]
        for customer in customers:
            db.session.add(customer)
    
    # 创建服务分类
    if ServiceCategory.query.count() == 0:
        categories = [
            ServiceCategory(name='技术支持', description='技术相关问题'),
            ServiceCategory(name='产品咨询', description='产品功能咨询'),
            ServiceCategory(name='售后服务', description='售后服务相关'),
            ServiceCategory(name='投诉建议', description='客户投诉和建议')
        ]
        for category in categories:
            db.session.add(category)
    
    db.session.commit()
    print("示例数据初始化完成")

def main():
    """主函数"""
    with app.app_context():
        print("开始初始化数据...")
        
        # 创建数据库表
        db.create_all()
        
        # 初始化权限
        init_permissions()
        
        # 初始化角色
        init_roles()
        
        # 初始化管理员用户
        init_admin_user()
        
        # 初始化示例数据
        init_sample_data()
        
        print("数据初始化完成！")
        print("\n登录信息:")
        print("用户名: admin")
        print("密码: admin123")

if __name__ == '__main__':
    main()

