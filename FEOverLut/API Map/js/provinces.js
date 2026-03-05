/**
 * Vietnam Provinces Data
 * All 63 provinces/cities with center coordinates and default zoom levels
 */
const VIETNAM_PROVINCES = [
  // 5 Central-governed cities
  { name: "Hà Nội", lat: 21.0285, lng: 105.8542, zoom: 12 },
  { name: "TP. Hồ Chí Minh", lat: 10.8231, lng: 106.6297, zoom: 12 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022, zoom: 13 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881, zoom: 12 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469, zoom: 13 },

  // Northern Vietnam - Northeast
  { name: "Hà Giang", lat: 22.8026, lng: 104.9784, zoom: 11 },
  { name: "Cao Bằng", lat: 22.6666, lng: 106.2580, zoom: 11 },
  { name: "Bắc Kạn", lat: 22.1443, lng: 105.8345, zoom: 11 },
  { name: "Tuyên Quang", lat: 21.8233, lng: 105.2139, zoom: 11 },
  { name: "Lào Cai", lat: 22.4856, lng: 103.9707, zoom: 11 },
  { name: "Yên Bái", lat: 21.7168, lng: 104.8986, zoom: 11 },
  { name: "Thái Nguyên", lat: 21.5928, lng: 105.8442, zoom: 12 },
  { name: "Lạng Sơn", lat: 21.8460, lng: 106.7572, zoom: 11 },
  { name: "Quảng Ninh", lat: 21.0064, lng: 107.2925, zoom: 11 },
  { name: "Bắc Giang", lat: 21.2730, lng: 106.1946, zoom: 12 },
  { name: "Phú Thọ", lat: 21.4225, lng: 105.2296, zoom: 11 },

  // Northern Vietnam - Northwest
  { name: "Điện Biên", lat: 21.3860, lng: 103.0167, zoom: 11 },
  { name: "Lai Châu", lat: 22.3863, lng: 103.4606, zoom: 11 },
  { name: "Sơn La", lat: 21.3270, lng: 103.9144, zoom: 11 },
  { name: "Hòa Bình", lat: 20.8171, lng: 105.3378, zoom: 11 },

  // Red River Delta
  { name: "Vĩnh Phúc", lat: 21.3089, lng: 105.6050, zoom: 12 },
  { name: "Bắc Ninh", lat: 21.1214, lng: 106.1111, zoom: 13 },
  { name: "Hải Dương", lat: 20.9373, lng: 106.3146, zoom: 12 },
  { name: "Hưng Yên", lat: 20.6464, lng: 106.0512, zoom: 12 },
  { name: "Thái Bình", lat: 20.4463, lng: 106.3365, zoom: 12 },
  { name: "Hà Nam", lat: 20.5835, lng: 105.9230, zoom: 13 },
  { name: "Nam Định", lat: 20.4174, lng: 106.1685, zoom: 12 },
  { name: "Ninh Bình", lat: 20.2506, lng: 105.9745, zoom: 12 },

  // North Central Coast
  { name: "Thanh Hóa", lat: 19.8067, lng: 105.7852, zoom: 10 },
  { name: "Nghệ An", lat: 19.2342, lng: 104.9200, zoom: 10 },
  { name: "Hà Tĩnh", lat: 18.3559, lng: 105.8877, zoom: 11 },
  { name: "Quảng Bình", lat: 17.4690, lng: 106.6222, zoom: 11 },
  { name: "Quảng Trị", lat: 16.7943, lng: 107.0640, zoom: 11 },
  { name: "Thừa Thiên Huế", lat: 16.4637, lng: 107.5909, zoom: 12 },

  // South Central Coast
  { name: "Quảng Nam", lat: 15.5394, lng: 108.0191, zoom: 11 },
  { name: "Quảng Ngãi", lat: 15.1214, lng: 108.8044, zoom: 11 },
  { name: "Bình Định", lat: 13.7820, lng: 109.2196, zoom: 11 },
  { name: "Phú Yên", lat: 13.0882, lng: 109.0929, zoom: 11 },
  { name: "Khánh Hòa", lat: 12.2388, lng: 109.1967, zoom: 11 },
  { name: "Ninh Thuận", lat: 11.5752, lng: 108.9890, zoom: 12 },
  { name: "Bình Thuận", lat: 11.0904, lng: 108.0721, zoom: 11 },

  // Central Highlands
  { name: "Kon Tum", lat: 14.3498, lng: 108.0005, zoom: 11 },
  { name: "Gia Lai", lat: 13.9832, lng: 108.0000, zoom: 10 },
  { name: "Đắk Lắk", lat: 12.7100, lng: 108.2378, zoom: 10 },
  { name: "Đắk Nông", lat: 12.2646, lng: 107.6098, zoom: 11 },
  { name: "Lâm Đồng", lat: 11.9404, lng: 108.4423, zoom: 11 },

  // Southeast
  { name: "Bình Phước", lat: 11.7512, lng: 106.7235, zoom: 11 },
  { name: "Tây Ninh", lat: 11.3353, lng: 106.1099, zoom: 12 },
  { name: "Bình Dương", lat: 11.1664, lng: 106.6319, zoom: 12 },
  { name: "Đồng Nai", lat: 11.0686, lng: 106.8330, zoom: 11 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.5417, lng: 107.2430, zoom: 11 },

  // Mekong Delta
  { name: "Long An", lat: 10.5360, lng: 106.4133, zoom: 11 },
  { name: "Tiền Giang", lat: 10.3599, lng: 106.3646, zoom: 11 },
  { name: "Bến Tre", lat: 10.2434, lng: 106.3756, zoom: 12 },
  { name: "Trà Vinh", lat: 9.9347, lng: 106.3455, zoom: 12 },
  { name: "Vĩnh Long", lat: 10.2537, lng: 105.9722, zoom: 12 },
  { name: "Đồng Tháp", lat: 10.4938, lng: 105.6882, zoom: 11 },
  { name: "An Giang", lat: 10.5216, lng: 105.1259, zoom: 11 },
  { name: "Kiên Giang", lat: 10.0125, lng: 105.0809, zoom: 11 },
  { name: "Hậu Giang", lat: 9.7579, lng: 105.6413, zoom: 12 },
  { name: "Sóc Trăng", lat: 9.6037, lng: 105.9800, zoom: 12 },
  { name: "Bạc Liêu", lat: 9.2941, lng: 105.7216, zoom: 12 },
  { name: "Cà Mau", lat: 9.1527, lng: 105.1961, zoom: 11 },
];

// Vietnam geographic bounds
const VIETNAM_BOUNDS = {
  north: 23.393395,
  south: 8.18,
  east: 117.0,  // Extended east to include Trường Sa
  west: 102.14,
  center: { lat: 16.0, lng: 107.0 },
  defaultZoom: 6
};

// Sovereignty data
const HOANG_SA = {
  name: "Quần đảo Hoàng Sa",
  nameEn: "Paracel Islands",
  center: { lat: 16.5, lng: 112.0 },
  // Approximate boundary polygon
  boundary: [
    [17.1, 111.2],
    [17.1, 112.9],
    [15.8, 112.9],
    [15.8, 111.2],
  ],
  islands: [
    { name: "Đảo Phú Lâm", lat: 16.8361, lng: 112.3383 },
    { name: "Đảo Linh Côn", lat: 16.6700, lng: 112.7300 },
    { name: "Đảo Tri Tôn", lat: 15.7833, lng: 111.2000 },
    { name: "Đảo Hoàng Sa", lat: 16.5300, lng: 111.5800 },
    { name: "Đảo Quang Ảnh", lat: 16.9700, lng: 112.3400 },
    { name: "Đảo Duy Mộng", lat: 16.4600, lng: 112.2200 },
    { name: "Đảo Ba Ba", lat: 16.5100, lng: 112.3100 },
  ]
};

const TRUONG_SA = {
  name: "Quần đảo Trường Sa",
  nameEn: "Spratly Islands",
  center: { lat: 10.0, lng: 114.5 },
  boundary: [
    [12.0, 111.5],
    [12.0, 117.0],
    [7.0, 117.0],
    [7.0, 111.5],
  ],
  islands: [
    { name: "Đảo Trường Sa Lớn", lat: 8.6442, lng: 111.9189 },
    { name: "Đảo Song Tử Tây", lat: 11.4283, lng: 114.3317 },
    { name: "Đảo Sinh Tồn", lat: 9.8833, lng: 114.3333 },
    { name: "Đảo Nam Yết", lat: 10.1833, lng: 114.3667 },
    { name: "Đảo Sơn Ca", lat: 10.3833, lng: 114.4833 },
    { name: "Đảo Trường Sa Đông", lat: 8.9667, lng: 112.3500 },
    { name: "Đá Lát", lat: 8.6667, lng: 111.6667 },
    { name: "Đảo An Bang", lat: 7.8833, lng: 112.9000 },
    { name: "Đá Tây", lat: 8.8500, lng: 112.2167 },
    { name: "Đảo Phan Vinh", lat: 8.9500, lng: 113.6867 },
    { name: "Đá Cô Lin", lat: 9.7583, lng: 114.2583 },
    { name: "Đá Len Đao", lat: 9.7833, lng: 114.3833 },
  ]
};

const BIEN_DONG = {
  name: "BIỂN ĐÔNG",
  nameEn: "East Sea",
  position: { lat: 12.5, lng: 112.0 }
};
