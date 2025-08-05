from flask import Blueprint, request, jsonify
from src.models.user import db, User, Role, Permission
from src.routes.auth import token_required, permission_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
@token_required
@permission_required('user_read')
def get_users(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        
        query = User.query
        
        if search:
            query = query.filter(
                (User.username.contains(search)) |
                (User.full_name.contains(search)) |
                (User.email.contains(search))
            )
        
        users = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['GET'])
@token_required
@permission_required('user_read')
def get_user(current_user, user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@user_bp.route('/', methods=['POST'])
@token_required
@permission_required('user_create')
def create_user(current_user):
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        
        if not all([username, email, password, full_name]):
            return jsonify({'message': 'All required fields must be provided'}), 400
        
        # 检查用户是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already exists'}), 400
        
        # 创建新用户
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            phone=data.get('phone'),
            department=data.get('department'),
            position=data.get('position'),
            is_active=data.get('is_active', True)
        )
        user.set_password(password)
        
        # 分配角色
        role_ids = data.get('role_ids', [])
        if role_ids:
            roles = Role.query.filter(Role.id.in_(role_ids)).all()
            user.roles = roles
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
@permission_required('user_update')
def update_user(current_user, user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # 更新基本信息
        if 'username' in data:
            # 检查用户名是否已被其他用户使用
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Username already exists'}), 400
            user.username = data['username']
        
        if 'email' in data:
            # 检查邮箱是否已被其他用户使用
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'message': 'Email already exists'}), 400
            user.email = data['email']
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'department' in data:
            user.department = data['department']
        if 'position' in data:
            user.position = data['position']
        if 'is_active' in data:
            user.is_active = data['is_active']
        
        # 如果提供了新密码
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        # 更新角色
        if 'role_ids' in data:
            roles = Role.query.filter(Role.id.in_(data['role_ids'])).all()
            user.roles = roles
        
        db.session.commit()
        
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
@permission_required('user_delete')
def delete_user(current_user, user_id):
    try:
        user = User.query.get_or_404(user_id)
        
        # 不能删除自己
        if user.id == current_user.id:
            return jsonify({'message': 'Cannot delete yourself'}), 400
        
        # 软删除：设置为非活跃状态
        user.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 角色管理
@user_bp.route('/roles', methods=['GET'])
@token_required
@permission_required('role_read')
def get_roles(current_user):
    try:
        roles = Role.query.all()
        return jsonify({'roles': [role.to_dict() for role in roles]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@user_bp.route('/roles', methods=['POST'])
@token_required
@permission_required('role_create')
def create_role(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        
        if not name:
            return jsonify({'message': 'Role name is required'}), 400
        
        if Role.query.filter_by(name=name).first():
            return jsonify({'message': 'Role already exists'}), 400
        
        role = Role(name=name, description=description)
        
        # 分配权限
        permission_ids = data.get('permission_ids', [])
        if permission_ids:
            permissions = Permission.query.filter(Permission.id.in_(permission_ids)).all()
            role.permissions = permissions
        
        db.session.add(role)
        db.session.commit()
        
        return jsonify({'message': 'Role created successfully', 'role': role.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 权限管理
@user_bp.route('/permissions', methods=['GET'])
@token_required
@permission_required('permission_read')
def get_permissions(current_user):
    try:
        permissions = Permission.query.all()
        return jsonify({'permissions': [permission.to_dict() for permission in permissions]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
