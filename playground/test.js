const start = Date.now();
const lastUpdated = '2018-10-10T10:10:22.896Z';

const diff = (Date.now() - new Date(lastUpdated)) / 1000;

if (diff && lastUpdated) {
 console.log('diff is:' + diff);
}