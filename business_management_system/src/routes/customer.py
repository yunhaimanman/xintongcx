from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.customer import Customer, Lead, Opportunity, Contact, Activity
from src.routes.auth import token_required, permission_required

customer_bp = Blueprint('customer', __name__)

# 客户管理
@customer_bp.route('/', methods=['GET'])
@token_required
@permission_required('customer_read')
def get_customers(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        
        query = Customer.query
        
        if search:
            query = query.filter(
                (Customer.name.contains(search)) |
                (Customer.company.contains(search)) |
                (Customer.email.contains(search))
            )
        
        if status:
            query = query.filter(Customer.status == status)
        
        customers = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'customers': [customer.to_dict() for customer in customers.items],
            'total': customers.total,
            'pages': customers.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/', methods=['POST'])
@token_required
@permission_required('customer_create')
def create_customer(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'message': 'Customer name is required'}), 400
        
        customer = Customer(
            name=name,
            company=data.get('company'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            industry=data.get('industry'),
            source=data.get('source'),
            status=data.get('status', 'active'),
            assigned_to=data.get('assigned_to')
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({'message': 'Customer created successfully', 'customer': customer.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>', methods=['GET'])
@token_required
@permission_required('customer_read')
def get_customer(current_user, customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        return jsonify({'customer': customer.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>', methods=['PUT'])
@token_required
@permission_required('customer_update')
def update_customer(current_user, customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        data = request.get_json()
        
        if 'name' in data:
            customer.name = data['name']
        if 'company' in data:
            customer.company = data['company']
        if 'email' in data:
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'address' in data:
            customer.address = data['address']
        if 'industry' in data:
            customer.industry = data['industry']
        if 'source' in data:
            customer.source = data['source']
        if 'status' in data:
            customer.status = data['status']
        if 'assigned_to' in data:
            customer.assigned_to = data['assigned_to']
        
        db.session.commit()
        
        return jsonify({'message': 'Customer updated successfully', 'customer': customer.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 线索管理
@customer_bp.route('/leads', methods=['GET'])
@token_required
@permission_required('lead_read')
def get_leads(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '')
        assigned_to = request.args.get('assigned_to', type=int)
        
        query = Lead.query
        
        if status:
            query = query.filter(Lead.status == status)
        
        if assigned_to:
            query = query.filter(Lead.assigned_to == assigned_to)
        
        leads = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'leads': [lead.to_dict() for lead in leads.items],
            'total': leads.total,
            'pages': leads.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/leads', methods=['POST'])
@token_required
@permission_required('lead_create')
def create_lead(current_user):
    try:
        data = request.get_json()
        title = data.get('title')
        customer_id = data.get('customer_id')
        
        if not all([title, customer_id]):
            return jsonify({'message': 'Title and customer_id are required'}), 400
        
        lead = Lead(
            title=title,
            description=data.get('description'),
            customer_id=customer_id,
            assigned_to=data.get('assigned_to'),
            status=data.get('status', 'new'),
            priority=data.get('priority', 'medium'),
            estimated_value=data.get('estimated_value'),
            expected_close_date=data.get('expected_close_date'),
            source=data.get('source')
        )
        
        db.session.add(lead)
        db.session.commit()
        
        return jsonify({'message': 'Lead created successfully', 'lead': lead.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 销售机会管理
@customer_bp.route('/opportunities', methods=['GET'])
@token_required
@permission_required('opportunity_read')
def get_opportunities(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        stage = request.args.get('stage', '')
        assigned_to = request.args.get('assigned_to', type=int)
        
        query = Opportunity.query
        
        if stage:
            query = query.filter(Opportunity.stage == stage)
        
        if assigned_to:
            query = query.filter(Opportunity.assigned_to == assigned_to)
        
        opportunities = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'opportunities': [opp.to_dict() for opp in opportunities.items],
            'total': opportunities.total,
            'pages': opportunities.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/opportunities', methods=['POST'])
@token_required
@permission_required('opportunity_create')
def create_opportunity(current_user):
    try:
        data = request.get_json()
        title = data.get('title')
        customer_id = data.get('customer_id')
        
        if not all([title, customer_id]):
            return jsonify({'message': 'Title and customer_id are required'}), 400
        
        opportunity = Opportunity(
            title=title,
            description=data.get('description'),
            customer_id=customer_id,
            assigned_to=data.get('assigned_to'),
            stage=data.get('stage', 'prospecting'),
            probability=data.get('probability', 0),
            amount=data.get('amount'),
            expected_close_date=data.get('expected_close_date')
        )
        
        db.session.add(opportunity)
        db.session.commit()
        
        return jsonify({'message': 'Opportunity created successfully', 'opportunity': opportunity.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 联系人管理
@customer_bp.route('/<int:customer_id>/contacts', methods=['GET'])
@token_required
@permission_required('contact_read')
def get_customer_contacts(current_user, customer_id):
    try:
        contacts = Contact.query.filter_by(customer_id=customer_id).all()
        return jsonify({'contacts': [contact.to_dict() for contact in contacts]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>/contacts', methods=['POST'])
@token_required
@permission_required('contact_create')
def create_contact(current_user, customer_id):
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'message': 'Contact name is required'}), 400
        
        contact = Contact(
            name=name,
            title=data.get('title'),
            email=data.get('email'),
            phone=data.get('phone'),
            customer_id=customer_id,
            is_primary=data.get('is_primary', False)
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify({'message': 'Contact created successfully', 'contact': contact.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# 客户活动管理
@customer_bp.route('/<int:customer_id>/activities', methods=['GET'])
@token_required
@permission_required('activity_read')
def get_customer_activities(current_user, customer_id):
    try:
        activities = Activity.query.filter_by(customer_id=customer_id).order_by(Activity.created_at.desc()).all()
        return jsonify({'activities': [activity.to_dict() for activity in activities]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@customer_bp.route('/<int:customer_id>/activities', methods=['POST'])
@token_required
@permission_required('activity_create')
def create_activity(current_user, customer_id):
    try:
        data = request.get_json()
        activity_type = data.get('type')
        subject = data.get('subject')
        
        if not all([activity_type, subject]):
            return jsonify({'message': 'Type and subject are required'}), 400
        
        activity = Activity(
            type=activity_type,
            subject=subject,
            description=data.get('description'),
            customer_id=customer_id,
            user_id=current_user.id,
            scheduled_at=data.get('scheduled_at'),
            status=data.get('status', 'planned')
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'message': 'Activity created successfully', 'activity': activity.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

