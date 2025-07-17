
export const tunisianCities = [
  // Tunis
  { governorate: "Tunis", cities: ["Tunis", "La Marsa", "Sidi Bou Said", "Carthage", "Ariana", "Manouba", "Ben Arous"] },
  
  // Sfax
  { governorate: "Sfax", cities: ["Sfax", "Sakiet Ezzit", "Sakiet Eddayer", "Chihia", "Menzel Chaker", "Ghraiba", "Agareb"] },
  
  // Sousse
  { governorate: "Sousse", cities: ["Sousse", "Monastir", "Mahdia", "Ksibet Sousse", "Kalaa Kebira", "Kalaa Sghira", "Msaken"] },
  
  // Kairouan
  { governorate: "Kairouan", cities: ["Kairouan", "Sbikha", "Oueslatia", "Haffouz", "Alaa", "Hajeb El Ayoun", "Nasrallah"] },
  
  // Bizerte
  { governorate: "Bizerte", cities: ["Bizerte", "Menzel Bourguiba", "Mateur", "Ras Jebel", "Sejnane", "Joumine", "Tinja"] },
  
  // Gabes
  { governorate: "Gabes", cities: ["Gabes", "Mareth", "Metouia", "Ghannouch", "El Hamma", "Matmata", "Nouvelle Matmata"] },
  
  // Ariana
  { governorate: "Ariana", cities: ["Ariana", "Ettadhamen", "Raoued", "Kalaat el Andalous", "Sidi Thabet", "Mnihla"] },
  
  // Gafsa
  { governorate: "Gafsa", cities: ["Gafsa", "Metlaoui", "Redeyef", "Moularès", "Sened", "Belkhir", "Ksar"] },
  
  // Monastir
  { governorate: "Monastir", cities: ["Monastir", "Ksar Hellal", "Moknine", "Jemmal", "Teboulba", "Sahline", "Sayada"] },
  
  // Ben Arous
  { governorate: "Ben Arous", cities: ["Ben Arous", "Ezzahra", "Hammam Lif", "Hammam Chott", "Bou Mhel el Bassatine", "El Mourouj", "Fouchana"] },
  
  // Kasserine
  { governorate: "Kasserine", cities: ["Kasserine", "Feriana", "Foussana", "Sbeitla", "Jedelienne", "Thala", "Haydra"] },
  
  // Sidi Bouzid
  { governorate: "Sidi Bouzid", cities: ["Sidi Bouzid", "Jelma", "Cebbala Ouled Asker", "Bir El Hafey", "Sidi Ali Ben Aoun", "Menzel Bouzaiane"] },
  
  // Mahdia
  { governorate: "Mahdia", cities: ["Mahdia", "Ksour Essef", "Chorbane", "Hebira", "Melloulèche", "Ouled Chamekh", "Bou Merdes"] },
  
  // Medenine
  { governorate: "Medenine", cities: ["Medenine", "Zarzis", "Houmt Souk", "Ajim", "Midoun", "Ben Gardane", "Sidi Makhlouf"] },
  
  // Nabeul
  { governorate: "Nabeul", cities: ["Nabeul", "Hammamet", "Kelibia", "Menzel Temime", "Korba", "Grombalia", "Soliman"] },
  
  // Tataouine
  { governorate: "Tataouine", cities: ["Tataouine", "Ghomrassen", "Bir Lahmar", "Remada", "Dehiba", "Smâr"] },
  
  // Beja
  { governorate: "Beja", cities: ["Beja", "Medjez el Bab", "Goubellat", "Teboursouk", "Nefza", "Amdoun", "Testour"] },
  
  // Jendouba
  { governorate: "Jendouba", cities: ["Jendouba", "Tabarka", "Ain Draham", "Fernana", "Bou Salem", "Ghardimaou", "Oued Meliz"] },
  
  // Zaghouan
  { governorate: "Zaghouan", cities: ["Zaghouan", "El Fahs", "Nadhour", "Saouaf", "Bir Mcherga", "Djebel Oust"] },
  
  // Siliana
  { governorate: "Siliana", cities: ["Siliana", "Bou Arada", "Gaâfour", "El Krib", "Sidi Bou Rouis", "Makthar", "Rouhia"] },
  
  // Kef
  { governorate: "Kef", cities: ["Kef", "Dahmani", "Sers", "Tajerouine", "Nebeur", "Kalaat Khasba", "Jérissa"] },
  
  // Tozeur
  { governorate: "Tozeur", cities: ["Tozeur", "Nefta", "Degache", "Tameghza", "Chebika", "Hazoua"] },
  
  // Kebili
  { governorate: "Kebili", cities: ["Kebili", "Douz", "Souk Lahad", "Faouar", "Blidet", "Nouail"] }
];

export const getAllCities = () => {
  return tunisianCities.flatMap(gov => 
    gov.cities.map(city => ({ city, governorate: gov.governorate }))
  );
};

export const getGovernoratesByCity = (cityName: string) => {
  return tunisianCities.find(gov => 
    gov.cities.some(city => city.toLowerCase() === cityName.toLowerCase())
  )?.governorate || "";
};
