import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { MachineryService } from './machinery/machinery.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    private readonly machineryService: MachineryService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const carlos = await this.usersService.findByEmail('carlos@ejemplo.com');
    const maria = await this.usersService.findByEmail('maria@ejemplo.com');

    let ownerId = '';
    let contractorId = '';

    if (!carlos) {
      const passwordHash = await bcrypt.hash('123456', 10);
      const user = await this.usersService.create({
        email: 'carlos@ejemplo.com',
        passwordHash,
        name: 'Carlos Rodriguez',
        phone: '+57 312 456 7890',
        role: 'propietario',
        location: 'Mocoa, Putumayo',
      });
      ownerId = user.id;
      console.log('Seeded owner: Carlos Rodriguez');
    } else {
      ownerId = carlos.id;
    }

    if (!maria) {
      const passwordHash = await bcrypt.hash('123456', 10);
      const user = await this.usersService.create({
        email: 'maria@ejemplo.com',
        passwordHash,
        name: 'Maria Gonzalez',
        phone: '+57 315 789 0123',
        role: 'contratista',
        location: 'Puerto Asis, Putumayo',
      });
      contractorId = user.id;
      console.log('Seeded contractor: Maria Gonzalez');
    } else {
      contractorId = maria.id;
    }

    const machineryCount = await this.machineryService.findAll({});
    if (machineryCount.length < 12) {
      console.log(`Clearing ${machineryCount.length} existing machines to re-seed 12 fresh ones (2 per category)...`);
      for (const item of machineryCount) {
        try {
          await this.machineryService.remove(item.id);
        } catch (err) {
          console.error(`Could not delete machine ${item.id}:`, err);
        }
      }

      const mockMachinery = [
        {
          title: 'Excavadora CAT 320D',
          category: 'excavadora',
          brand: 'Caterpillar',
          model: '320D',
          year: 2019,
          description: 'Excavadora hidraulica en excelente estado, ideal para movimiento de tierras y excavaciones profundas. Mantenimiento al dia.',
          power: '148 HP',
          weight: '20,000 kg',
          capacity: '1.2 m3',
          fuelType: 'Diesel',
          pricePerDay: 1200000,
          pricePerWeek: 7000000,
          pricePerMonth: 25000000,
          images: ['/machinery/excavadora-1.jpg'],
          address: 'Km 5 Via Mocoa - Villagarzon',
          municipality: 'Mocoa',
          lat: 1.1494,
          lng: -76.6519,
        },
        {
          title: 'Excavadora Sany SY215C',
          category: 'excavadora',
          brand: 'Sany',
          model: 'SY215C',
          year: 2021,
          description: 'Excavadora sobre orugas de alta eficiencia y bajo consumo. Excelente rendimiento en mineria y construccion.',
          power: '155 HP',
          weight: '21,900 kg',
          capacity: '1.3 m3',
          fuelType: 'Diesel',
          pricePerDay: 1300000,
          pricePerWeek: 7500000,
          pricePerMonth: 27000000,
          images: ['/machinery/excavadora-2.jpg'],
          address: 'Avenida Colombia',
          municipality: 'Puerto Asis',
          lat: 0.5100,
          lng: -76.5000,
        },
        {
          title: 'Retroexcavadora John Deere 310L',
          category: 'retroexcavadora',
          brand: 'John Deere',
          model: '310L',
          year: 2020,
          description: 'Retroexcavadora versatil para trabajos de construccion y excavacion. Perfecta para obras medianas.',
          power: '97 HP',
          weight: '8,500 kg',
          capacity: '0.8 m3',
          fuelType: 'Diesel',
          pricePerDay: 800000,
          pricePerWeek: 4500000,
          pricePerMonth: 16000000,
          images: ['/machinery/retroexcavadora-1.jpg'],
          address: 'Barrio Centro',
          municipality: 'Puerto Asis',
          lat: 0.5072,
          lng: -76.5019,
        },
        {
          title: 'Retroexcavadora Case 580N',
          category: 'retroexcavadora',
          brand: 'Case',
          model: '580N',
          year: 2019,
          description: 'Retroexcavadora con excelente fuerza de excavacion y cabina confortable. Mantenimiento certificado.',
          power: '85 HP',
          weight: '7,900 kg',
          capacity: '0.7 m3',
          fuelType: 'Diesel',
          pricePerDay: 750000,
          pricePerWeek: 4200000,
          pricePerMonth: 15000000,
          images: ['/machinery/retroexcavadora-2.jpg'],
          address: 'Barrio Las Americas',
          municipality: 'Mocoa',
          lat: 1.1500,
          lng: -76.6500,
        },
        {
          title: 'Bulldozer Komatsu D65EX',
          category: 'bulldozer',
          brand: 'Komatsu',
          model: 'D65EX',
          year: 2018,
          description: 'Bulldozer potente para nivelacion de terrenos y movimiento de grandes volumenes de tierra.',
          power: '205 HP',
          weight: '19,500 kg',
          capacity: '4.5 m3',
          fuelType: 'Diesel',
          pricePerDay: 1500000,
          pricePerWeek: 8500000,
          pricePerMonth: 30000000,
          images: ['/machinery/bulldozer-1.jpg'],
          address: 'Via Orito - San Miguel',
          municipality: 'Orito',
          lat: 0.6644,
          lng: -76.8708,
        },
        {
          title: 'Bulldozer Caterpillar D6N',
          category: 'bulldozer',
          brand: 'Caterpillar',
          model: 'D6N LGP',
          year: 2020,
          description: 'Bulldozer con tecnologia avanzada para nivelacion de precision. Cadena de perfil bajo para terrenos blandos.',
          power: '166 HP',
          weight: '16,500 kg',
          capacity: '3.8 m3',
          fuelType: 'Diesel',
          pricePerDay: 1400000,
          pricePerWeek: 8000000,
          pricePerMonth: 28000000,
          images: ['/machinery/bulldozer-2.jpg'],
          address: 'Vereda Caldas',
          municipality: 'Villagarzon',
          lat: 1.0300,
          lng: -76.6100,
        },
        {
          title: 'Rodillo Compactador BOMAG BW211',
          category: 'rodillo',
          brand: 'BOMAG',
          model: 'BW211',
          year: 2021,
          description: 'Rodillo vibratorio para compactacion de suelos y asfalto. Ideal para proyectos viales.',
          power: '130 HP',
          weight: '11,000 kg',
          fuelType: 'Diesel',
          pricePerDay: 600000,
          pricePerWeek: 3500000,
          pricePerMonth: 12000000,
          images: ['/machinery/rodillo-1.jpg'],
          address: 'Zona Industrial',
          municipality: 'Villagarzon',
          lat: 1.0314,
          lng: -76.6169,
        },
        {
          title: 'Rodillo Compactador Dynapac CA250',
          category: 'rodillo',
          brand: 'Dynapac',
          model: 'CA250',
          year: 2018,
          description: 'Compactador de suelo vibratorio autopropulsado. Alta fuerza de compactacion para bases y sub-bases.',
          power: '110 HP',
          weight: '10,500 kg',
          fuelType: 'Diesel',
          pricePerDay: 550000,
          pricePerWeek: 3200000,
          pricePerMonth: 11000000,
          images: ['/machinery/rodillo-2.jpg'],
          address: 'Vereda Yarumo',
          municipality: 'Orito',
          lat: 0.6600,
          lng: -76.8700,
        },
        {
          title: 'Cargador Frontal CAT 950H',
          category: 'cargador',
          brand: 'Caterpillar',
          model: '950H',
          year: 2017,
          description: 'Cargador frontal de alta capacidad para carga y transporte de materiales.',
          power: '213 HP',
          weight: '18,000 kg',
          capacity: '3.3 m3',
          fuelType: 'Diesel',
          pricePerDay: 1100000,
          pricePerWeek: 6500000,
          pricePerMonth: 23000000,
          images: ['/machinery/cargador-1.jpg'],
          address: 'Km 2 Via Sibundoy',
          municipality: 'Sibundoy',
          lat: 1.1911,
          lng: -76.9236,
        },
        {
          title: 'Cargador Frontal John Deere 524K',
          category: 'cargador',
          brand: 'John Deere',
          model: '524K',
          year: 2019,
          description: 'Cargador frontal articulado, agil y de alta maniobrabilidad. Perfecto para plantas de agregados.',
          power: '140 HP',
          weight: '12,500 kg',
          capacity: '2.1 m3',
          fuelType: 'Diesel',
          pricePerDay: 950000,
          pricePerWeek: 5500000,
          pricePerMonth: 20000000,
          images: ['/machinery/cargador-2.jpg'],
          address: 'Salida a Mocoa',
          municipality: 'Mocoa',
          lat: 1.1480,
          lng: -76.6530,
        },
        {
          title: 'Volqueta Mack Granite',
          category: 'volqueta',
          brand: 'Mack',
          model: 'Granite',
          year: 2019,
          description: 'Volqueta de gran capacidad para transporte de materiales de construccion y agregados.',
          power: '380 HP',
          weight: '15,000 kg',
          capacity: '16 m3',
          fuelType: 'Diesel',
          pricePerDay: 700000,
          pricePerWeek: 4000000,
          pricePerMonth: 14000000,
          images: ['/machinery/volqueta-1.jpg'],
          address: 'Barrio El Progreso',
          municipality: 'Valle del Guamuez',
          lat: 0.4333,
          lng: -76.9167,
        },
        {
          title: 'Volqueta Chevrolet FVR',
          category: 'volqueta',
          brand: 'Chevrolet',
          model: 'FVR',
          year: 2021,
          description: 'Volqueta sencilla de 7 metros cubicos, ideal para transporte urbano de agregados y escombros.',
          power: '240 HP',
          weight: '8,000 kg',
          capacity: '7 m3',
          fuelType: 'Diesel',
          pricePerDay: 500000,
          pricePerWeek: 2800000,
          pricePerMonth: 10000000,
          images: ['/machinery/volqueta-2.jpg'],
          address: 'Sector La Esmeralda',
          municipality: 'Orito',
          lat: 0.6650,
          lng: -76.8720,
        },
      ];

      for (const item of mockMachinery) {
        await this.machineryService.create(item, ownerId);
      }
      console.log('Seeded 12 machines successfully (2 per category)');
    }
  }
}
