
const service = {
  isExcludedRequest: (req) => {
    const pathsToExclude = [
      '/sysinfo',
      '/auth/login',
      '/auth/logout'
    ];

    if (req.method === 'GET' ||
        pathsToExclude.includes(req.path) ||
        req.path.startsWith('/internal') ||
        req.path.startsWith('/app')) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = service;
