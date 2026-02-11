
export interface PostalData {
  country: string;
  zip: string;
  district: string;
  city: string;
  policeStation: string;
  postOffice: string;
  village: string;
}

export const bdPostalData: PostalData[] = [
  {
    country: "Bangladesh",
    zip: "2200",
    district: "Mymensingh",
    city: "Mymensingh",
    policeStation: "Mymensingh Sadar",
    postOffice: "Mymensingh HO",
    village: "Chorpara"
  },
  {
    country: "Bangladesh",
    zip: "1216",
    district: "Dhaka",
    city: "Dhaka",
    policeStation: "Mirpur",
    postOffice: "Mirpur-1",
    village: "Section 1"
  },
  {
    country: "Bangladesh",
    zip: "1212",
    district: "Dhaka",
    city: "Dhaka",
    policeStation: "Banani",
    postOffice: "Banani TSO",
    village: "Banani Area"
  },
  {
    country: "Bangladesh",
    zip: "1205",
    district: "Dhaka",
    city: "Dhaka",
    policeStation: "Dhanmondi",
    postOffice: "New Market",
    village: "Dhanmondi Residentials"
  },
  {
    country: "Bangladesh",
    zip: "4000",
    district: "Chittagong",
    city: "Chittagong",
    policeStation: "Kotwali",
    postOffice: "Chittagong GPO",
    village: "Kotwali Area"
  },
  {
    country: "Bangladesh",
    zip: "3321",
    district: "Jalpur",
    city: "Jalpur",
    policeStation: "Jalpur Police Station",
    postOffice: "Bosta Bich",
    village: "Jalpur village"
  },
  {
    country: "United States",
    zip: "10001",
    district: "New York",
    city: "New York City",
    policeStation: "Midtown Precinct",
    postOffice: "James A. Farley",
    village: "Manhattan"
  },
  {
    country: "United Kingdom",
    zip: "SW1A 1AA",
    district: "Greater London",
    city: "London",
    policeStation: "Westminster Police",
    postOffice: "Buckingham Palace PO",
    village: "Westminster"
  }
];
