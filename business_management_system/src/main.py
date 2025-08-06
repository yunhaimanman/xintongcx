import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.customer import Customer, Lead, Opportunity, Contact, Activity
from src.models.project import Project, Task, TaskComment
from src.models.ticket import ServiceCategory, Ticket, TicketComment, KnowledgeBase
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.customer import customer_bp
from src.routes.project import project_bp
from src.routes.ticket import ticket_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# 启用CORS支持
CORS(app, origins=['http://localhost:5173', 'https://5173-idlqbrp5c0ay8xpim0rcr-1c49febc.manusvm.computer', 'https://ibqcwhit.manus.space', 'https://mqaudlmo.manus.space'], supports_credentials=True)

# 注册蓝图
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(customer_bp, url_prefix='/api/customers')
app.register_blueprint(project_bp, url_prefix='/api/projects')
app.register_blueprint(ticket_bp, url_prefix='/api/tickets')

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 创建数据库表
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
