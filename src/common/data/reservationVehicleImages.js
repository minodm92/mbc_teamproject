// Official model image sources: src/assets/images/reservation/vehicles/sources.json
const vehicleImageModules = import.meta.glob(
  '../../assets/images/reservation/vehicles/*.png',
  { eager: true, import: 'default' },
);

const vehicleImage = (filename) =>
  vehicleImageModules[`../../assets/images/reservation/vehicles/${filename}`];

export const reservationVehicleImages = {
  "SONATA_EDGE": vehicleImage('sonata-edge.png'),
  "GRANDEUR": vehicleImage('grandeur.png'),
  "SONATA_HYBRID": vehicleImage('sonata-hybrid.png'),
  "PALISADE_HYBRID": vehicleImage('palisade-hybrid.png'),
  "PALISADE": vehicleImage('palisade.png'),
  "AVANTE_N": vehicleImage('avante-n.png'),
  "SANTA_FE_HYBRID": vehicleImage('santa-fe-hybrid.png'),
  "TUCSON_HYBRID": vehicleImage('tucson-hybrid.png'),
  "SANTA_FE": vehicleImage('santa-fe.png'),
  "IONIQ_5": vehicleImage('ioniq-5.png'),
  "KONA": vehicleImage('kona.png'),
  "KONA_ELECTRIC": vehicleImage('kona-electric.png'),
  "IONIQ_5_N": vehicleImage('ioniq-5-n.png'),
  "IONIQ_6": vehicleImage('ioniq-6.png'),
  "IONIQ_9": vehicleImage('ioniq-9.png'),
  "IONIQ_6_N": vehicleImage('ioniq-6-n.png'),
  "TUCSON": vehicleImage('tucson.png'),
  "GV80_COUPE": vehicleImage('gv80-coupe.png'),
  "ELECTRIFIED_GV70": vehicleImage('electrified-gv70.png'),
  "NEXO": vehicleImage('nexo.png'),
  "G70": vehicleImage('g70.png'),
  "GV60_MAGMA": vehicleImage('gv60-magma.png'),
  "GV60": vehicleImage('gv60.png'),
  "AVANTE": vehicleImage('avante.png'),
  "GRANDEUR_HYBRID": vehicleImage('grandeur-hybrid.png'),
  "G80_BLACK": vehicleImage('g80-black.png'),
  "CASPER_ELECTRIC": vehicleImage('casper-electric.png'),
  "STARIA_LIMOUSINE_EV": vehicleImage('staria-limousine-ev.png'),
  "CASPER": "/images/home-renewal/drive-casper.png",
  "G90_BLACK": "/images/home-renewal/drive-g90.png",
  "GV80": "/images/home-renewal/drive-gv80.png",
  "GV70": vehicleImage('gv70.png'),
  "HERITAGE": vehicleImage('heritage-pony-hd.png')
};
