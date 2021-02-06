const { forEach, times } = require('lodash/fp');

const getCompanyToString = (company) =>
  `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`;

const getCompanyRowString = (company, level, selectedCompanyId) => {
  const prefix = times(() => '  | - ', level).join('');
  const companyStr = getCompanyToString(company);
  return prefix + companyStr + (selectedCompanyId === company.id && ' <---O');
};

const printSubCompanies = (companies = [], level = 1, selectedCompanyId) => {
  forEach((company) => {
    console.log(getCompanyRowString(company, level, selectedCompanyId));
    if (company.subCompanies && company.subCompanies.length) {
      printSubCompanies(company.subCompanies, level + 1, selectedCompanyId);
    }
  }, companies);
};

module.exports = {
  getCompanyToString,
  getCompanyRowString,
  printSubCompanies,
};
