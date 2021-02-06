const { expect } = require('chai');
const { getCompanyToString, getCompanyRowString } = require('../src/utils');

describe('getCompanyToString', () => {
  it('should return a string representation of the company', () => {
    const company = { id: 'companyId', name: 'companyName', parcelsCount: 10 };

    expect(getCompanyToString(company)).to.equal(
      `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`,
    );
  });
});

describe('getCompanyRowString', () => {
  it('should return a string representation of the company to be printed in a row (level 0, no selected company)', () => {
    const company = { id: 'companyId', name: 'companyName', parcelsCount: 10 };

    expect(getCompanyRowString(company)).to.equal(
      `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`,
    );
  });

  it('should return a string representation of the company to be printed in a row (level 0,  selected company)', () => {
    const company = { id: 'companyId', name: 'companyName', parcelsCount: 10 };

    expect(getCompanyRowString(company, 0, company.id)).to.equal(
      `${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels <---O`,
    );
  });

  it('should return a string representation of the company to be printed in a row (level 1, no selected company)', () => {
    const company = { id: 'companyId', name: 'companyName', parcelsCount: 10 };

    expect(getCompanyRowString(company, 1)).to.equal(
      `  | - ${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`,
    );
  });

  it('should return a string representation of the company to be printed in a row (level 2, no selected company)', () => {
    const company = { id: 'companyId', name: 'companyName', parcelsCount: 10 };

    expect(getCompanyRowString(company, 2)).to.equal(
      `  | -   | - ${company.id}; ${company.name}; owner of ${company.parcelsCount} land parcels`,
    );
  });
});
