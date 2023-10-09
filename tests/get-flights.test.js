import getFlights from "../src/get-flights";

const gridText = `
    var gGridText = 'L:: ::1::We::09/20/23:: ::0930:: ::MCO::RIC::09:02::11:09::02:07::
    02:07:: :: ::320::3  ::4958::00:00:-:D:: ::2:: Report 09/20/23 @ 08:25 (MCO)
    Release 11:39/20 (RIC) ::Duty 03:14  FDP(1) 02:44::02:07::02:07::
    Dhd 00:00   Pay 02:07::   Layover 17:36 (17:36)   :-:L:: ::3::Th::09/21/23::
    ::0216:: ::RIC::LAS::06:00::08:00::05:00::05:00:: :: ::320*::3  ::4950::03:58
    :-:L:: ::4::Th::09/21/23:: ::1700::D::LAS::MCI::11:58::16:48::00:00::02:50
    ::SIT:: ::320::3  ::4956::00:00:-:D:: ::5:: Report 09/21/23 @ 05:15 (RIC)   
    Release 17:18/21 (MCI) ::Duty 13:03  FDP(1) 05:45::05:00::07:59::  Dhd 02:50   
    Pay 07:59::   Layover 11:27 (11:27)   :-:L:: ::6::Fr::09/22/23:: ::3020:: 
    ::MCI::MCO::05:26::09:03::02:37::02:37:: :: ::319::3  ::1515:: :-:D:: ::7:: 
    Report 09/22/23 @ 04:45 (MCI)   Release 09:33/22 (MCO) ::Duty 03:48  FDP(1) 03:18
    ::02:37::02:47::  Dhd 00:00   Pay 02:47::    :-:T:: ::Totals::   Duty Avg 02:07
    ::09:44::15:00::  Dhd 02:50   Pay 15:00::TAFB 49:08';var gGridTextHotel = 'L:: 
    ::1::We::09/20/23:: ::0930:: ::MCO::RIC::09:02::11:09::02:07::02:07:: :: ::320::3  
    ::4958::00:00:-:D:: ::2:: Report 09/20/23 @ 08:25 (MCO)   Release 11:39/20 (RIC) 
    ::Richmond Marriott (HTT:0):: :: ::(804)643-3400::   Layover 17:36 (17:36)      
    :-:L:: ::3::Th::09/21/23:: ::0216:: ::RIC::LAS::06:00::08:00::05:00::05:00:: 
    :: ::320*::3  ::4950::03:58:-:L:: ::4::Th::09/21/23:: ::1700::D::LAS::MCI::11:58
    ::16:48::00:00::02:50::SIT:: ::320::3  ::4956::00:00:-:D:: ::5:: Report 09/21/23 
    @ 05:15 (RIC)   Release 17:18/21 (MCI) ::*Loews Kansas City Hotel (HTT:0):: :: 
    ::8777481451     ::   Layover 11:27 (11:27)    :-:L:: ::6::Fr::09/22/23:: 
    ::3020:: ::MCI::MCO::05:26::09:03::02:37::02:37:: :: ::319::3  ::1515:: :-:D:: 
    ::7:: Report 09/22/23 @ 04:45 (MCI)   Release 09:33/22 (MCO) :: :: :: :: ::      
    :-:T:: ::Totals::  Duty Avg 02:07::09:44::15:00::  Dhd 02:50  Pay 15:00
    ::TAFB 49:08'; 
  `;

const flights = [
  {
    "date": "09/20/23",
    "code": "NKS",
    "fltNum": "930",
    "dh": "",
    "orig": "MCO",
    "dest": "RIC",
    "depart": "09:02",
    "arrive": "11:09",
    "block": "02:07",
    "tail": "N958NK",
    "crew": []
  },
  {
    "date": "09/21/23",
    "code": "NKS",
    "fltNum": "216",
    "dh": "",
    "orig": "RIC",
    "dest": "LAS",
    "depart": "06:00",
    "arrive": "08:00",
    "block": "05:00",
    "tail": "N950NK",
    "crew": []
  },
  {
    "date": "09/22/23",
    "code": "NKS",
    "fltNum": "3020",
    "dh": "",
    "orig": "MCI",
    "dest": "MCO",
    "depart": "05:26",
    "arrive": "09:03",
    "block": "02:37",
    "tail": "N515NK",
    "crew": []
  }
]

test('Returns a properly-formatted flights object with EMPTY crews[].', () => {
  expect(getFlights(gridText)).toStrictEqual(flights);
});
