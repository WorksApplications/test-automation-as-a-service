// FILTERS
const filterByVersions = branch => branch === 'develop' || branch.startsWith('TaaS_')

// MAPS
// 'develop' => { label: 'Latest', value: 'develop' }
const mapToObject = branch => ({
  label: branch,
  value: branch
})

export default {
  filterByVersions,
  mapToObject
}
