var procPool = require('./process-pool');

module.exports.deepScan = async function(serial, branch, workspace, logCallback) {
  var args = [];
  args.push('clean');
  args.push('compile');
  args.push('exec:exec');
  args.push('-DskipTests=true');
  args.push('-DoutputDirectory=' + workspace);
  args.push('-Dgit.branch=' + branch);

  var ret = await procPool.spawn(serial, 'mvn', args, {cwd: workspace}, logCallback);
  return ret;
};

module.exports.createReport = async function(serial, workspace, logCallback) {
  // Shell: mvn -B ru.yandex.qatools.allure:allure-maven-plugin:2.5:aggregate -f ${WORKSPACE}/pom.xml
  var ret = await procPool.spawn(serial, 'mvn', ['-B', 'ru.yandex.qatools.allure:allure-maven-plugin:2.5:aggregate'], {cwd: workspace}, logCallback);
  return ret;
};

/**
 * For example: 
 * mvn clean test -e -B -fae \
 *   -DfailIfNoTests=false \
 *   -Dmaven.test.failure.ignore=true \
 *   -Dtaas.platform=ANDROID \
 *   -Dtaas.test.user=hue-root \
 *   -Dtaas.test.password=hue-r00t \
 *   -Dtaas.test.tenantid=jillg-develop \
 *   -Dtest=collaboration.timelinemobile.TimelineTest#testFirstStartInit
 */
module.exports.test = async function (serial, workspace, parameters, logCallback) {
  var args = ['clean', 'test', '-e', '-B', '-fae', '-Dmaven.test.failure.ignore=true'];

  for(var key in parameters) {
    args.push(`-D${key}=${parameters[key]}`);
  }

  var ret = await procPool.spawn(serial, 'mvn', args, {cwd: workspace}, logCallback);
  return ret;
};
