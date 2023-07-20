/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import "dayjs/locale/id";
import bcrypt from "bcrypt";
import slug from "slug";
import { PrismaClient } from './node_modules/.gen';
const prisma = new PrismaClient();

const main = async () => {
  const now = dayjs().add(7, "hour").toDate();
  const password = await bcrypt.hash("changeme", 10);
  const timestamps = {
    createdAt: now,
    updatedAt: now,
  };

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      username: "superadmin",
      email: "superadmin@test.test",
      password,
      emailVerifiedAt: now,
      ...timestamps,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      username: "owner",
      email: "owner@test.test",
      password,
      emailVerifiedAt: now,
      ...timestamps,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      email: "admin@test.test",
      password,
      emailVerifiedAt: now,
      ...timestamps,
    },
  });

  const picker = await prisma.user.create({
    data: {
      name: "Picker",
      username: "picker",
      email: "picker@test.test",
      password,
      emailVerifiedAt: now,
      ...timestamps,
    }
  });

  await prisma.role.createMany({
    data: [
      {
        name: "Superadmin",
      },
      {
        name: "Owner",
      },
      {
        name: "Admin",
      },
      {
        name: "Picker",
      },
    ],
  });

  const roles = await prisma.role.findMany();

  roles.forEach(async (role: any): Promise<any> => {
    await prisma.userHasRole.createMany({
      data: [
        {
          userId:
            role.id === 1
              ? superAdmin.id
              : role.id === 2
              ? admin.id
              : role.id === 3
              ? owner.id
              : picker.id,
          roleId: role.id,
          ...timestamps,
        },
      ],
    });
  });

  const organization = await prisma.organization.create({
    data: {
      name: "Andromedia Wareify",
      slug: slug("Andromedia Wareify"),
      code: "ORG-001",
      description: "Andromedia Wareify",
      phone: "081234567890",
      email: "andromedia@wareify.com",
      website: "https://www.wareify.com",
      address: "Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan",
      logo: "https://www.wareify.com/logo.png",
      ...timestamps,
    }
  });

  await prisma.warehouse.createMany({
    data: [
      {
        name: "Gudang 1",
        organizationId: organization.id,
        slug: slug("Gudang 1"),
        code: "WH-001",
        description: "Gudang 1",
        phone: "081234567890",
        email: "gudang1@wareify.com",
        address: "Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan",
        ...timestamps,
      },
      {
        name: "Gudang 2",
        organizationId: organization.id,
        slug: slug("Gudang 2"),
        code: "WH-002",
        description: "Gudang 2",
        phone: "081234567890",
        email: "gudang2@wareify.com",
        address: "Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan",
        ...timestamps,
      }
    ]
  });

  await prisma.area.createMany({
    data: [
      {
        name: "Area 1",
        warehouseId: 1,
        slug: slug("Area 1"),
        code: "AREA-001",
        description: "Area 1",
        ...timestamps,
      },
      {
        name: "Area 2",
        warehouseId: 2,
        slug: slug("Area 2"),
        code: "AREA-002",
        description: "Area 2",
        ...timestamps,
      }
    ]
  });

  await prisma.bin.createMany({
    data: [
      {
        name: "Bin 1",
        areaId: 1,
        slug: slug("Bin 1"),
        code: "BIN-001",
        capacity: 100,
        description: "Bin 1",
        ...timestamps,
      },
      {
        name: "Bin 2",
        areaId: 2,
        slug: slug("Bin 2"),
        code: "BIN-002",
        capacity: 100,
        description: "Bin 2",
        ...timestamps,
      }
    ]
  });

  await prisma.productType.createMany({
    data: [
      {
        name: "Product Type 1",
        organizationId: organization.id,
        slug: slug("Product Type 1"),
        description: "Product Type 1",
        ...timestamps,
      },
      {
        name: "Product Type 2",
        organizationId: organization.id,
        slug: slug("Product Type 2"),
        description: "Product Type 2",
        ...timestamps,
      }
    ]
  });

  for(let i = 1; i <= 10; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        organizationId: organization.id,
        productTypeId: i%2 === 0 ? 1 : 2,
        slug: slug(`Product ${i}`),
        sku: `SKU-${i}`,
        description: `Product ${i}`,
        code: `PRD-${i}`,
        ...timestamps,
      }
    });
  }

};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: any) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
