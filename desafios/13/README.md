## Listando procesos

Listar todos los procesos de app.ts:

`ps -ax | grep app.ts`

Modo `fork` (`ts-node app.ts`):

```
4504 ttys000    0:03.36 node /usr/local/bin/ts-node app.ts
4517 ttys001    0:00.00 grep app.ts # proceso línea de comando
```

Modo `cluster` (`ts-node app.ts --mode=cluster --cpus=4`):

```
4555 ttys000    0:03.33 node /usr/local/bin/ts-node app.ts --mode=cluster --cpus=4
4558 ttys000    0:05.43 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts --mode=cluster --cpus=4
4559 ttys000    0:05.32 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts --mode=cluster --cpus=4
4560 ttys000    0:05.37 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts --mode=cluster --cpus=4
4561 ttys000    0:05.39 /usr/local/Cellar/node/19.0.1/bin/node /usr/local/lib/node_modules/ts-node/dist/bin.js /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts --mode=cluster --cpus=4
4564 ttys001    0:00.00 grep app.ts # proceso línea de comando
```

## PM2

Requiere `pm2 install typescript` y `pm2 install ts-node`

Listar todos los procesos de PM2:

`pm2 list`

Modo `fork` (`pm2 start app.ts --watch`):

```
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 1   │ app        │ default     │ 1.0.0   │ fork    │ 6110     │ 8s     │ 2    │ online    │ 0%       │ 240.0mb  │ kuro  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

Modo `cluster` (`pm2 start app.ts --name="Server" --watch -i 4 `):

```
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 2   │ Server     │ default     │ 1.0.0   │ cluster │ 6240     │ 0s     │ 0    │ online    │ 0%       │ 92.1mb   │ kuro  │ enabled  │
│ 3   │ Server     │ default     │ 1.0.0   │ cluster │ 6241     │ 0s     │ 0    │ online    │ 0%       │ 55.8mb   │ kuro  │ enabled  │
│ 4   │ Server     │ default     │ 1.0.0   │ cluster │ 6246     │ 0s     │ 0    │ online    │ 0%       │ 43.6mb   │ kuro  │ enabled  │
│ 5   │ Server     │ default     │ 1.0.0   │ cluster │ 6251     │ 0s     │ 0    │ online    │ 0%       │ 29.6mb   │ kuro  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

## Nginx

### Config N1

Config `nginx-02.conf`

Ejecutar el servidor principal:

`pm2 start app.ts --name="main" --watch -- --port=8081`

Crear cluster de servidores:

`pm2 start app.ts --name="cluster1" --watch -- --mode=cluster --cpus=4 --port=8082`

Instancias del servidor:

- http://localhost:8081
- http://localhost:8082

El 8081 para el proceso principal y el cluster de 4 subprocesos en 8082 para `/api/randoms`

Utilicé el 8081 para el principal, Nginx no rooteaba otro nombre de servidor que no fuese `localhost`, por lo que `localhost:8080` es Nginx y `localhost:8081/5` son procesos de node.

`pm2 list`:

```
┌─────┬────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬───────┬──────────┐
│ id  │ name       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user  │ watching │
├─────┼────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼───────┼──────────┤
│ 3   │ cluster    │ default     │ 1.0.0   │ fork    │ 3689     │ 0s     │ 0    │ online    │ 0%       │ 2.1mb    │ kuro  │ enabled  │
│ 2   │ main       │ default     │ 1.0.0   │ fork    │ 3624     │ 10s    │ 0    │ online    │ 0%       │ 219.5mb  │ kuro  │ enabled  │
└─────┴────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴───────┴──────────┘
```

`ps -ax | grep app.ts`:

```
 4100 ??         0:03.19 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4117 ??         0:03.21 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4133 ??         0:04.26 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4134 ??         0:04.23 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4135 ??         0:04.29 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4136 ??         0:04.25 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 4142 ttys000    0:00.00 grep app.ts
```

### Config N2

Config `nginx-02.conf`

Ejecutar el servidor principal:

`pm2 start app.ts --name="main" --watch -- --port=8081`

Cluster de 4 servidores:

`pm2 start app.ts --name="cluster1" --watch -- --port=8082`

`pm2 start app.ts --name="cluster2" --watch -- --port=8083`

`pm2 start app.ts --name="cluster3" --watch -- --port=8084`

`pm2 start app.ts --name="cluster4" --watch -- --port=8085`

5 instancias del servidor:

- http://localhost:8081
- http://localhost:8082
- http://localhost:8083
- http://localhost:8084
- http://localhost:8085

`pm2 list`:

```
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬───────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user  │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼───────┼──────────┤
│ 9   │ cluster1    │ default     │ 1.0.0   │ fork    │ 8858     │ 28s    │ 0    │ online    │ 0%       │ 220.3mb  │ kuro  │ enabled  │
│ 10  │ cluster2    │ default     │ 1.0.0   │ fork    │ 8877     │ 11s    │ 0    │ online    │ 0%       │ 259.1mb  │ kuro  │ enabled  │
│ 11  │ cluster3    │ default     │ 1.0.0   │ fork    │ 8929     │ 5s     │ 0    │ online    │ 0%       │ 232.0mb  │ kuro  │ enabled  │
│ 12  │ cluster4    │ default     │ 1.0.0   │ fork    │ 8994     │ 1s     │ 0    │ online    │ 0%       │ 1.0mb    │ kuro  │ enabled  │
│ 8   │ main        │ default     │ 1.0.0   │ fork    │ 8812     │ 42s    │ 0    │ online    │ 0%       │ 224.8mb  │ kuro  │ enabled  │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴───────┴──────────┘
```

`ps -ax | grep app.ts`:

```
 8966 ??         0:04.34 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 8967 ??         0:04.40 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 8968 ??         0:04.44 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 8969 ??         0:04.46 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 8970 ??         0:04.43 node /home/kuro/Documentos/coderhouse-backend/desafios/13/app.ts
 9004 ttys000    0:00.00 grep app.ts
```
