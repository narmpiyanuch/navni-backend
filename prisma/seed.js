const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Import the bcryptjs library

const prisma = new PrismaClient();

async function main() {
  await clearDatabase()
  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('password1', 10);
  const hashedPassword2 = await bcrypt.hash('password2', 10);
  const hashedPassword3 = await bcrypt.hash('password3', 10);

  // Create some Users with hashed passwords
  const user1 = await prisma.user.create({
    data: {
      email: 'user12@example.com',
      password: hashedPassword1, // Use the hashed password
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user22@example.com',
      password: hashedPassword2, // Use the hashed password
      role: 'DRIVER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'user23@example.com',
      password: hashedPassword3, // Use the hashed password
      role: 'ADMIN',
    },
  });

  // Create MemberInformation
  const memberInfo1 = await prisma.memberInformation.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      user: { connect: { id: user1.id } },
    },
  });

  const memberInfo2 = await prisma.memberInformation.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '9876543210',
      user: { connect: { id: user2.id } },
    },
  });

  // Create Wallet
  const wallet1 = await prisma.wallet.create({
    data: {
      memberInformation: { connect: { id: memberInfo1.id } },
      amount: 100.0,
    },
  });

  const wallet2 = await prisma.wallet.create({
    data: {
      memberInformation: { connect: { id: memberInfo2.id } },
      amount: 50.0,
    },
  });

  // Create TransactionIn
  const transactionIn1 = await prisma.transactionIn.create({
    data: {
      wallet: { connect: { id: wallet1.id } },
      price: 50.0,
      transactionId: 'TRX001',
    },
  });

  const transactionIn2 = await prisma.transactionIn.create({
    data: {
      wallet: { connect: { id: wallet2.id } },
      price: 25.0,
      transactionId: 'TRX002',
    },
  });

  // Create TransactionOut
  const transactionOut1 = await prisma.transactionOut.create({
    data: {
      wallet: { connect: { id: wallet1.id } },
      price: 10.0,
    },
  });

  const transactionOut2 = await prisma.transactionOut.create({
    data: {
      wallet: { connect: { id: wallet2.id } },
      price: 5.0,
    },
  });

  // Create EmployeeInformation
  const employeeInfo1 = await prisma.employeeInformation.create({
    data: {
      user: { connect: { id: user3.id } },
      firstName: 'Employee1',
      lastName: 'Lastname1',
      idCard: '1234567890123',
      phoneNumber: '9876543210',
      gender: 'MALE',
      status: true,
    },
  });

  const employeeInfo2 = await prisma.employeeInformation.create({
    data: {
      user: { connect: { id: user2.id } },
      firstName: 'Employee2',
      lastName: 'Lastname2',
      idCard: '9876543210987',
      phoneNumber: '1234567890',
      gender: 'FEMALE',
      status: true,
    },
  });

  // Create Carinformation
  const carInfo1 = await prisma.carinformation.create({
    data: {
      employeeInformation: { connect: { id: employeeInfo1.id } },
      quantity: 6,
      plateNumber: 'ABC123',
    },
  });

  const carInfo2 = await prisma.carinformation.create({
    data: {
      employeeInformation: { connect: { id: employeeInfo2.id } },
      quantity: 4,
      plateNumber: 'XYZ456',
    },
  });

  // Create WorkArea
  const workArea1 = await prisma.workArea.create({
    data: {
      areaName: 'Area1',
      status: true,
    },
  });

  const workArea2 = await prisma.workArea.create({
    data: {
      areaName: 'Area2',
      status: true,
    },
  });

  // Create SubAreaStation
  const subAreaStation1 = await prisma.subAreaStation.create({
    data: {
      stationName: 'Station1',
      workArea: { connect: { id: workArea1.id } },
      latitude: 12.3456,
      longitude: 78.9012,
      status: true,
    },
  });

  const subAreaStation2 = await prisma.subAreaStation.create({
    data: {
      stationName: 'Station2',
      workArea: { connect: { id: workArea2.id } },
      latitude: 34.5678,
      longitude: 56.7890,
      status: true,
    },
  });

  // Create Booking
  const booking1 = await prisma.booking.create({
    data: {
      memberInformation: { connect: { id: memberInfo1.id } },
      carInformation: { connect: { id: carInfo1.id } },
      pickedUpStation: { connect: { id: subAreaStation1.id } },
      dropDownStation: { connect: { id: subAreaStation2.id } },
      passenger: 2,
      price: 30.0,
      status: 'WAITING',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      memberInformation: { connect: { id: memberInfo2.id } },
      carInformation: { connect: { id: carInfo2.id } },
      pickedUpStation: { connect: { id: subAreaStation2.id } },
      dropDownStation: { connect: { id: subAreaStation1.id } },
      passenger: 3,
      price: 40.0,
      status: 'COMING',
    },
  });

  console.log('Seeded data successfully');
}

async function clearDatabase() {
  try {

    await prisma.booking.deleteMany();
    await prisma.carinformation.deleteMany();
    await prisma.employeeInformation.deleteMany();
    await prisma.subAreaStation.deleteMany();
    await prisma.workArea.deleteMany();
    await prisma.transactionOut.deleteMany();
    await prisma.transactionIn.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.memberInformation.deleteMany();

    await prisma.user.deleteMany();


    console.log('Cleared database');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
