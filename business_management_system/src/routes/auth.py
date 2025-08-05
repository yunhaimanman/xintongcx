from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from datetime import datetime
import jwt
import os

auth_bp = Blueprint('auth', __name__)

# JWT密钥
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '用户名和密码不能为空'}), 400
        
        # 查找用户
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return jsonify({'error': '用户名或密码错误'}), 401
        
        # 检查用户状态
        if user.status != 'active':
            return jsonify({'error': '账户已被禁用'}), 401
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # 生成JWT token
        token_payload = {
            'user_id': user.id,
            'username': user.username,
            'role': user.role.name if user.role else None,
            'exp': datetime.utcnow().timestamp() + 86400  # 24小时过期
        }
        token = jwt.encode(token_payload, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': '登录成功',
            'token': token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """用户登出"""
    return jsonify({'message': '登出成功'})

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """获取当前用户信息"""
    try:
        # 从请求头获取token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': '未提供认证令牌'}), 401
        
        token = auth_header.split(' ')[1]
        
        # 验证token
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('user_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '无效的令牌'}), 401
        
        # 获取用户信息
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def require_auth(f):
    """认证装饰器"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': '未提供认证令牌'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.current_user_id = payload.get('user_id')
            request.current_user = User.query.get(request.current_user_id)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '无效的令牌'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

