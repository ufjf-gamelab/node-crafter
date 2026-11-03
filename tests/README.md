# Testes

Os testes usam o runner nativo do Node (`node:test`), sem dependências adicionais.

```bash
npm test
npm run test:unit
npm run test:acceptance
npm run test:watch
npm run test:type
```

Para rodar tudo antes de um commit:

```bash
npm run check
```

Os testes de domínio ficam em `tests/unit` e os critérios de aceite da Fase 1 em `tests/acceptance`. Testes de interface, download real e persistência no navegador continuam manuais.
