def get_auth_token(client):
    """Função auxiliar que cadastra e loga um usuário, retornando o token."""
    client.post("/auth/register", json={
        "name": "João Silva",
        "email": "joao@email.com",
        "password": "senha123"
    })

    response = client.post("/auth/login", json={
        "email": "joao@email.com",
        "password": "senha123"
    })

    return response.json()["access_token"]


def test_create_exercise(client):
    """Deve criar um exercício para o usuário logado."""
    token = get_auth_token(client)

    response = client.post("/exercises/", json={
        "name": "Supino Reto",
        "muscle_group": "Peito",
        "description": "Exercício para peitoral maior"
    }, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 201
    assert response.json()["name"] == "Supino Reto"


def test_list_exercises(client):
    """Deve listar apenas os exercícios do usuário logado."""
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/exercises/", json={
        "name": "Supino Reto",
        "muscle_group": "Peito"
    }, headers=headers)

    response = client.get("/exercises/", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_exercise_without_token(client):
    """Não deve permitir criar exercício sem autenticação."""
    response = client.post("/exercises/", json={
        "name": "Supino Reto",
        "muscle_group": "Peito"
    })

    assert response.status_code == 401