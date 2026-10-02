// Carregado antes de qualquer import do AppModule: o ConfigModule valida
// o ambiente no momento em que o módulo é importado.
process.env.DATABASE_URL = "postgresql://teste:teste@localhost:5432/teste";
process.env.JWT_SECRET = "segredo-de-teste-com-mais-de-32-caracteres!!";
process.env.JWT_EXPIRES_IN = "1h";
process.env.FRONTEND_URL = "http://localhost:3000";
