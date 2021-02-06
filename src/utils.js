const { map, times } = require('lodash/fp');

const getCompanyToString = (company) =>
  `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`;

const getCompanyRowString = (company, level, selectedCompanyId) => {
  const prefix = times(() => '  | - ', level).join('');
  const companyStr = getCompanyToString(company);
  return prefix + companyStr + (selectedCompanyId === company.id ? ' <---O' : '');
};

const getSubCompaniesString = (companies = [], level = 1, selectedCompanyId) =>
  map((company) => {
    let str = getCompanyRowString(company, level, selectedCompanyId);
    if (company.subCompanies && company.subCompanies.length) {
      str += `\n${getSubCompaniesString(company.subCompanies, level + 1, selectedCompanyId)}`;
    }
    return str;
  }, companies).join('\n');

module.exports = {
  getCompanyToString,
  getCompanyRowString,
  getSubCompaniesString,
};
