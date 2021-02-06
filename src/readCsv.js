const fs = require('fs');
const path = require('path');
const { cloneDeep, getOr, map, flow, sum, forEach, times, sortBy } = require('lodash/fp');

// this will give me the name and root company id
const companiesMap = {};
// to get access to the root company and all his sub company in a tree structure
const rootCompaniesMap = {};
// to get all the first level sub companies of a company
const parentMap = {};

fs.readFileSync(path.resolve(__dirname, '../data/company_relations.csv'), 'utf8')
  .split('\n')
  .slice(1) // header row
  .forEach((line) => {
    const [id, name, parentId] = line.split(',');

    companiesMap[id] = { name, parentId };

    if (!parentId) {
      rootCompaniesMap[id] = { name, subCompanies: [] };
    } else if (!parentMap[parentId]) {
      parentMap[parentId] = [id];
    } else {
      parentMap[parentId].push(id);
    }
  });

// populate subCompanies recursively
const getSubCompanies = (parentId, rootId) => {
  const subCompaniesIds = parentMap[parentId] || [];
  const subCompanies = [];
  for (let i = 0; i < subCompaniesIds.length; i += 1) {
    const id = subCompaniesIds[i];
    const company = companiesMap[id];
    subCompanies[i] = { name: company.name, id };
    companiesMap[id].rootId = rootId || parentId;
    if (parentMap[id]) {
      subCompanies[i].subCompanies = getSubCompanies(id, rootId || parentId);
    }
  }
  return subCompanies;
};

Object.entries(rootCompaniesMap).forEach(([rootId, data]) => {
  data.subCompanies = getSubCompanies(rootId);
});

// landId -> companyId map
const landOwnership = {};
// companyId -> [parcelId] map
const companyParcels = {};
fs.readFileSync(path.resolve(__dirname, '../data/land_ownership.csv'), 'utf8')
  .split('\n')
  .slice(1) // header row
  .forEach((line) => {
    const [landId, companyId] = line.split(',');
    landOwnership[landId] = companyId;

    if (companyParcels[companyId]) {
      companyParcels[companyId].push(landId);
    } else {
      companyParcels[companyId] = [landId];
    }

    // Bonus: % owend land parcel
    // const [landId, companyId, percentage] = line.split(',');
    // if (landOwnership[landId]) {
    //   landOwnership[landId].push({ companyId, percentage });
    // } else {
    //   landOwnership[landId] = [{ companyId, percentage }];
    // }
  });

const getCompanyToString = (company) =>
  `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`;

const getCompanyRowString = (company, level, selectedCompanyId) => {
  const prefix = times(() => '  | - ', level).join('');
  const companyStr = getCompanyToString(company);
  return prefix + companyStr + (selectedCompanyId === company.id && ' ***');
};

const populateLandParcelsOwned = (parent) => {
  const { subCompanies = [], id } = parent;
  const directlyOwnedParcels = getOr(0, `${id}.length`, companyParcels);
  const subCompaniesOwnedParcels = flow(map(populateLandParcelsOwned), sum)(subCompanies);
  parent.parcelsCount = directlyOwnedParcels + subCompaniesOwnedParcels;
  return parent.parcelsCount;
};

const printSubCompanies = (companies = [], level = 1, selectedCompanyId) => {
  forEach((company) => {
    console.log(getCompanyRowString(company, level, selectedCompanyId));
    if (company.subCompanies && company.subCompanies.length) {
      printSubCompanies(company.subCompanies, level + 1, selectedCompanyId);
    }
  }, companies);
};

const fromRoot = (companyId) => {
  const company = companiesMap[companyId];
  if (!company) {
    return 'Company not found!';
  }
  const rootId = company.rootId || companyId;
  const rootCompany = cloneDeep(rootCompaniesMap[rootId]);
  populateLandParcelsOwned(rootCompany);

  console.log(`${rootId}; ${rootCompany.name}; owner of ${rootCompany.parcelsCount} land parcels`);
  printSubCompanies(rootCompany.subCompanies, 1, companyId);
};
// fromRoot('C588860501079');

const expand = (companyId) => {
  const company = companiesMap[companyId];
  if (!company) {
    return 'Company not found!';
  }
  let companies = [company];
  if (company.parentId) {
    const siblingsCompany = flow(map((id) => ({ id, ...companiesMap[id] })))(
      parentMap[company.parentId],
    );
    forEach(populateLandParcelsOwned, siblingsCompany);
    companies = [company, ...siblingsCompany];
  }

  companies = sortBy('name', companies);
  forEach((item) => console.log(getCompanyRowString(item, 1, companyId)), companies);
};

expand('C588860501079');
