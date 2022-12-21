type Randoms = {
  [key: string]: number;
};
process.on?.(
  "message",
  (message: { command: string | undefined; amount: number | undefined }) => {
    const randoms: Randoms = {};
    switch (message?.command) {
      case "start":
        const amount: number = message?.amount || 1e8;
        for (
          let x: number = 0, max: number = amount, num: number;
          x < amount;
          x = x + 1
        ) {
          num = Math.ceil(Math.random() * 1000);
          if (randoms[num]) randoms[num]++;
          else randoms[num] = 1;
        }
        process.send?.({ randoms });
        break;
    }
  }
);
