import getCrews from "../src/get-crews";
import { hdnCrewData, crewNames } from "./test-data";

test('Returns a properly-formatted crewNames object.', () => {
  expect(getCrews(hdnCrewData)).toStrictEqual(crewNames);
});
