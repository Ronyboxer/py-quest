/*
 * Validates the curriculum against the REAL Python harness, in Node.
 *
 *   - Loads the exact HARNESS string used in the browser.
 *   - Runs a reference solution for every challenge through _pq_test_return /
 *     _pq_test_stdout and asserts ALL test cases pass.
 *   - Confirms a deliberately-wrong solution FAILS (sanity check on grading).
 *
 * Run with:  node scripts/validate-curriculum.mjs
 */
import { loadPyodide } from 'pyodide'
import { HARNESS } from '../src/lib/pyodideRunner.js'
import { curriculum } from '../src/data/curriculum.js'

// Reference solutions, keyed by node id. stdout challenges read via input().
const solutions = {
  'u1-c1': 'print("Hello, World!")',
  'u1-c2': 'name = input()\nprint(f"Hello, {name}!")',
  'u2-c1': 'a = int(input())\nb = int(input())\nprint(a + b)',
  'u2-c2': 'print(input().upper())',
  'u2-c3': 'print(len(input().split()))',
  'u3-c1': 'n = int(input())\nprint("even" if n % 2 == 0 else "odd")',
  'u3-c2':
    'n = int(input())\nprint("positive" if n > 0 else "negative" if n < 0 else "zero")',
  'u3-c3': 'a=int(input());b=int(input());c=int(input())\nprint(max(a,b,c))',
  'u4-c1': 'n=int(input())\nfor i in range(1,n+1):\n    print(i)',
  'u4-c2': 'n=int(input())\nprint(sum(range(1,n+1)))',
  'u4-c3':
    'n=int(input())\nfor i in range(1,n+1):\n    if i%15==0: print("FizzBuzz")\n    elif i%3==0: print("Fizz")\n    elif i%5==0: print("Buzz")\n    else: print(i)',
  'u5-c1': 'nums=[int(x) for x in input().split()]\nprint(sum(nums))',
  'u5-c2': 'print(len(set(input().split())))',
  'u5-c3':
    'w=input()\nd={}\nfor c in w: d[c]=d.get(c,0)+1\nprint(sorted(d, key=lambda c:(-d[c],c))[0])',
  'u6-c1': 'def add(a,b):\n    return a+b',
  'u6-c2': 'def power(base, exp=2):\n    return base**exp',
  'u6-c3': 'def greet(name):\n    return f"Hello, {name}!"',
  'u7-c1': 'def squares(n):\n    return [x*x for x in range(n)]',
  'u7-c2': 'def evens(nums):\n    return [x for x in nums if x%2==0]',
  'u7-c3': 'def pair_sums(a,b):\n    return [x+y for x,y in zip(a,b)]',
  'u8-c1': 'def reverse(s):\n    return s[::-1]',
  'u8-c2': 'def is_palindrome(s):\n    return s==s[::-1]',
  'u8-c3': 'def count_vowels(s):\n    return sum(1 for c in s if c in "aeiou")',
  'u8-c4': 'def find_max(nums):\n    m=nums[0]\n    for x in nums:\n        if x>m: m=x\n    return m',
  'u8-c5':
    'def two_sum(nums,target):\n    seen={}\n    for i,x in enumerate(nums):\n        if target-x in seen: return [seen[target-x], i]\n        seen[x]=i',
  'u9-c1': 'def factorial(n):\n    return 1 if n<=1 else n*factorial(n-1)',
  'u9-c2': 'def fib(n):\n    a,b=0,1\n    for _ in range(n): a,b=b,a+b\n    return a',
  'u9-c3':
    'def first_dup(nums):\n    seen=set()\n    for x in nums:\n        if x in seen: return x\n        seen.add(x)\n    return -1',
  'u9-c4':
    'def reverse_list(nums):\n    nums=list(nums)\n    i,j=0,len(nums)-1\n    while i<j:\n        nums[i],nums[j]=nums[j],nums[i]\n        i+=1; j-=1\n    return nums',
  'u10-c1':
    'def is_valid(s):\n    pairs={")":"(","]":"[","}":"{"}\n    st=[]\n    for c in s:\n        if c in "([{": st.append(c)\n        elif c in pairs:\n            if not st or st.pop()!=pairs[c]: return False\n    return not st',
  'u10-c2':
    'def binary_search(nums,target):\n    lo,hi=0,len(nums)-1\n    while lo<=hi:\n        mid=(lo+hi)//2\n        if nums[mid]==target: return mid\n        if nums[mid]<target: lo=mid+1\n        else: hi=mid-1\n    return -1',
  'u10-c3':
    'def merge(a,b):\n    i=j=0; out=[]\n    while i<len(a) and j<len(b):\n        if a[i]<=b[j]: out.append(a[i]); i+=1\n        else: out.append(b[j]); j+=1\n    return out+a[i:]+b[j:]',
  'u10-c4':
    'def group_anagrams(words):\n    d={}\n    for w in words:\n        d.setdefault("".join(sorted(w)),[]).append(w)\n    return sorted([sorted(g) for g in d.values()])',
}

const py = await loadPyodide()
await py.runPythonAsync(HARNESS)

const testReturn = py.globals.get('_pq_test_return')
const testStdout = py.globals.get('_pq_test_stdout')

let challenges = 0
let failures = 0

for (const unit of curriculum) {
  for (const node of unit.nodes) {
    if (node.type !== 'challenge') continue
    challenges++
    const sol = solutions[node.id]
    if (!sol) {
      console.error(`✗ ${node.id} — NO reference solution provided`)
      failures++
      continue
    }
    const tests = JSON.stringify(node.testCases)
    const raw =
      node.checkType === 'return'
        ? testReturn(sol, node.functionName, tests)
        : testStdout(sol, tests)
    const res = JSON.parse(raw)
    if (res.error) {
      console.error(`✗ ${node.id} (${node.title}) — harness error:\n${res.error}`)
      failures++
      continue
    }
    const failed = res.results.filter((r) => !r.passed)
    if (failed.length) {
      failures++
      console.error(`✗ ${node.id} (${node.title}) — ${failed.length}/${res.results.length} cases failed`)
      for (const f of failed) {
        console.error(
          `    input=${f.args_repr}  expected=${JSON.stringify(
            f.expected_repr,
          )}  got=${JSON.stringify(f.actual_repr)}${f.error ? '  ERROR' : ''}`,
        )
      }
    } else {
      console.log(`✓ ${node.id} (${node.title}) — ${res.results.length} cases pass`)
    }
  }
}

// Sanity check: a wrong answer must FAIL grading.
const wrong = JSON.parse(testReturn('def add(a,b):\n    return a-b', 'add', JSON.stringify([{ args: [2, 3], expected: 5 }])))
const wrongFailsCorrectly = wrong.results[0] && wrong.results[0].passed === false

console.log('\n──────────────────────────────')
console.log(`Challenges checked: ${challenges}`)
console.log(`Failures:           ${failures}`)
console.log(`Wrong-answer-fails: ${wrongFailsCorrectly ? 'OK' : 'BROKEN'}`)

if (failures || !wrongFailsCorrectly) {
  process.exit(1)
}
console.log('ALL GOOD ✅')
