import utilsSelectCascade from '@/utils/selectCascade.js'
import _ from 'lodash'

const itemsWithoutChildren = {
  '1': {
    value: 'one',
    label: '1'
  },
  '1.1': {
    value: 'one-point-one',
    label: '1.1'
  },
  '1.2': {
    value: 'one-point-two',
    label: '1.2'
  },
  '1.3': {
    value: 'one-point-three',
    label: '1.3'
  },
  '2': {
    value: 'two',
    label: '2'
  },
  '2.1': {
    value: 'two-point-one',
    label: '2.1'
  },
  '2.1.1': {
    value: 'two-point-one-point-one',
    label: '2.1.1'
  },
  '2.1.1.1': {
    value: 'two-point-one-point-one-point-one',
    label: '2.1.1.1'
  }
}
// Object: With children
const itemsWithChildren = _.cloneDeep(itemsWithoutChildren)
itemsWithChildren['1'].children = [
  itemsWithChildren['1.1'],
  itemsWithChildren['1.2'],
  itemsWithChildren['1.3']
]
itemsWithChildren['2.1.1'].children = [
  itemsWithChildren['2.1.1.1']
]
itemsWithChildren['2.1'].children = [
  itemsWithChildren['2.1.1']
]
itemsWithChildren['2'].children = [
  itemsWithChildren['2.1']
]

describe('utils/selectCascade.js', () => {
  // Test cases
  describe('updateCheckChildren()', () => {
    const fn = utilsSelectCascade.updateCheckChildren
    it('should be able to select one node and update the list', () => {
      /*
        Selected: [1.1]
        Current action: Select 1.2
        Result: [1.1, 1.2]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['1'], itemsWithChildren['1.1'] ]
      ]
      const itemPath = [ itemsWithoutChildren['1'], itemsWithChildren['1.2'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['1'], itemsWithChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithChildren['1.2'] ]
      ])
    })
    it('should be able to unselect one node and update the list', () => {
      /*
        Selected: [1.1, 1.2]
        Current action: Unselect 1.2
        Result: [1.1]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['1'], itemsWithChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithChildren['1.2'] ]
      ]
      const itemPath = [ itemsWithoutChildren['1'], itemsWithChildren['1.2'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['1'], itemsWithChildren['1.1'] ]
      ])
    })
    it('should be able to select one node and merge the tree', () => {
      /*
        Selected: [1.1, 1.3]
        Current action: Select 1.2
        Result: [1]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.3'] ]
      ]
      const itemPath = [ itemsWithoutChildren['1'], itemsWithoutChildren['1.2'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['1'] ]
      ])
    })
    it('should be able to unselect one node and separate the tree', () => {
      /*
        Selected: [1]
        Current action: Unselect 1.2
        Result: [1.1, 1.3]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['1'] ]
      ]
      const itemPath = [ itemsWithoutChildren['1'], itemsWithoutChildren['1.2'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.3'] ]
      ])
    })
    it('should be able to select the whole chain when the level one node is picked', () => {
      /*
        Selected: []
        Current action: Select 2
        Result: [2]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = []
      const itemPath = [ itemsWithoutChildren['2'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['2'] ]
      ])
    })
    it('should be able to select the whole chain when the level two node is picked', () => {
      /*
        Selected: []
        Current action: Select 2.1
        Result: [2]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = []
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['2'] ]
      ])
    })
    it('should be able to select the whole chain when the level three node is picked', () => {
      /*
        Selected: []
        Current action: Select 2.1.1
        Result: [2]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = []
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'], itemsWithoutChildren['2.1.1'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['2'] ]
      ])
    })
    it('should be able to select the whole chain when the level four node is picked', () => {
      /*
        Selected: []
        Current action: Select 2.1.1.1
        Result: [2]
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = []
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'], itemsWithoutChildren['2.1.1'], itemsWithoutChildren['2.1.1.1'] ]
      const checked = true

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([
        [ itemsWithoutChildren['2'] ]
      ])
    })
    it('should be able to unselect the whole chain when the level one node is unpicked', () => {
      /*
        Selected: [2]
        Current action: Unselect 2
        Result: []
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['2'] ]
      ]
      const itemPath = [ itemsWithoutChildren['2'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([])
    })
    it('should be able to unselect the whole chain when the level two node is unpicked', () => {
      /*
        Selected: [2]
        Current action: Unselect 2.1
        Result: []
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['2'] ]
      ]
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([])
    })
    it('should be able to unselect the whole chain when the level three node is unpicked', () => {
      /*
        Selected: [2]
        Current action: Unselect 2.1.1
        Result: []
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['2'] ]
      ]
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'], itemsWithoutChildren['2.1.1'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([])
    })
    it('should be able to select the whole chain when the level four node is unpicked', () => {
      /*
        Selected: [2]
        Current action: Unselect 2.1.1.1
        Result: []
      */
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      const checkedItems = [
        [ itemsWithoutChildren['2'] ]
      ]
      const itemPath = [ itemsWithoutChildren['2'], itemsWithoutChildren['2.1'], itemsWithoutChildren['2.1.1'], itemsWithoutChildren['2.1.1.1'] ]
      const checked = false

      expect(fn(allItems, checkedItems, itemPath, checked)).to.deep.equal([])
    })
  })

  describe('arrayOfPathToObjects()', () => {
    const fn = utilsSelectCascade.arrayOfPathToObjects
    it('should process single nodes', () => {
      // arrayOfPath: [2]
      const arrayOfPath = [
        [ itemsWithoutChildren['2'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        itemsWithChildren['2']
      ])
    })
    it('should not merge independent paths', () => {
      // arrayOfPath: [1.1, 1.3, 2]
      const arrayOfPath = [
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.3'] ],
        [ itemsWithoutChildren['2'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        {
          value: 'one',
          label: '1',
          children: [
            itemsWithChildren['1.1'],
            itemsWithChildren['1.3']
          ]
        },
        itemsWithChildren['2']
      ])
    })
    it('should merge trees if they have common nodes', () => {
      // arrayOfPath: [1.1, 1.2, 1.3]
      const arrayOfPath = [
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.2'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.3'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        itemsWithChildren['1']
      ])
    })
  })

  describe('arrayOfPathToLeaves()', () => {
    const fn = utilsSelectCascade.arrayOfPathToLeaves
    it('should list all leaves', () => {
      const arrayOfPath = [
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.1'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.2'] ],
        [ itemsWithoutChildren['1'], itemsWithoutChildren['1.3'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        itemsWithoutChildren['1.1'],
        itemsWithoutChildren['1.2'],
        itemsWithoutChildren['1.3']
      ])
    })

    it('should expand a parent to its root nodes', () => {
      const arrayOfPath = [
        [ itemsWithoutChildren['1'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        itemsWithoutChildren['1.1'],
        itemsWithoutChildren['1.2'],
        itemsWithoutChildren['1.3']
      ])
    })

    it('should expand recursively', () => {
      const arrayOfPath = [
        [ itemsWithoutChildren['2'] ]
      ]
      const allItems = [
        itemsWithChildren['1'], itemsWithChildren['2']
      ]
      expect(fn(arrayOfPath, allItems)).to.deep.equal([
        itemsWithoutChildren['2.1.1.1']
      ])
    })
  })
})
