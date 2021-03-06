import { users, modules } from './data';
import { PrismaClient } from '@prisma/client';
import mimeType from 'mime/lite';
import * as crypto from 'crypto';
import prettyBytes from 'pretty-bytes';

const prisma = new PrismaClient();
mimeType.define({ 'application/typescript': ['ts', 'tsx'] }, true);

export async function seed() {
  await prisma.user
    .createMany({
      skipDuplicates: true,
      data: users.map((user) => {
        const { username, fullName, bio, avatar } = user;
        return { username, fullName, bio, avatar };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.usageQuota
    .createMany({
      skipDuplicates: true,
      data: users.map((user) => {
        return {
          username: user.username,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.usageQuotaApi
    .createMany({
      skipDuplicates: true,
      data: users.map((user) => {
        return {
          username: user.username,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.usageQuotaPublish
    .createMany({
      skipDuplicates: true,
      data: users.map((user) => {
        return {
          username: user.username,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.accessToken
    .createMany({
      skipDuplicates: true,
      data: users
        .map((user) => {
          return user.authTokens.map((token) => {
            const hash = crypto.createHash('sha256');
            return {
              username: user.username,
              hash: hash.update(token).digest('hex'),
            };
          });
        })
        .flat(),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.module
    .createMany({
      skipDuplicates: true,
      data: modules.map((moduleData) => {
        return {
          name: moduleData.name,
          authorName: moduleData.author,
          fullName: moduleData.fullname,
          homepage: moduleData.homepage,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.devConfig
    .createMany({
      skipDuplicates: true,
      data: modules.map((moduleData) => {
        return {
          moduleName: moduleData.name,
          authorName: moduleData.author,
          ...moduleData.devConfig,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.publishConfig
    .createMany({
      skipDuplicates: true,
      data: modules.map((moduleData) => {
        return {
          moduleName: moduleData.name,
          authorName: moduleData.author,

          ...moduleData.publishConfig,
        };
      }),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.contribution
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.contributors.map((contributor) => {
            return {
              contributorName: contributor,
              moduleAuthor: moduleData.author,
              moduleName: moduleData.name,
            };
          })
        )
        .flat(),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.version
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.versions.map((version) => {
            return {
              authorName: moduleData.author,
              moduleName: moduleData.name,
              name: version.name,
              main: moduleData.publishConfig.main,
              bin: moduleData.publishConfig.bin,
              publisherName: moduleData.contributors[0],
              manifestid: version.tx,
            };
          })
        )
        .flat(),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.file
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.files.map((file) =>
            moduleData.versions.map((version) => {
              return {
                authorName: moduleData.author,
                moduleName: moduleData.name,
                versionName: version.name,
                path: file,
                size: Math.floor(Math.random() * 1500),
                mimeType: mimeType.getType(file),
              };
            })
          )
        )
        .flat(2),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.thirdPartyHost
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.versions.map((version) => {
            return version.tpdeps.map((dep) => {
              return { hostname: dep.host };
            });
          })
        )
        .flat(2),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.thirdPartyModule
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.versions.map((version) => {
            return version.tpdeps.map((dep) => {
              return {
                hostname: dep.host,
                path: dep.path,
              };
            });
          })
        )
        .flat(2),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.dependencyGraph
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.versions.map((version) => {
            return version.deps.map((dep) => {
              return {
                dependentAuthor: moduleData.author,
                dependentName: moduleData.name,
                dependentVersion: version.name,
                dependencyAuthor: dep.author,
                dependencyName: dep.name,
                dependencyVersion: dep.version,
              };
            });
          })
        )
        .flat(2),
    })
    .then(console.log)
    .catch(console.error);

  await prisma.thirdPartyDependencyGraph
    .createMany({
      skipDuplicates: true,
      data: modules
        .map((moduleData) =>
          moduleData.versions.map((version) => {
            return version.tpdeps.map((dep) => {
              return {
                dependentAuthor: moduleData.author,
                dependentName: moduleData.name,
                dependentVersion: version.name,
                dependencyPath: dep.path,
                dependencyHost: dep.host,
              };
            });
          })
        )
        .flat(2),
    })
    .then(console.log)
    .catch(console.error);

  console.log({
    users: await prisma.user.count(),
    modules: await prisma.module.count(),
    versions: await prisma.version.count(),
    files: await prisma.file.count(),
    data: await prisma.file
      .findMany()
      .then((files) => files.map(({ size }) => size).reduce((a, b) => a + b))
      .then((bytes) => prettyBytes(bytes)),
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
