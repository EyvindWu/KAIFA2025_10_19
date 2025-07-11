// personInfoMap 和 buildTimeline 工具函数

// 统一sender/recipient类型，兼容mock和自动生成
export interface Person {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const personInfoMap: Record<string, Person> = {
  'Andy Liu': {
    name: 'Andy Liu', email: 'andy.liu@email.com', phone: '+49 100000001', address: 'Andystraße 1', city: 'Berlin', postalCode: '10115', country: 'Germany',
  },
  'Xavier': {
    name: 'Xavier', email: 'xavier@email.com', phone: '+49 100000002', address: 'Xavierplatz 2', city: 'Munich', postalCode: '80331', country: 'Germany',
  },
  'Victor': {
    name: 'Victor', email: 'victor@email.com', phone: '+49 100000003', address: 'Victorallee 3', city: 'Frankfurt', postalCode: '60311', country: 'Germany',
  },
  'Tina': {
    name: 'Tina', email: 'tina@email.com', phone: '+49 100000004', address: 'Tinastr. 4', city: 'Hamburg', postalCode: '20095', country: 'Germany',
  },
  'Rose': {
    name: 'Rose', email: 'rose@email.com', phone: '+49 100000005', address: 'Rosenweg 5', city: 'Stuttgart', postalCode: '70173', country: 'Germany',
  },
  'Paul': {
    name: 'Paul', email: 'paul@email.com', phone: '+49 100000006', address: 'Paulstr. 6', city: 'Cologne', postalCode: '50667', country: 'Germany',
  },
  'Noah': {
    name: 'Noah', email: 'noah@email.com', phone: '+49 100000007', address: 'Noahweg 7', city: 'Düsseldorf', postalCode: '40210', country: 'Germany',
  },
  'Leo': {
    name: 'Leo', email: 'leo@email.com', phone: '+49 100000008', address: 'Leoring 8', city: 'Leipzig', postalCode: '04109', country: 'Germany',
  },
  'Jack': {
    name: 'Jack', email: 'jack@email.com', phone: '+49 100000009', address: 'Jackgasse 9', city: 'Dresden', postalCode: '01067', country: 'Germany',
  },
  'Henry': {
    name: 'Henry', email: 'henry@email.com', phone: '+49 100000010', address: 'Henryplatz 10', city: 'Bremen', postalCode: '28195', country: 'Germany',
  },
  'Frank': {
    name: 'Frank', email: 'frank@email.com', phone: '+49 100000011', address: 'Frankallee 11', city: 'Hannover', postalCode: '30159', country: 'Germany',
  },
  'Dave': {
    name: 'Dave', email: 'dave@email.com', phone: '+49 100000012', address: 'Davestreet 12', city: 'Nuremberg', postalCode: '90402', country: 'Germany',
  },
  'Bob': {
    name: 'Bob', email: 'bob@email.com', phone: '+49 100000013', address: 'Bobweg 13', city: 'Essen', postalCode: '45127', country: 'Germany',
  },
  'Lily': {
    name: 'Lily', email: 'lily@email.com', phone: '+49 100000014', address: 'Lilystr. 14', city: 'Dortmund', postalCode: '44135', country: 'Germany',
  },
  'Alice': {
    name: 'Alice', email: 'alice@email.com', phone: '+49 100000015', address: 'Aliceweg 15', city: 'Berlin', postalCode: '10115', country: 'Germany',
  },
  'Carol': {
    name: 'Carol', email: 'carol@email.com', phone: '+49 100000016', address: 'Carolplatz 16', city: 'Munich', postalCode: '80331', country: 'Germany',
  },
  'Eve': {
    name: 'Eve', email: 'eve@email.com', phone: '+49 100000017', address: 'Eveweg 17', city: 'Hamburg', postalCode: '20095', country: 'Germany',
  },
  'Grace': {
    name: 'Grace', email: 'grace@email.com', phone: '+49 100000018', address: 'Graceweg 18', city: 'Stuttgart', postalCode: '70173', country: 'Germany',
  },
  'Ivy': {
    name: 'Ivy', email: 'ivy@email.com', phone: '+49 100000019', address: 'Ivyweg 19', city: 'Düsseldorf', postalCode: '40210', country: 'Germany',
  },
  'Kate': {
    name: 'Kate', email: 'kate@email.com', phone: '+49 100000020', address: 'Kateweg 20', city: 'Leipzig', postalCode: '04109', country: 'Germany',
  },
  'Mona': {
    name: 'Mona', email: 'mona@email.com', phone: '+49 100000021', address: 'Monaplatz 21', city: 'Frankfurt', postalCode: '60311', country: 'Germany',
  },
  'Olivia': {
    name: 'Olivia', email: 'olivia@email.com', phone: '+49 100000023', address: 'Oliviaring 23', city: 'Cologne', postalCode: '50667', country: 'Germany',
  },
  'Peter': {
    name: 'Peter', email: 'peter@email.com', phone: '+49 100000024', address: 'Peterstr. 24', city: 'Hamburg', postalCode: '20095', country: 'Germany',
  },
  'Sam': {
    name: 'Sam', email: 'sam@email.com', phone: '+49 100000026', address: 'Samweg 26', city: 'Stuttgart', postalCode: '70173', country: 'Germany',
  },
};

export function buildTimeline(status: string): any[] {
  const now = new Date();
  function daysAgo(n: number) {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
  const base = [
    { time: daysAgo(4), location: 'Berlin, Germany', status: 'Order Placed', desc: 'Order has been placed and is awaiting processing.' },
    { time: daysAgo(3), location: 'Berlin, Germany', status: 'Pending Pickup', desc: 'Order is ready for pickup by the carrier.' },
    { time: daysAgo(3), location: 'Berlin, Germany', status: 'Picked Up', desc: 'Package picked up by carrier.' },
    { time: daysAgo(2), location: 'Frankfurt, Germany', status: 'In Transit', desc: 'Package is in transit to destination.' },
    { time: daysAgo(1), location: 'Cologne, Germany', status: 'Out for Delivery', desc: 'Package is out for delivery to recipient.' },
    { time: daysAgo(0), location: 'Cologne, Germany', status: 'Delivered', desc: 'Package delivered to recipient.' },
    { time: daysAgo(0), location: 'Cologne, Germany', status: 'Attempt Failed', desc: 'Delivery attempt failed.' },
    { time: daysAgo(0), location: 'Cologne, Germany', status: 'Exception', desc: 'There is an issue with the shipment.' },
  ];
  switch (status) {
    case 'Pending Pickup':
      return base.slice(0, 2);
    case 'In Transit':
      return base.slice(0, 4);
    case 'Out for Delivery':
      return base.slice(0, 5);
    case 'Delivered':
      return base.slice(0, 6);
    case 'Attempt Failed':
      return base.slice(0, 7);
    case 'Exception':
      return base.slice(0, 8);
    default:
      return base.slice(0, 2);
  }
} 