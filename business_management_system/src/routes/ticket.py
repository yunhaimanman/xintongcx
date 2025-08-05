from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.ticket import ServiceCategory, Ticket, TicketComment, KnowledgeBase
from src.routes.auth import token_required, permission_required
import uuid

ticket_bp = Blueprint('ticket', __name__)

# 服务工单管理
@ticket_bp.route('/', methods=['GET'])
@token_required
@permission_required('ticket_read')
def get_tickets(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        priority = request.args.get('priority', '')
        assigned_to = request.args.get('assigned_to', type=int)
        
        query = Ticket.query
        
        if status:
            query = query.filter(Ticket.status == status)
        
        if priority:
            query = query.filter(Ticket.priority == priority)
        
        if assigned_to:
            query = query.filter(Ticket.assigned_to == assigned_to)
        
        tickets = query.order_by(Ticket.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'tickets': [ticket.to_dict() for ticket in tickets.items],
            'total': tickets.total,
            'pages': tickets.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/', methods=['POST'])
@token_required
@permission_required('ticket_create')
def create_ticket(current_user):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        customer_id = data.get('customer_id')
        
        if not all([title, description, customer_id]):
            return jsonify({'message': 'Title, description and customer_id are required'}), 400
        
        # 生成工单号
        ticket_number = f"TK{uuid.uuid4().hex[:8].upper()}"
        
        ticket = Ticket(
            ticket_number=ticket_number,
            title=title,
            description=description,
            customer_id=customer_id,
            category_id=data.get('category_id'),
            assigned_to=data.get('assigned_to'),
            created_by=current_user.id,
            status=data.get('status', 'open'),
            priority=data.get('priority', 'medium'),
            source=data.get('source', 'web')
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        return jsonify({'message': 'Ticket created successfully', 'ticket': ticket.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/<int:ticket_id>', methods=['GET'])
@token_required
@permission_required('ticket_read')
def get_ticket(current_user, ticket_id):
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        return jsonify({'ticket': ticket.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/<int:ticket_id>', methods=['PUT'])
@token_required
@permission_required('ticket_update')
def update_ticket(current_user, ticket_id):
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        data = request.get_json()
        
        if 'title' in data:
            ticket.title = data['title']
        if 'description' in data:
            ticket.description = data['description']
        if 'category_id' in data:
            ticket.category_id = data['category_id']
        if 'assigned_to' in data:
            ticket.assigned_to = data['assigned_to']
        if 'status' in data:
            ticket.status = data['status']
            # 如果工单解决或关闭，记录时间
            if data['status'] == 'resolved' and not ticket.resolved_at:
                from datetime import datetime
                ticket.resolved_at = datetime.utcnow()
            elif data['status'] == 'closed' and not ticket.closed_at:
                from datetime import datetime
                ticket.closed_at = datetime.utcnow()
        if 'priority' in data:
            ticket.priority = data['priority']
        if 'resolution' in data:
            ticket.resolution = data['resolution']
        if 'satisfaction_rating' in data:
            ticket.satisfaction_rating = data['satisfaction_rating']
        if 'satisfaction_comment' in data:
            ticket.satisfaction_comment = data['satisfaction_comment']
        
        db.session.commit()
        
        return jsonify({'message': 'Ticket updated successfully', 'ticket': ticket.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 工单评论
@ticket_bp.route('/<int:ticket_id>/comments', methods=['GET'])
@token_required
@permission_required('ticket_read')
def get_ticket_comments(current_user, ticket_id):
    try:
        comments = TicketComment.query.filter_by(ticket_id=ticket_id).order_by(TicketComment.created_at.asc()).all()
        return jsonify({'comments': [comment.to_dict() for comment in comments]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/<int:ticket_id>/comments', methods=['POST'])
@token_required
@permission_required('ticket_update')
def create_ticket_comment(current_user, ticket_id):
    try:
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({'message': 'Comment content is required'}), 400
        
        comment = TicketComment(
            ticket_id=ticket_id,
            user_id=current_user.id,
            content=content,
            is_internal=data.get('is_internal', False)
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({'message': 'Comment created successfully', 'comment': comment.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 服务分类管理
@ticket_bp.route('/categories', methods=['GET'])
@token_required
@permission_required('category_read')
def get_categories(current_user):
    try:
        categories = ServiceCategory.query.all()
        return jsonify({'categories': [category.to_dict() for category in categories]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/categories', methods=['POST'])
@token_required
@permission_required('category_create')
def create_category(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'message': 'Category name is required'}), 400
        
        category = ServiceCategory(
            name=name,
            description=data.get('description'),
            parent_id=data.get('parent_id')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({'message': 'Category created successfully', 'category': category.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 知识库管理
@ticket_bp.route('/knowledge', methods=['GET'])
@token_required
@permission_required('knowledge_read')
def get_knowledge_articles(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        category_id = request.args.get('category_id', type=int)
        
        query = KnowledgeBase.query.filter_by(is_published=True)
        
        if search:
            query = query.filter(
                (KnowledgeBase.title.contains(search)) |
                (KnowledgeBase.content.contains(search))
            )
        
        if category_id:
            query = query.filter(KnowledgeBase.category_id == category_id)
        
        articles = query.order_by(KnowledgeBase.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'articles': [article.to_dict() for article in articles.items],
            'total': articles.total,
            'pages': articles.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/knowledge', methods=['POST'])
@token_required
@permission_required('knowledge_create')
def create_knowledge_article(current_user):
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not all([title, content]):
            return jsonify({'message': 'Title and content are required'}), 400
        
        article = KnowledgeBase(
            title=title,
            content=content,
            category_id=data.get('category_id'),
            created_by=current_user.id,
            is_published=data.get('is_published', False)
        )
        
        db.session.add(article)
        db.session.commit()
        
        return jsonify({'message': 'Knowledge article created successfully', 'article': article.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@ticket_bp.route('/knowledge/<int:article_id>', methods=['GET'])
@token_required
@permission_required('knowledge_read')
def get_knowledge_article(current_user, article_id):
    try:
        article = KnowledgeBase.query.get_or_404(article_id)
        # 增加浏览次数
        article.view_count += 1
        db.session.commit()
        return jsonify({'article': article.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# 获取我的工单
@ticket_bp.route('/my-tickets', methods=['GET'])
@token_required
def get_my_tickets(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        
        query = Ticket.query.filter_by(assigned_to=current_user.id)
        
        if status:
            query = query.filter(Ticket.status == status)
        
        tickets = query.order_by(Ticket.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'tickets': [ticket.to_dict() for ticket in tickets.items],
            'total': tickets.total,
            'pages': tickets.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

