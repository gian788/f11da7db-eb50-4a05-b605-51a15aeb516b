const { cloneDeep, getOr, map, flow, sum, forEach, sortBy } = require('lodash/fp');
const { getCompaniesData, getLandOwnershipData } = require('./data');
const { getCompanyRowString, printSubCompanies } = require('./utils');

const { companiesMap, rootCompaniesMap, parentMap } = getCompaniesData();
const { companyParcels } = getLandOwnershipData();

const populateLandParcelsOwned = (parent) => {
  const { subCompanies = [], id } = parent;
  const directlyOwnedParcels = getOr(0, `${id}.length`, companyParcels);
  const subCompaniesOwnedParcels = flow(map(populateLandParcelsOwned), sum)(subCompanies);
  parent.parcelsCount = directlyOwnedParcels + subCompaniesOwnedParcels;
  return parent.parcelsCount;
};

exports.fromRoot = (companyId) => {
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

exports.expand = (companyId) => {
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
