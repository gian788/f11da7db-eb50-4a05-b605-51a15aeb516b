# LandTech tech test

`node <companyId> --mode=fromRoot`

`node <companyId> --mode=expand`

## Explanation

The idea behind the implementation is to preprocess the data and save it in a way that is convenient to get the information requested from the user.
The initial overhead to preprocess the data and the additional space required to store the data structure is a good trade-off to get better read performance.

This implementation approach assumes that the data is not changing so frequently so the time required to update the data is acceptable.

I decided to duplicate the companies data to make it quicker to get the full company structure given a company id. In this way we need only two access to a document db to get all the data needed.

## Bonus

- To handle the bonus case 1-2 I will use a similar approach storing and array of [{parentId, perc}] in companiesMap and an array of rootId. It will also need a different representation.
- To handle case 3 I would evaluate the adoption of a graph db to store the relationships.
- To get a list of parcels in a specific area for a specific company I would first get all the subCompanies for the specific company and then filter the parcels by geography and companyId

## Notes:

I didn't have time to fix the eslint config to make it work with the test files and prettier
