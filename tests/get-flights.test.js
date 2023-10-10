import getFlights from "../src/get-flights";
import { gridText, gridFlights  } from "./test-data";

test('Returns a properly-formatted flights object with EMPTY crews[].', () => {
  expect(getFlights(gridText)).toStrictEqual(gridFlights);
});
