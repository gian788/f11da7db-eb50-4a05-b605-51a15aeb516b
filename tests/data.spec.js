const mockFs = require('mock-fs');
const path = require('path');
const { getCompaniesData, getLandOwnershipData } = require('../src/data');

const companyRelationsData = `company_id,name,parent
companyId1,companyName1,companyId2
companyId2,companyName2
companyId3,companyName3,companyId1
companyId4,companyName4`;
const landOwnershipData = `land_id,company_id
parcel1,companyId1
parcel2,companyId1
parcel3,companyId2`;

const dataDirPath = path.resolve(__dirname, '../data/');

describe('getCompaniesData', () => {
  beforeAll(() => {
    mockFs({
      [dataDirPath]: {
        'company_relations.csv': companyRelationsData,
        'land_ownership.csv': landOwnershipData,
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  it('should return `companiesMap` object populated with data from the csv', () => {
    const { companiesMap } = getCompaniesData();

    expect(companiesMap).toEqual({
      companyId1: { name: 'companyName1', parentId: 'companyId2', rootId: 'companyId2' },
      companyId2: { name: 'companyName2', parentId: undefined },
      companyId3: { name: 'companyName3', parentId: 'companyId1', rootId: 'companyId2' },
      companyId4: { name: 'companyName4', parentId: undefined },
    });
  });

  it('should return `parentMap` object populated with data from the csv', () => {
    const { parentMap } = getCompaniesData();

    expect(parentMap).toEqual({
      companyId1: ['companyId3'],
      companyId2: ['companyId1'],
    });
  });

  it('should return `rootCompaniesMap` object populated with data from the csv', () => {
    const { rootCompaniesMap } = getCompaniesData();

    expect(rootCompaniesMap).toEqual({
      companyId2: {
        id: 'companyId2',
        name: 'companyName2',
        subCompanies: [
          {
            id: 'companyId1',
            name: 'companyName1',
            subCompanies: [
              {
                id: 'companyId3',
                name: 'companyName3',
              },
            ],
          },
        ],
      },
      companyId4: { id: 'companyId4', name: 'companyName4', subCompanies: [] },
    });
  });
});

describe('getLandOwnershipData', () => {
  beforeAll(() => {
    mockFs({
      [dataDirPath]: {
        'company_relations.csv': companyRelationsData,
        'land_ownership.csv': landOwnershipData,
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  it('should return `companyParcels` object populated with data from the csv', () => {
    const { companyParcels } = getLandOwnershipData();

    expect(companyParcels).toEqual({
      companyId1: ['parcel1', 'parcel2'],
      companyId2: ['parcel3'],
    });
  });
});
