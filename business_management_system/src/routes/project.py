from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.project import Project, Task, TaskComment
from src.routes.auth import token_required, permission_required

project_bp = Blueprint('project', __name__)

# 项目管理
@project_bp.route('/', methods=['GET'])
@token_required
@permission_required('project_read')
def get_projects(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        manager_id = request.args.get('manager_id', type=int)
        
        query = Project.query
        
        if status:
            query = query.filter(Project.status == status)
        
        if manager_id:
            query = query.filter(Project.manager_id == manager_id)
        
        projects = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'projects': [project.to_dict() for project in projects.items],
            'total': projects.total,
            'pages': projects.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@project_bp.route('/', methods=['POST'])
@token_required
@permission_required('project_create')
def create_project(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        manager_id = data.get('manager_id')
        
        if not all([name, manager_id]):
            return jsonify({'message': 'Name and manager_id are required'}), 400
        
        project = Project(
            name=name,
            description=data.get('description'),
            customer_id=data.get('customer_id'),
            manager_id=manager_id,
            status=data.get('status', 'planning'),
            priority=data.get('priority', 'medium'),
            budget=data.get('budget'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date')
        )
        
        # 添加项目成员
        member_ids = data.get('member_ids', [])
        if member_ids:
            members = User.query.filter(User.id.in_(member_ids)).all()
            project.members = members
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({'message': 'Project created successfully', 'project': project.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@project_bp.route('/<int:project_id>', methods=['GET'])
@token_required
@permission_required('project_read')
def get_project(current_user, project_id):
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify({'project': project.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@project_bp.route('/<int:project_id>', methods=['PUT'])
@token_required
@permission_required('project_update')
def update_project(current_user, project_id):
    try:
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        if 'customer_id' in data:
            project.customer_id = data['customer_id']
        if 'manager_id' in data:
            project.manager_id = data['manager_id']
        if 'status' in data:
            project.status = data['status']
        if 'priority' in data:
            project.priority = data['priority']
        if 'budget' in data:
            project.budget = data['budget']
        if 'start_date' in data:
            project.start_date = data['start_date']
        if 'end_date' in data:
            project.end_date = data['end_date']
        if 'actual_start_date' in data:
            project.actual_start_date = data['actual_start_date']
        if 'actual_end_date' in data:
            project.actual_end_date = data['actual_end_date']
        if 'progress' in data:
            project.progress = data['progress']
        
        # 更新项目成员
        if 'member_ids' in data:
            members = User.query.filter(User.id.in_(data['member_ids'])).all()
            project.members = members
        
        db.session.commit()
        
        return jsonify({'message': 'Project updated successfully', 'project': project.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 任务管理
@project_bp.route('/<int:project_id>/tasks', methods=['GET'])
@token_required
@permission_required('task_read')
def get_project_tasks(current_user, project_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        assigned_to = request.args.get('assigned_to', type=int)
        
        query = Task.query.filter_by(project_id=project_id)
        
        if status:
            query = query.filter(Task.status == status)
        
        if assigned_to:
            query = query.filter(Task.assigned_to == assigned_to)
        
        tasks = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks.items],
            'total': tasks.total,
            'pages': tasks.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@project_bp.route('/<int:project_id>/tasks', methods=['POST'])
@token_required
@permission_required('task_create')
def create_task(current_user, project_id):
    try:
        data = request.get_json()
        title = data.get('title')
        
        if not title:
            return jsonify({'message': 'Task title is required'}), 400
        
        task = Task(
            title=title,
            description=data.get('description'),
            project_id=project_id,
            assigned_to=data.get('assigned_to'),
            created_by=current_user.id,
            status=data.get('status', 'todo'),
            priority=data.get('priority', 'medium'),
            estimated_hours=data.get('estimated_hours'),
            due_date=data.get('due_date')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({'message': 'Task created successfully', 'task': task.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@project_bp.route('/tasks/<int:task_id>', methods=['GET'])
@token_required
@permission_required('task_read')
def get_task(current_user, task_id):
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify({'task': task.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@project_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
@permission_required('task_update')
def update_task(current_user, task_id):
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'assigned_to' in data:
            task.assigned_to = data['assigned_to']
        if 'status' in data:
            task.status = data['status']
            # 如果任务完成，记录完成时间
            if data['status'] == 'done' and not task.completed_at:
                from datetime import datetime
                task.completed_at = datetime.utcnow()
        if 'priority' in data:
            task.priority = data['priority']
        if 'estimated_hours' in data:
            task.estimated_hours = data['estimated_hours']
        if 'actual_hours' in data:
            task.actual_hours = data['actual_hours']
        if 'due_date' in data:
            task.due_date = data['due_date']
        
        db.session.commit()
        
        return jsonify({'message': 'Task updated successfully', 'task': task.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 任务评论
@project_bp.route('/tasks/<int:task_id>/comments', methods=['GET'])
@token_required
@permission_required('task_read')
def get_task_comments(current_user, task_id):
    try:
        comments = TaskComment.query.filter_by(task_id=task_id).order_by(TaskComment.created_at.desc()).all()
        return jsonify({'comments': [comment.to_dict() for comment in comments]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@project_bp.route('/tasks/<int:task_id>/comments', methods=['POST'])
@token_required
@permission_required('task_update')
def create_task_comment(current_user, task_id):
    try:
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({'message': 'Comment content is required'}), 400
        
        comment = TaskComment(
            task_id=task_id,
            user_id=current_user.id,
            content=content
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({'message': 'Comment created successfully', 'comment': comment.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 获取用户的任务
@project_bp.route('/my-tasks', methods=['GET'])
@token_required
def get_my_tasks(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        
        query = Task.query.filter_by(assigned_to=current_user.id)
        
        if status:
            query = query.filter(Task.status == status)
        
        tasks = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks.items],
            'total': tasks.total,
            'pages': tasks.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

