from flask import Blueprint, request, jsonify
from src.models.user import db, User, Department, Role
from src.routes.auth import require_auth
from datetime import datetime, date
from decimal import Decimal
import json

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/', methods=['GET'])
@require_auth
def get_employees():
    """获取员工列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        department_id = request.args.get('department_id', type=int)
        status = request.args.get('status', 'active')
        search = request.args.get('search', '')
        
        # 构建查询
        query = User.query
        
        if department_id:
            query = query.filter(User.department_id == department_id)
        
        if status:
            query = query.filter(User.status == status)
        
        if search:
            query = query.filter(
                db.or_(
                    User.username.contains(search),
                    User.full_name.contains(search),
                    User.email.contains(search),
                    User.employee_id.contains(search)
                )
            )
        
        # 分页
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        employees = [emp.to_dict() for emp in pagination.items]
        
        return jsonify({
            'employees': employees,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/<int:employee_id>', methods=['GET'])
@require_auth
def get_employee(employee_id):
    """获取单个员工信息"""
    try:
        employee = User.query.get_or_404(employee_id)
        return jsonify({'employee': employee.to_dict(include_sensitive=True)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/', methods=['POST'])
@require_auth
def create_employee():
    """创建新员工"""
    try:
        data = request.get_json()
        
        # 验证必填字段
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} 是必填字段'}), 400
        
        # 检查用户名和邮箱是否已存在
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': '用户名已存在'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': '邮箱已存在'}), 400
        
        # 检查员工编号是否已存在
        if data.get('employee_id') and User.query.filter_by(employee_id=data['employee_id']).first():
            return jsonify({'error': '员工编号已存在'}), 400
        
        # 创建新员工
        employee = User(
            username=data['username'],
            email=data['email'],
            full_name=data['full_name'],
            phone=data.get('phone'),
            position=data.get('position'),
            employee_id=data.get('employee_id'),
            department_id=data.get('department_id'),
            role_id=data.get('role_id'),
            manager_id=data.get('manager_id'),
            status=data.get('status', 'active')
        )
        
        # 设置密码
        employee.set_password(data['password'])
        
        # 处理入职日期
        if data.get('hire_date'):
            try:
                employee.hire_date = datetime.strptime(data['hire_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': '入职日期格式错误，应为 YYYY-MM-DD'}), 400
        
        # 处理薪资
        if data.get('salary'):
            try:
                employee.salary = Decimal(str(data['salary']))
            except (ValueError, TypeError):
                return jsonify({'error': '薪资格式错误'}), 400
        
        db.session.add(employee)
        db.session.commit()
        
        return jsonify({
            'message': '员工创建成功',
            'employee': employee.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/<int:employee_id>', methods=['PUT'])
@require_auth
def update_employee(employee_id):
    """更新员工信息"""
    try:
        employee = User.query.get_or_404(employee_id)
        data = request.get_json()
        
        # 检查用户名和邮箱唯一性
        if data.get('username') and data['username'] != employee.username:
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'error': '用户名已存在'}), 400
            employee.username = data['username']
        
        if data.get('email') and data['email'] != employee.email:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': '邮箱已存在'}), 400
            employee.email = data['email']
        
        # 检查员工编号唯一性
        if data.get('employee_id') and data['employee_id'] != employee.employee_id:
            if User.query.filter_by(employee_id=data['employee_id']).first():
                return jsonify({'error': '员工编号已存在'}), 400
            employee.employee_id = data['employee_id']
        
        # 更新其他字段
        updatable_fields = [
            'full_name', 'phone', 'position', 'department_id', 
            'role_id', 'manager_id', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(employee, field, data[field])
        
        # 处理密码更新
        if data.get('password'):
            employee.set_password(data['password'])
        
        # 处理入职日期
        if data.get('hire_date'):
            try:
                employee.hire_date = datetime.strptime(data['hire_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': '入职日期格式错误，应为 YYYY-MM-DD'}), 400
        
        # 处理薪资
        if data.get('salary'):
            try:
                employee.salary = Decimal(str(data['salary']))
            except (ValueError, TypeError):
                return jsonify({'error': '薪资格式错误'}), 400
        
        employee.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': '员工信息更新成功',
            'employee': employee.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/<int:employee_id>', methods=['DELETE'])
@require_auth
def delete_employee(employee_id):
    """删除员工（软删除）"""
    try:
        employee = User.query.get_or_404(employee_id)
        
        # 软删除：将状态设置为terminated
        employee.status = 'terminated'
        employee.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': '员工已被删除'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/departments', methods=['GET'])
@require_auth
def get_departments():
    """获取部门列表"""
    try:
        departments = Department.query.all()
        return jsonify({
            'departments': [dept.to_dict() for dept in departments]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/departments', methods=['POST'])
@require_auth
def create_department():
    """创建新部门"""
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': '部门名称不能为空'}), 400
        
        # 检查部门名称是否已存在
        if Department.query.filter_by(name=data['name']).first():
            return jsonify({'error': '部门名称已存在'}), 400
        
        department = Department(
            name=data['name'],
            description=data.get('description'),
            manager_id=data.get('manager_id')
        )
        
        db.session.add(department)
        db.session.commit()
        
        return jsonify({
            'message': '部门创建成功',
            'department': department.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/departments/<int:dept_id>', methods=['PUT'])
@require_auth
def update_department(dept_id):
    """更新部门信息"""
    try:
        department = Department.query.get_or_404(dept_id)
        data = request.get_json()
        
        # 检查部门名称唯一性
        if data.get('name') and data['name'] != department.name:
            if Department.query.filter_by(name=data['name']).first():
                return jsonify({'error': '部门名称已存在'}), 400
            department.name = data['name']
        
        if 'description' in data:
            department.description = data['description']
        
        if 'manager_id' in data:
            department.manager_id = data['manager_id']
        
        department.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': '部门信息更新成功',
            'department': department.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/roles', methods=['GET'])
@require_auth
def get_roles():
    """获取角色列表"""
    try:
        roles = Role.query.all()
        return jsonify({
            'roles': [role.to_dict() for role in roles]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/roles', methods=['POST'])
@require_auth
def create_role():
    """创建新角色"""
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': '角色名称不能为空'}), 400
        
        # 检查角色名称是否已存在
        if Role.query.filter_by(name=data['name']).first():
            return jsonify({'error': '角色名称已存在'}), 400
        
        role = Role(
            name=data['name'],
            description=data.get('description'),
            permissions=json.dumps(data.get('permissions', []))
        )
        
        db.session.add(role)
        db.session.commit()
        
        return jsonify({
            'message': '角色创建成功',
            'role': role.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@employee_bp.route('/stats', methods=['GET'])
@require_auth
def get_employee_stats():
    """获取员工统计信息"""
    try:
        total_employees = User.query.count()
        active_employees = User.query.filter_by(status='active').count()
        inactive_employees = User.query.filter_by(status='inactive').count()
        terminated_employees = User.query.filter_by(status='terminated').count()
        
        # 按部门统计
        dept_stats = db.session.query(
            Department.name,
            db.func.count(User.id).label('count')
        ).outerjoin(User).group_by(Department.id, Department.name).all()
        
        # 按角色统计
        role_stats = db.session.query(
            Role.name,
            db.func.count(User.id).label('count')
        ).outerjoin(User).group_by(Role.id, Role.name).all()
        
        return jsonify({
            'total_employees': total_employees,
            'active_employees': active_employees,
            'inactive_employees': inactive_employees,
            'terminated_employees': terminated_employees,
            'department_stats': [{'name': name, 'count': count} for name, count in dept_stats],
            'role_stats': [{'name': name, 'count': count} for name, count in role_stats]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

