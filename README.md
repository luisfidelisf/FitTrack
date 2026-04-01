# FitTrack

**FitTrack** é uma aplicação web completa para gerenciamento de treinos e registro de progresso físico.

## 🔗 Links

- **Frontend**: https://fit-track-neon-two.vercel.app/login
- **API**: https://fittrack-api-9g81.onrender.com/docs

---

## ✨ Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Gerenciamento de exercícios com grupo muscular e descrição
- Criação de treinos com exercícios, séries, repetições e carga
- Registro de sessões de treino com progresso real
- Histórico de evolução por exercício
- Interface responsiva e moderna

---

## 🛠️ Tecnologias

**Backend**
- Python + FastAPI
- SQLAlchemy + SQLite
- JWT para autenticação
- Docker
- Pytest

**Frontend**
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Python 3.11+
- Node.js 18+

### Backend
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/fittrack.git
cd fittrack

# Crie o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env

# Rode o servidor
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Com Docker
```bash
docker compose up --build
```

---

## 📁 Estrutura do projeto
```
fittrack/
├── app/
│   ├── core/          # segurança e dependências
│   ├── models/        # modelos do banco de dados
│   ├── routers/       # endpoints da API
│   ├── schemas/       # validação de dados
│   ├── database.py
│   └── main.py
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── services/
├── tests/
├── docker-compose.yml
└── requirements.txt
```

---

## 📝 Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastro de usuário |
| POST | /auth/login | Login |
| GET/POST | /exercises/ | Listar e criar exercícios |
| GET/POST | /workouts/ | Listar e criar treinos |
| GET/POST | /progress/ | Registrar e listar sessões |

---

## 🧪 Testes
```bash
pytest -v
```
