import { describe, expect, it } from 'vitest'

import {
  allNodes,
  curriculum,
  getNode,
  isUnlocked,
  nextNodeId,
  nodeOrder,
  totalNodes,
} from '../curriculum'

describe('curriculum shape', () => {
  it('has units, each with at least one node', () => {
    expect(curriculum.length).toBeGreaterThan(0)
    for (const unit of curriculum) {
      expect(unit.nodes.length).toBeGreaterThan(0)
    }
  })

  it('gives every node a unique id', () => {
    expect(new Set(nodeOrder).size).toBe(nodeOrder.length)
  })

  it('tags every node with the unit it came from', () => {
    for (const node of allNodes) {
      expect(node.unitId).toBeTruthy()
      expect(node.unitTitle).toBeTruthy()
    }
  })

  it('keeps totalNodes in step with the node list', () => {
    expect(totalNodes).toBe(allNodes.length)
  })

  it('only contains lessons and challenges', () => {
    for (const node of allNodes) {
      expect(['lesson', 'challenge']).toContain(node.type)
    }
  })

  it('gives every challenge the fields its checker needs', () => {
    for (const node of allNodes.filter((n) => n.type === 'challenge')) {
      expect(node.testCases.length).toBeGreaterThan(0)
      expect(['return', 'stdout']).toContain(node.checkType)
      if (node.checkType === 'return') {
        // The harness calls this by name, so a missing one fails at runtime.
        expect(node.functionName, `${node.id} needs functionName`).toBeTruthy()
      }
    }
  })

  it('awards positive XP for every node', () => {
    for (const node of allNodes) {
      expect(node.xp).toBeGreaterThan(0)
    }
  })
})

describe('getNode', () => {
  it('finds a node by id', () => {
    expect(getNode(nodeOrder[0]).id).toBe(nodeOrder[0])
  })

  it('returns null for an id that does not exist', () => {
    expect(getNode('no-such-node')).toBeNull()
  })
})

describe('isUnlocked', () => {
  it('unlocks the first node with nothing completed', () => {
    expect(isUnlocked(nodeOrder[0], {})).toBe(true)
  })

  it('locks the second node until the first is done', () => {
    expect(isUnlocked(nodeOrder[1], {})).toBe(false)
  })

  it('unlocks the next node once its predecessor is complete', () => {
    expect(isUnlocked(nodeOrder[1], { [nodeOrder[0]]: true })).toBe(true)
  })

  it('does not unlock a node two steps ahead', () => {
    expect(isUnlocked(nodeOrder[2], { [nodeOrder[0]]: true })).toBe(false)
  })

  it('unlocks every node once everything is complete', () => {
    const all = Object.fromEntries(nodeOrder.map((id) => [id, true]))
    for (const id of nodeOrder) {
      expect(isUnlocked(id, all)).toBe(true)
    }
  })
})

describe('nextNodeId', () => {
  it('walks forward through the course order', () => {
    expect(nextNodeId(nodeOrder[0])).toBe(nodeOrder[1])
  })

  it('returns null at the end of the course', () => {
    expect(nextNodeId(nodeOrder[nodeOrder.length - 1])).toBeNull()
  })

  it('returns null for an unknown id', () => {
    expect(nextNodeId('no-such-node')).toBeNull()
  })

  it('can chain from the first node to the last', () => {
    let id = nodeOrder[0]
    let steps = 0
    while (nextNodeId(id)) {
      id = nextNodeId(id)
      steps += 1
    }
    expect(steps).toBe(nodeOrder.length - 1)
    expect(id).toBe(nodeOrder[nodeOrder.length - 1])
  })
})
