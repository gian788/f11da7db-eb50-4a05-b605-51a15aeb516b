const path = require('path');
const readCSV = require('./readCSV');

const companyRelationsFile = path.resolve(__dirname, '../data/company_relations.csv');
const landOwnershipFile = path.resolve(__dirname, '../data/land_ownership.csv');

exports.getCompaniesData = () => {
  // this will give me the name and root company id
  const companiesMap = {};
  // to get access to the root company and all his sub company in a tree structure
  const rootCompaniesMap = {};
  // to get all the first level sub companies of a company
  const parentMap = {};

  readCSV(companyRelationsFile, (line) => {
    const [id, name, parentId] = line.split(',');

    companiesMap[id] = { name, parentId };

    if (!parentId) {
      rootCompaniesMap[id] = { id, name, subCompanies: [] };
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

  return {
    companiesMap,
    rootCompaniesMap,
    parentMap,
  };
};

exports.getLandOwnershipData = () => {
  // landId -> companyId map
  const landOwnership = {};
  // companyId -> [parcelId] map
  const companyParcels = {};
  readCSV(landOwnershipFile, (line) => {
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

  return {
    landOwnership,
    companyParcels,
  };
};
