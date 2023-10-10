import addCrews from "../src/add-crews";
import { twoFlights, oneCrew, twoCrew, completePairing } from "./test-data";

// Test quick crews branch
test('should return a complete flights array with crew names attached', () => {
  expect(addCrews(twoFlights, oneCrew)).toStrictEqual(completePairing);
});

// Test async crews branch
test('should return a complete flights array with crew names attached', () => {
  expect(addCrews(twoFlights, twoCrew)).toStrictEqual(completePairing);
});
