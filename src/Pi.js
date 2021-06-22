export default function pi(len) {
  let i = 1n;
  let x = 3n * 10n ** (BigInt(len) + 20n);
  let pi = x;
  while (x > 0) {
    x = (x * i) / ((i + 1n) * 4n);
    pi += x / (i + 2n);
    i += 2n;
  }

  let result = pi / 10n ** 21n;

  let value = [...result.toString()].map((c) => parseInt(c, 10));
  return value;
}
