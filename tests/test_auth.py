def test_register_user(client):
    """Deve cadastrar um novo usuário com sucesso."""
    response = client.post("/auth/register", json={
        "name": "João Silva",
        "email": "joao@email.com",
        "password": "senha123"
    })

    assert response.status_code == 201
    assert response.json()["email"] == "joao@email.com"
    assert "password" not in response.json()  # senha nunca deve aparecer


def test_register_duplicate_email(client):
    """Não deve permitir dois usuários com o mesmo email."""
    client.post("/auth/register", json={
        "name": "João Silva",
        "email": "joao@email.com",
        "password": "senha123"
    })

    response = client.post("/auth/register", json={
        "name": "Outro João",
        "email": "joao@email.com",
        "password": "outrasenha"
    })

    assert response.status_code == 400


def test_login_success(client):
    """Deve retornar um token ao fazer login com credenciais corretas."""
    client.post("/auth/register", json={
        "name": "João Silva",
        "email": "joao@email.com",
        "password": "senha123"
    })

    response = client.post("/auth/login", json={
        "email": "joao@email.com",
        "password": "senha123"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    """Deve rejeitar login com senha incorreta."""
    client.post("/auth/register", json={
        "name": "João Silva",
        "email": "joao@email.com",
        "password": "senha123"
    })

    response = client.post("/auth/login", json={
        "email": "joao@email.com",
        "password": "senhaerrada"
    })

    assert response.status_code == 401