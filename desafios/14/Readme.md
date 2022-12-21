## Autocannon (no log)

Resultado:

```
Running 20s test @ http://localhost:8080/info
100 connections


┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 50 ms │ 55 ms │ 73 ms │ 81 ms │ 57.37 ms │ 7.74 ms │ 284 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 1292    │ 1292    │ 1740    │ 1950    │ 1726.35 │ 119.84 │ 1292    │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 2.15 MB │ 2.15 MB │ 2.89 MB │ 3.24 MB │ 2.87 MB │ 200 kB │ 2.15 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 20

35k requests in 20.03s, 57.4 MB read
```

### Autocannon (log)

Resultado:

```
Running 20s test @ http://localhost:8080/info
100 connections


┌─────────┬───────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │
├─────────┼───────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 90 ms │ 109 ms │ 142 ms │ 149 ms │ 111.47 ms │ 17.34 ms │ 278 ms │
└─────────┴───────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%    │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 700     │ 700     │ 900    │ 1069    │ 890.8   │ 112.59 │ 700     │
├───────────┼─────────┼─────────┼────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 1.16 MB │ 1.16 MB │ 1.5 MB │ 1.78 MB │ 1.48 MB │ 187 kB │ 1.16 MB │
└───────────┴─────────┴─────────┴────────┴─────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 20

18k requests in 20.04s, 29.6 MB read
```

### Conclusión

De acuerdo con las pruebas y el análisis de los registros y sin ellos en la terminal\* (usando artillery** y autocannon, y el gráfico de llamas 0x\***), se puede descifrar que la salida de información de la terminal desde el servidor es relativamente bajo y pierde rendimiento

- Salida [con log](info-log-v8.txt) y [sin log](info-nolog-v8.txt)
- Salida [con log](artillery-log.txt) y [sin log](artillery-nolog.txt)
- Salida [con log](benchmark-log/flamegraph.html) y [sin log](benchmark-nolog/flamegraph.html)
