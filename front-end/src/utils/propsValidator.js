/*
 *  Created by Samuel Tang on 2018.01.26
 *  Description:
 *     This utility module is to provide methods to validate properties in
 *     components.
 */

export default {

  // Todo: Enforce stricter conditions on `branch`
  branch: (val) => val === 'develop' || val.startsWith('TaaS_'),

  viewType: (val) => ['live', 'replay'].indexOf(val) !== -1,

  // UI-related
  size: (val) => ['mini', 'small', 'medium'].indexOf(val) !== -1,
  type: (val) => ['default', 'primary', 'success', 'info', 'warning', 'danger'].indexOf(val) !== -1

}
