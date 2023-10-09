import getCrews from "../src/get-crews";

const hdnCrewData = `Yes::CA::A::76148::   WENDT::BRIAN       ::1919 :: :: :: :-:
                     Yes::FO::A::113947::  SCHLENK::SUSANNE   ::2870 :: :: ::`

const crewNames = [
  {
    "fltNum": "",
    "orig": "",
    "dest": "",
    "crew": [
      {
        "role": "CA",
        "dh": "",
        "id": "76148",
        "last": "Wendt",
        "first": "Brian"
      },
      {
        "role": "FO",
        "dh": "",
        "id": "113947",
        "last": "Schlenk",
        "first": "Susanne"
      }
    ]
  }
]

test('Returns a properly-formatted crewNames object.', () => {
  expect(getCrews(hdnCrewData)).toStrictEqual(crewNames);
});
